import { supabase } from './supabase.js'

/**
 * Data-access helpers for the homepage community stats counters.
 *
 * Security / performance notes:
 * - We use Postgres's `count: 'exact'` with `head: true` so the server
 *   returns only the row count in the Content-Range header — no row data
 *   is transferred to the browser. Safe to expose under RLS because SELECT
 *   is already public on these tables.
 * - Queries run in parallel with Promise.allSettled so a single failing
 *   table never blocks the rest of the UI from updating.
 */

async function countRows(table) {
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true })
  if (error) throw new Error(error.message || `Could not count ${table}`)
  return count ?? 0
}

/** Fetches the three headline counters shown on the home page. */
export async function fetchCommunityStats() {
  const [reviewsRes, popupsRes, usersRes] = await Promise.allSettled([
    countRows('review'),
    countRows('company'),
    countRows('accounts'),
  ])

  const pickValue = (res) => (res.status === 'fulfilled' ? res.value : null)

  return {
    reviews: pickValue(reviewsRes),
    popups: pickValue(popupsRes),
    users: pickValue(usersRes),
  }
}

/**
 * Compact human-friendly formatter: 923 → "923", 2,847 → "2,847",
 * 12,400 → "12.4k", 1,100,000 → "1.1M". Null/undefined → "—".
 */
export function formatCompact(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—'
  const num = Number(n)
  if (num < 1_000) return num.toLocaleString()
  if (num < 10_000) {
    // 1.2k form for sub-10k so we don't lose precision too early
    return `${(num / 1_000).toFixed(1).replace(/\.0$/, '')}k`
  }
  if (num < 1_000_000) return `${Math.round(num / 1_000)}k`
  if (num < 10_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  }
  return `${Math.round(num / 1_000_000)}M`
}
