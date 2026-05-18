import { supabase } from './supabase.js'

/**
 * Leaderboard data-access.
 *
 * Reads from the `public.company_leaderboard` view (see migration 0003).
 * The view is driven by RLS on the underlying `company` / `review` tables
 * so we don't need any special client-side access checks here.
 *
 * - "best":     highest overall score (avg of vibe/queue/goodie)
 * - "worst":    lowest overall score
 * - "queue":    highest queue-speed score (fastest-moving queues)
 * - "freebies": highest goodie-bag quality score
 *
 * Each variant requires at least one review for the company — companies
 * that exist but have never been reviewed won't appear on the board.
 */

const TABS = new Set(['best', 'worst', 'queue', 'freebies'])

export async function fetchLeaderboard(tab, limit = 5) {
  if (!TABS.has(tab)) throw new Error(`Unknown leaderboard tab: ${tab}`)

  let query = supabase
    .from('company_leaderboard')
    .select(
      'company_id, company_name, review_count, avg_vibe, avg_queue_speed, avg_goodie, avg_overall'
    )
    .gt('review_count', 0)

  if (tab === 'best') {
    query = query.order('avg_overall', { ascending: false, nullsFirst: false })
  } else if (tab === 'worst') {
    query = query.order('avg_overall', { ascending: true, nullsFirst: false })
  } else if (tab === 'queue') {
    query = query.order('avg_queue_speed', { ascending: false, nullsFirst: false })
  } else if (tab === 'freebies') {
    query = query.order('avg_goodie', { ascending: false, nullsFirst: false })
  }

  // Secondary sort by review_count so ties feel "fair": more data → higher.
  query = query.order('review_count', { ascending: false }).limit(limit)

  const { data, error } = await query
  if (error) throw new Error(error.message || 'Failed to load leaderboard')
  return data ?? []
}
