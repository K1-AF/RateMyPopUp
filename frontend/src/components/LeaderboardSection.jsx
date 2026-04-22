import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { fetchLeaderboard } from '../utils/leaderboard.js'
import { supabase } from '../utils/supabase.js'
import {
  IconClock,
  IconStarFilled,
  IconTrendDown,
  IconTrendUp,
} from './Icons.jsx'
import './LeaderboardSection.css'

const TABS = [
  { id: 'best', label: 'Best', icon: IconTrendUp },
  { id: 'worst', label: 'Worst', icon: IconTrendDown },
  { id: 'queue', label: 'Queue', icon: IconClock },
]

function rankBadgeClass(rank) {
  if (rank === 1) return 'leaderboard-rank--first'
  if (rank === 3) return 'leaderboard-rank--third'
  return 'leaderboard-rank--muted'
}

/** Which score column a given tab showcases in the star on the right. */
function primaryScore(tab, row) {
  if (tab === 'queue') return Number(row.avg_queue_speed ?? 0)
  return Number(row.avg_overall ?? 0)
}

/**
 * Home leaderboards: Best / Worst / Queue — driven by the
 * `company_leaderboard` view and auto-refreshed via Realtime on `review`.
 */
export function LeaderboardSection() {
  const [tab, setTab] = useState('best')
  const [rowsByTab, setRowsByTab] = useState({ best: [], worst: [], queue: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const mountedRef = useRef(true)

  const tabId = useId()
  const panelId = `${tabId}-panel`

  /**
   * Pull all three lists in parallel. We refresh the whole set — not just
   * the active tab — because Realtime fires once and the user may flip tabs
   * before the next INSERT arrives.
   */
  const refresh = useCallback(async () => {
    setError('')
    try {
      const [best, worst, queue] = await Promise.all([
        fetchLeaderboard('best', 5),
        fetchLeaderboard('worst', 5),
        fetchLeaderboard('queue', 5),
      ])
      if (!mountedRef.current) return
      setRowsByTab({ best, worst, queue })
    } catch (err) {
      if (!mountedRef.current) return
      setError(err?.message || 'Could not load leaderboard')
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    refresh()

    /*
     * Realtime: any insert / update / delete on `public.review` triggers a
     * refresh. We debounce to avoid a storm if many reviews land at once.
     */
    let debounceId = null
    const scheduleRefresh = () => {
      if (debounceId) window.clearTimeout(debounceId)
      debounceId = window.setTimeout(() => {
        refresh()
      }, 400)
    }

    const channel = supabase
      .channel('public:review:leaderboard')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'review' },
        scheduleRefresh
      )
      .subscribe()

    return () => {
      mountedRef.current = false
      if (debounceId) window.clearTimeout(debounceId)
      supabase.removeChannel(channel)
    }
  }, [refresh])

  const onSelectTab = useCallback((id) => setTab(id), [])

  const rows = rowsByTab[tab] ?? []
  const showEmpty = !loading && rows.length === 0 && !error

  return (
    <section
      id="section-leaderboard"
      className="leaderboard-section"
      aria-labelledby="leaderboard-heading"
    >
      <div className="leaderboard-section__inner">
        <h2 id="leaderboard-heading" className="leaderboard-section__title">
          <span className="leaderboard-section__trophy" aria-hidden>
            🏆
          </span>{' '}
          Leaderboards
        </h2>

        <div
          className="leaderboard-tabs"
          role="tablist"
          aria-label="Leaderboard sort"
        >
          {TABS.map((item) => {
            const { id, label, icon } = item
            const TabIcon = icon
            const selected = tab === id
            return (
              <button
                key={id}
                type="button"
                role="tab"
                id={`${tabId}-tab-${id}`}
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                className={`leaderboard-tab ${selected ? 'leaderboard-tab--active' : ''}`}
                onClick={() => onSelectTab(id)}
              >
                <TabIcon className="leaderboard-tab__icon" ariaHidden />
                {label}
              </button>
            )
          })}
        </div>

        <ul
          id={panelId}
          className="leaderboard-list"
          role="tabpanel"
          aria-labelledby={`${tabId}-tab-${tab}`}
          aria-busy={loading}
        >
          {error ? (
            <li className="leaderboard-card leaderboard-card--state" role="alert">
              {error}
            </li>
          ) : loading ? (
            <li className="leaderboard-card leaderboard-card--state">Loading…</li>
          ) : showEmpty ? (
            <li className="leaderboard-card leaderboard-card--state">
              No reviews yet — be the first to rate a pop-up.
            </li>
          ) : (
            rows.map((row, index) => {
              const rank = index + 1
              const score = primaryScore(tab, row)
              return (
                <li
                  key={`${tab}-${row.company_id}`}
                  className="leaderboard-card"
                >
                  <div
                    className={`leaderboard-rank ${rankBadgeClass(rank)}`}
                    aria-label={`Rank ${rank}`}
                  >
                    {rank}
                  </div>
                  <div className="leaderboard-card__main">
                    <p className="leaderboard-card__title">{row.company_name}</p>
                    <p className="leaderboard-card__meta">
                      {Number(row.review_count).toLocaleString()}{' '}
                      {row.review_count === 1 ? 'review' : 'reviews'}
                    </p>
                  </div>
                  <div
                    className="leaderboard-card__score"
                    title={`${score.toFixed(1)} out of 5`}
                  >
                    <IconStarFilled
                      className="leaderboard-card__star"
                      ariaHidden
                    />
                    <span className="leaderboard-card__rating">
                      {score.toFixed(1)}
                    </span>
                  </div>
                </li>
              )
            })
          )}
        </ul>
      </div>
    </section>
  )
}
