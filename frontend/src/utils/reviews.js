import { supabase } from './supabase.js'

/**
 * Data-access helpers for the `review` / `company` tables.
 *
 * Security notes:
 * - Every mutation here assumes an authenticated session. The backend RLS
 *   policies are the real guard; these checks just fail fast in the UI so
 *   users get clearer errors before a round-trip.
 * - Proof uploads go to the `review-proofs` bucket under the user's own
 *   `auth.uid()` folder so storage RLS scopes access to that user only.
 * - We serialize array fields (items_secured, reason_visit) as JSON text
 *   because the existing columns are `varchar`. Readers should JSON.parse
 *   with a try/catch and fall back to splitting on comma.
 * - Experience extras: brand_perception_likert (1–5), purchased_at_popup,
 *   heard_brand_before, attended_with — see migration 0004_review_experience_questions.sql
 */

export const PROOF_BUCKET = 'review-proofs'
export const MAX_PROOF_BYTES = 5 * 1024 * 1024
export const ALLOWED_PROOF_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])

const MIN_PROOF_DIMENSION = 32
const MAX_PROOF_DIMENSION = 8000

/** Parses stored proof JSON from the review row. */
export function parseProof(raw) {
  if (!raw) return null
  if (typeof raw === 'object' && raw.bucket && raw.path) return raw
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      if (parsed?.bucket && parsed?.path) return parsed
    } catch {
      /* not JSON */
    }
  }
  return null
}

/**
 * Resolves a browser-loadable URL for a stored proof image (sync fallback).
 * Prefer resolveProofDisplayUrl() for the home feed — private buckets need signed URLs.
 */
export function getProofDisplayUrl(proof) {
  const meta = parseProof(proof)
  if (!meta) return null
  if (typeof meta.publicUrl === 'string' && meta.publicUrl.startsWith('http')) {
    return meta.publicUrl
  }
  const bucket = meta.bucket || PROOF_BUCKET
  const { data } = supabase.storage.from(bucket).getPublicUrl(meta.path)
  return data?.publicUrl ?? null
}

/** Signed URL lifetime when loading proofs on the public home feed (24h). */
const PROOF_SIGNED_URL_SECONDS = 60 * 60 * 24

/**
 * Resolves a loadable proof URL for display (home carousel, company pages).
 * Uses signed URLs so private `review-proofs` buckets work with public read policy.
 */
export async function resolveProofDisplayUrl(proof) {
  const meta = parseProof(proof)
  if (!meta?.path) return null

  const bucket = meta.bucket || PROOF_BUCKET

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(meta.path, PROOF_SIGNED_URL_SECONDS)

  if (!error && data?.signedUrl) {
    return data.signedUrl
  }

  return getProofDisplayUrl(proof)
}

async function attachProofUrlsToReviews(rows) {
  if (!rows?.length) return rows ?? []
  return Promise.all(
    rows.map(async (row) => {
      if (!row.proof) return row
      const proofUrl = await resolveProofDisplayUrl(row.proof)
      return proofUrl ? { ...row, proofUrl } : row
    })
  )
}

/**
 * Client-side proof validation: MIME whitelist, size cap, and decode check
 * so renamed/non-image files cannot slip through.
 */
export async function validateProofImage(file) {
  if (!file) {
    return { ok: false, error: 'No file selected.' }
  }
  if (!ALLOWED_PROOF_TYPES.has(file.type)) {
    return { ok: false, error: 'Please upload a JPEG, PNG, WebP, or GIF image.' }
  }
  if (file.size > MAX_PROOF_BYTES) {
    return { ok: false, error: 'Image must be 5MB or smaller.' }
  }
  if (file.size < 100) {
    return { ok: false, error: 'That file is too small to be a valid photo.' }
  }

  const objectUrl = URL.createObjectURL(file)
  try {
    const img = await decodeImage(objectUrl)
    if (img.naturalWidth < MIN_PROOF_DIMENSION || img.naturalHeight < MIN_PROOF_DIMENSION) {
      return { ok: false, error: 'Image must be at least 32×32 pixels.' }
    }
    if (img.naturalWidth > MAX_PROOF_DIMENSION || img.naturalHeight > MAX_PROOF_DIMENSION) {
      return { ok: false, error: 'Image dimensions are too large (max 8000×8000).' }
    }
    return { ok: true, width: img.naturalWidth, height: img.naturalHeight }
  } catch {
    return { ok: false, error: 'That file could not be read as an image. Try another photo.' }
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

function decodeImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('decode failed'))
    img.src = url
  })
}

export function parseMultiField(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed
    if (typeof parsed === 'string') return [parsed]
  } catch {
    /* not JSON — treat as plain string */
  }
  return String(raw)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

/**
 * Escapes the % and _ wildcards in a user-supplied substring so PostgREST's
 * ILIKE matcher treats them as literal characters instead of wildcards.
 */
function escapeIlike(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/([%_])/g, '\\$1')
}

/**
 * Typeahead search over companies. Case-insensitive substring match.
 * Safe to call on every keystroke — we escape wildcards and hard-cap the
 * returned rows, and RLS limits visibility to what the user can already see.
 */
export async function searchCompanies(query, limit = 8) {
  const trimmed = (query ?? '').trim()
  if (trimmed.length < 1) return []
  const escaped = escapeIlike(trimmed)
  const { data, error } = await supabase
    .from('company')
    .select('company_id, company_name')
    .ilike('company_name', `%${escaped}%`)
    .order('company_name', { ascending: true })
    .limit(Math.max(1, Math.min(20, limit)))
  if (error) throw new Error(error.message || 'Failed to search companies')
  return data ?? []
}

/**
 * Fetches companies for the Explore page with optional case-insensitive search.
 * Input is escaped to prevent wildcard-expansion abuse in ILIKE patterns.
 */
export async function fetchCompanies({ query = '', limit = 120 } = {}) {
  const trimmed = String(query ?? '').trim()
  const cappedLimit = Math.max(1, Math.min(250, Number(limit) || 120))

  let qb = supabase
    .from('company')
    .select('company_id, company_name')
    .order('company_name', { ascending: true })
    .limit(cappedLimit)

  if (trimmed.length > 0) {
    const escaped = escapeIlike(trimmed)
    qb = qb.ilike('company_name', `%${escaped}%`)
  }

  const { data, error } = await qb
  if (error) throw new Error(error.message || 'Failed to load companies')
  return data ?? []
}

/**
 * Loads a single company by id for the company detail page.
 */
export async function fetchCompanyById(companyId) {
  const safeCompanyId = String(companyId ?? '').trim()
  if (!safeCompanyId || safeCompanyId.length > 64) {
    throw new Error('Invalid company id.')
  }

  const { data, error } = await supabase
    .from('company')
    .select('company_id, company_name')
    .eq('company_id', safeCompanyId)
    .maybeSingle()

  if (error) throw new Error(error.message || 'Failed to load company')
  if (!data) throw new Error('Company not found.')
  return data
}

/**
 * Fetches the newest reviews for one company.
 */
export async function fetchReviewsForCompany(companyId, limit = 50) {
  const safeCompanyId = String(companyId ?? '').trim()
  const cappedLimit = Math.max(1, Math.min(100, Number(limit) || 50))
  if (!safeCompanyId || safeCompanyId.length > 64) {
    throw new Error('Invalid company id.')
  }

  const { data, error } = await supabase
    .from('review')
    .select(
      `
        review_id,
        account_id,
        company_id,
        vibe,
        queue_speed,
        goodie_bag_quality,
        items_secured,
        reason_visit,
        hear_about,
        comments,
        date,
        account:account_id ( display_name )
      `
    )
    .eq('company_id', safeCompanyId)
    .order('date', { ascending: false })
    .limit(cappedLimit)

  if (error) throw new Error(error.message || 'Failed to load company reviews')
  return data ?? []
}

/**
 * Loads review rows for a set of exact timestamps so collab siblings (same
 * submission moment) can be grouped into a combined company title.
 */
export async function fetchReviewsByDates(dates, limit = 500) {
  const uniqueDates = Array.isArray(dates)
    ? [...new Set(dates.map((d) => String(d ?? '').trim()).filter(Boolean))]
    : []
  if (uniqueDates.length === 0) return []

  const cappedLimit = Math.max(1, Math.min(1000, Number(limit) || 500))
  const { data, error } = await supabase
    .from('review')
    .select(
      `
        review_id,
        account_id,
        company_id,
        vibe,
        queue_speed,
        goodie_bag_quality,
        items_secured,
        reason_visit,
        hear_about,
        comments,
        date,
        company:company_id ( company_name )
      `
    )
    .in('date', uniqueDates)
    .limit(cappedLimit)

  if (error) throw new Error(error.message || 'Failed to load collaborative reviews')
  return data ?? []
}

/** Resolves (or creates) a company row by name and returns its uuid. */
export async function getOrCreateCompanyId(name) {
  const trimmed = (name ?? '').trim()
  if (!trimmed) throw new Error('Company name is required')

  const { data, error } = await supabase.rpc('get_or_create_company', {
    p_name: trimmed,
  })
  if (error) throw new Error(error.message || 'Could not resolve company')
  if (!data) throw new Error('Could not resolve company')
  return data
}

/** Uploads a proof image to storage under `<uid>/<review>/<timestamp>.ext`. */
export async function uploadReviewProof({ file, userId, reviewId }) {
  if (!file) return null
  if (!ALLOWED_PROOF_TYPES.has(file.type)) {
    throw new Error('Unsupported image type.')
  }
  if (file.size > MAX_PROOF_BYTES) {
    throw new Error('Image must be 5MB or smaller.')
  }

  const ext = file.name.includes('.')
    ? file.name.split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '')
    : 'jpg'
  const safeExt = ext.length > 0 && ext.length <= 5 ? ext : 'jpg'
  const path = `${userId}/${reviewId}/${Date.now()}.${safeExt}`

  const { error: upErr } = await supabase.storage
    .from(PROOF_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })
  if (upErr) throw new Error(upErr.message || 'Upload failed')

  const { data: publicData } = supabase.storage.from(PROOF_BUCKET).getPublicUrl(path)
  return {
    bucket: PROOF_BUCKET,
    path,
    publicUrl: publicData?.publicUrl ?? null,
  }
}

/**
 * Inserts a review. Returns the newly created row (includes review_id).
 * Row Level Security enforces `auth.uid() = account_id` server-side.
 */
export async function insertReview(payload) {
  const { data, error } = await supabase
    .from('review')
    .insert(payload)
    .select()
    .single()
  if (error) throw new Error(error.message || 'Failed to save review')
  return data
}

/** Updates the proof JSON for an existing review (used after file upload). */
export async function attachProofToReview(reviewId, proofJson) {
  const { error } = await supabase
    .from('review')
    .update({ proof: proofJson })
    .eq('review_id', reviewId)
  if (error) throw new Error(error.message || 'Failed to attach proof')
}

/** Fetches the newest reviews for the home carousel (public read). */
export async function fetchRecentReviews(limit = 10) {
  const { data, error } = await supabase
    .from('review')
    .select(
      `
        review_id,
        account_id,
        vibe,
        queue_speed,
        goodie_bag_quality,
        items_secured,
        reason_visit,
        hear_about,
        comments,
        date,
        proof,
        company:company_id ( company_name ),
        account:account_id ( display_name, avatar_url )
      `
    )
    .order('date', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message || 'Failed to load reviews')
  return attachProofUrlsToReviews(data ?? [])
}
