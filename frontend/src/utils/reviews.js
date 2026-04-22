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
 */

export const PROOF_BUCKET = 'review-proofs'
const MAX_PROOF_BYTES = 5 * 1024 * 1024
const ALLOWED_PROOF_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])

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

  return { bucket: PROOF_BUCKET, path }
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
        vibe,
        queue_speed,
        goodie_bag_quality,
        items_secured,
        reason_visit,
        hear_about,
        comments,
        date,
        company:company_id ( company_name ),
        account:account_id ( display_name, avatar_url )
      `
    )
    .order('date', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message || 'Failed to load reviews')
  return data ?? []
}
