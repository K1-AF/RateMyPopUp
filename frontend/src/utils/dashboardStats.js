import { supabase } from './supabase.js'

/**
 * Site-wide dashboard metrics (reviews, accounts) with time ranges
 * and client-side histogram bucketing.
 *
 * Security:
 * - Intended for admin UI only; pair with <RequireAdmin /> on the route.
 * - Relies on Supabase RLS for what each role can read. Uses minimal selects
 *   (`date` / `created_at` only) for charts to reduce data exposure.
 * - Caps paginated reads so one visit cannot unbounded-scan huge tables.
 */

const PAGE_SIZE = 1000
const MAX_CHART_ROWS = 35_000

function pad2(n) {
  return String(n).padStart(2, '0')
}

function startOfLocalDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function endOfLocalDay(d) {
  const x = new Date(d)
  x.setHours(23, 59, 59, 999)
  return x
}

function parseYmd(str) {
  if (!str || typeof str !== 'string') return null
  const [y, m, day] = str.split('-').map((x) => parseInt(x, 10))
  if (!y || !m || !day) return null
  const d = new Date(y, m - 1, day)
  if (Number.isNaN(d.getTime())) return null
  return d
}

/** Which timestamp columns exist (avoid hard-failing if schema differs). */
export async function probeDashboardColumns() {
  const review = await supabase.from('review').select('date').limit(1)
  const accounts = await supabase.from('accounts').select('created_at').limit(1)
  return {
    reviewDate: !review.error,
    accountsCreatedAt: !accounts.error,
    errors: {
      review: review.error?.message,
      accounts: accounts.error?.message,
    },
  }
}

async function countExact(table, filters) {
  let q = supabase.from(table).select('*', { count: 'exact', head: true })
  for (const { column, op, value } of filters) {
    if (value == null || value === '') continue
    if (op === 'gte') q = q.gte(column, value)
    if (op === 'lte') q = q.lte(column, value)
  }
  const { count, error } = await q
  if (error) throw new Error(error.message || `Count failed: ${table}`)
  return count ?? 0
}

function dayKeyLocal(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function monthKeyLocal(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`
}

function bucketModeForRange(start, end) {
  const ms = end.getTime() - start.getTime()
  const days = ms / 86_400_000
  if (days <= 40) return 'day'
  return 'month'
}

function incrementBucket(map, key) {
  if (!key) return
  map.set(key, (map.get(key) || 0) + 1)
}

function bucketTimestamps(timestamps, mode) {
  const map = new Map()
  for (const t of timestamps) {
    const key = mode === 'day' ? dayKeyLocal(t) : monthKeyLocal(t)
    incrementBucket(map, key)
  }
  return map
}

/** Ordered { key, label, count } for chart, filling empty slots in range. */
export function buildFilledBuckets(rangeStart, rangeEnd, timestamps, mode) {
  const counts = bucketTimestamps(timestamps, mode)
  const out = []

  if (mode === 'day') {
    const lastDay = startOfLocalDay(rangeEnd)
    for (let d = startOfLocalDay(rangeStart); d.getTime() <= lastDay.getTime(); d.setDate(d.getDate() + 1)) {
      const key = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
      out.push({
        key,
        label: key,
        count: counts.get(key) || 0,
      })
    }
    return out
  }

  const startMonth = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), 1)
  const endMonth = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), 1)
  for (let d = new Date(startMonth); d.getTime() <= endMonth.getTime(); d.setMonth(d.getMonth() + 1)) {
    const key = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`
    out.push({ key, label: key, count: counts.get(key) || 0 })
  }
  return out
}

async function fetchTimestampPage(table, column, fromIso, toIso, offset, limit) {
  const { data, error } = await supabase
    .from(table)
    .select(column)
    .gte(column, fromIso)
    .lte(column, toIso)
    .order(column, { ascending: true })
    .range(offset, offset + limit - 1)
  if (error) throw new Error(error.message || `Failed to read ${table}`)
  return data ?? []
}

/**
 * Pulls only the timestamp column for rows in [rangeStart, rangeEnd] (paginated).
 */
export async function fetchTimestampsInRange(table, column, rangeStart, rangeEnd, maxRows = MAX_CHART_ROWS) {
  const fromIso = rangeStart.toISOString()
  const toIso = rangeEnd.toISOString()
  const timestamps = []
  let offset = 0
  let truncated = false

  while (timestamps.length < maxRows) {
    const page = await fetchTimestampPage(table, column, fromIso, toIso, offset, PAGE_SIZE)
    if (!page.length) break
    for (const row of page) {
      const v = row[column]
      if (v) timestamps.push(v)
    }
    if (page.length < PAGE_SIZE) break
    offset += PAGE_SIZE
    if (timestamps.length >= maxRows) {
      truncated = true
      break
    }
  }

  return { timestamps, truncated }
}

/**
 * @param {'7d'|'30d'|'90d'|'365d'|'all'|'custom'} preset
 * @param {string} [customFrom] YYYY-MM-DD
 * @param {string} [customTo] YYYY-MM-DD
 */
export function resolveDashboardRange(preset, customFrom, customTo) {
  const now = new Date()
  const end = endOfLocalDay(customTo ? parseYmd(customTo) || now : now)

  if (preset === 'custom') {
    const fromD = customFrom ? parseYmd(customFrom) : null
    const start = fromD ? startOfLocalDay(fromD) : startOfLocalDay(new Date(end.getTime() - 29 * 86_400_000))
    return { start, end, isAllTime: false }
  }

  if (preset === 'all') {
    const raw = new Date(end)
    raw.setMonth(raw.getMonth() - 48)
    const start = startOfLocalDay(raw)
    return { start, end, isAllTime: true }
  }

  const days = { '7d': 7, '30d': 30, '90d': 90, '365d': 365 }[preset] ?? 30
  const start = startOfLocalDay(new Date(end.getTime() - (days - 1) * 86_400_000))
  return { start, end, isAllTime: false }
}

export async function fetchDashboardBundle(preset, customFrom, customTo, columns) {
  const { start, end, isAllTime } = resolveDashboardRange(preset, customFrom, customTo)
  const mode = bucketModeForRange(start, end)

  const warnings = []
  const totals = {
    reviews: await countExact('review', []),
    companies: await countExact('company', []),
    users: await countExact('accounts', []),
  }

  const reviewCol = columns.reviewDate ? 'date' : null
  const accountsCol = columns.accountsCreatedAt ? 'created_at' : null

  let periodReviews = null
  let periodUsers = null

  if (reviewCol) {
    periodReviews = await countExact('review', [
      { column: reviewCol, op: 'gte', value: start.toISOString() },
      { column: reviewCol, op: 'lte', value: end.toISOString() },
    ])
  }
  if (accountsCol) {
    periodUsers = await countExact('accounts', [
      { column: accountsCol, op: 'gte', value: start.toISOString() },
      { column: accountsCol, op: 'lte', value: end.toISOString() },
    ])
  }

  const series = {
    reviews: { buckets: [], truncated: false, available: Boolean(reviewCol) },
    users: { buckets: [], truncated: false, available: Boolean(accountsCol) },
  }

  if (reviewCol) {
    const { timestamps, truncated } = await fetchTimestampsInRange('review', reviewCol, start, end)
    series.reviews.truncated = truncated
    series.reviews.buckets = buildFilledBuckets(start, end, timestamps, mode)
    if (truncated) warnings.push('Review chart truncated after large row cap; narrow the date range for full detail.')
  } else {
    warnings.push('Review table has no readable `date` column for this session.')
  }

  if (accountsCol) {
    const { timestamps, truncated } = await fetchTimestampsInRange('accounts', accountsCol, start, end)
    series.users.truncated = truncated
    series.users.buckets = buildFilledBuckets(start, end, timestamps, mode)
    if (truncated) warnings.push('User chart truncated after large row cap.')
  } else {
    warnings.push(
      'User timeline needs a `created_at` column on `accounts` for period counts and charts.'
    )
  }

  return {
    totals,
    period: {
      reviews: periodReviews,
      users: periodUsers,
    },
    series,
    range: { start: start.toISOString(), end: end.toISOString(), mode, isAllTime },
    warnings,
  }
}
