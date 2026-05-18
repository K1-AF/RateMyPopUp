/**
 * Lightweight chart primitives for the admin dashboard (no extra chart deps).
 */

function barWidthPct(value, max = 5) {
  if (!Number.isFinite(value) || value <= 0) return 0
  return Math.min(100, (value / max) * 100)
}

export function AdminRatingBars({ title, companies }) {
  if (!companies?.length) {
    return (
      <div className="admin-chart admin-chart--empty">
        <p className="admin-chart__title">{title}</p>
        <p className="admin-chart__hint">No companies to chart.</p>
      </div>
    )
  }

  const metrics = [
    { key: 'overallAvg', label: 'Overall' },
    { key: 'vibeAvg', label: 'Vibe' },
    { key: 'queueAvg', label: 'Queue' },
    { key: 'goodieAvg', label: 'Goodie' },
  ]

  return (
    <div className="admin-chart" role="img" aria-label={title}>
      <p className="admin-chart__title">{title}</p>
      <div className="admin-chart__rating-grid">
        {companies.map((c) => (
          <div key={c.companyId} className="admin-chart__company-block">
            <p className="admin-chart__company-name">{c.companyName}</p>
            {metrics.map((m) => {
              const v = c.summary?.[m.key]
              const w = barWidthPct(v, 5)
              return (
                <div key={m.key} className="admin-chart__row">
                  <span className="admin-chart__row-label">{m.label}</span>
                  <div className="admin-chart__bar-track">
                    <div
                      className="admin-chart__bar-fill"
                      style={{ width: `${w}%` }}
                      title={Number.isFinite(v) ? `${m.label}: ${v.toFixed(2)} / 5` : '—'}
                    />
                  </div>
                  <span className="admin-chart__row-value">{Number.isFinite(v) ? v.toFixed(2) : '—'}</span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export function AdminTimelineBars({ title, buckets }) {
  if (!buckets?.length) {
    return (
      <div className="admin-chart admin-chart--empty">
        <p className="admin-chart__title">{title}</p>
        <p className="admin-chart__hint">No dated reviews in the current filter.</p>
      </div>
    )
  }

  const max = Math.max(...buckets.map((b) => b.count), 1)

  return (
    <div className="admin-chart" role="img" aria-label={title}>
      <p className="admin-chart__title">{title}</p>
      <div className="admin-chart__timeline">
        {buckets.map((b) => (
          <div key={b.month} className="admin-chart__timeline-cell">
            <div
              className="admin-chart__timeline-bar"
              style={{ height: `${(b.count / max) * 100}%` }}
              title={`${b.month}: ${b.count} review(s)`}
            />
            <span className="admin-chart__timeline-label">{b.month}</span>
            <span className="admin-chart__timeline-count">{b.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
