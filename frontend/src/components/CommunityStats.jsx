import { useEffect, useState } from 'react'
import { fetchCommunityStats, formatCompact } from '../utils/stats.js'

/**
 * Live community counters: reviews, pop-ups (companies), users (accounts).
 * Falls back to a dash while loading so the section height stays stable.
 */
export function CommunityStats() {
  const [stats, setStats] = useState({ reviews: null, popups: null, users: null })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchCommunityStats()
      .then((next) => {
        if (cancelled) return
        setStats(next)
        setLoaded(true)
      })
      .catch((err) => {
        console.warn('[home] stats failed:', err?.message)
        if (!cancelled) setLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="stats" className="stats" aria-label="Community stats">
      <div className="stats__inner">
        <div className="stat" aria-busy={!loaded}>
          <span className="stat-value text-brand">{formatCompact(stats.reviews)}</span>
          <span className="stat-label">Reviews</span>
        </div>
        <div className="stat" aria-busy={!loaded}>
          <span className="stat-value text-brand">{formatCompact(stats.popups)}</span>
          <span className="stat-label">Pop-Ups</span>
        </div>
        <div className="stat" aria-busy={!loaded}>
          <span className="stat-value text-brand">{formatCompact(stats.users)}</span>
          <span className="stat-label">Users</span>
        </div>
      </div>
    </section>
  )
}
