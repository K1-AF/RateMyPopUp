import { useMemo } from 'react'

/** Reference palette: navy, terracotta, teal (one per dashboard series). */
export const CHART_COLORS = {
  reviews: '#1A2B44',
  users: '#4A8E8E',
}

function buildLinePath(points) {
  if (!points.length) return ''
  const [first, ...rest] = points
  let d = `M ${first.x} ${first.y}`
  for (const p of rest) {
    d += ` L ${p.x} ${p.y}`
  }
  return d
}

/** Round the Y-axis ceiling to a clean step (e.g. 7 → 10, 23 → 25). */
function niceYMax(maxCount) {
  if (maxCount <= 0) return 5
  if (maxCount <= 5) return 5
  const magnitude = 10 ** Math.floor(Math.log10(maxCount))
  const norm = maxCount / magnitude
  let nice = 10
  if (norm <= 1) nice = 1
  else if (norm <= 2) nice = 2
  else if (norm <= 5) nice = 5
  return nice * magnitude
}

function buildYTicks(yMax, divisions = 5) {
  const step = yMax / divisions
  const ticks = []
  for (let i = divisions; i >= 0; i -= 1) {
    ticks.push(Math.round(i * step))
  }
  return ticks
}

/** Shorter tick text for `YYYY-MM-DD` / `YYYY-MM` bucket keys. */
function shortAxisLabel(label) {
  const day = label.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (day) {
    const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][
      Number(day[2]) - 1
    ]
    return `${mo} ${Number(day[3])}`
  }
  const ym = label.match(/^(\d{4})-(\d{2})$/)
  if (ym) {
    const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][
      Number(ym[2]) - 1
    ]
    return mo
  }
  return label
}

export function DashboardHistogram({ title, subtitle, buckets, emptyHint, color = CHART_COLORS.reviews }) {
  const chart = useMemo(() => {
    if (!buckets?.length) {
      return { points: [], linePath: '', yTicks: [5, 4, 3, 2, 1, 0], yMax: 5, padL: 0, padR: 0, baselineY: 90 }
    }

    const maxCount = Math.max(...buckets.map((b) => b.count), 0)
    const yMax = niceYMax(maxCount)
    const yTicks = buildYTicks(yMax)
    const n = buckets.length

    const padL = 0.5
    const padR = 0.5
    const padTop = 4
    const padBottom = 2
    const baselineY = 100 - padBottom
    const innerW = 100 - padL - padR
    const innerH = baselineY - padTop

    const pts = buckets.map((b, i) => {
      const x = n === 1 ? padL + innerW / 2 : padL + (i / (n - 1)) * innerW
      const ratio = yMax > 0 ? b.count / yMax : 0
      const y = padTop + innerH * (1 - ratio)
      return { x, y, count: b.count, label: b.label }
    })

    return {
      points: pts,
      linePath: buildLinePath(pts),
      yTicks,
      yMax,
      padL,
      padR,
      baselineY,
    }
  }, [buckets])

  if (!buckets?.length) {
    return (
      <div className="dash-chart dash-chart--empty" role="img" aria-label={title}>
        <div className="dash-chart__head">
          <p className="dash-chart__title">{title}</p>
          {subtitle ? <p className="dash-chart__subtitle">{subtitle}</p> : null}
        </div>
        <p className="dash-chart__hint">{emptyHint || 'No data in this range.'}</p>
      </div>
    )
  }

  /* ~4–6 x labels like the reference (Jan, Apr, Jul, Oct). */
  const targetLabels = Math.min(6, Math.max(4, Math.ceil(buckets.length / 8)))
  const labelStep = Math.max(1, Math.ceil(buckets.length / targetLabels))
  const xLabels = buckets
    .map((b, i) => ({ ...b, i }))
    .filter((b) => b.i % labelStep === 0 || b.i === buckets.length - 1)

  return (
    <div className="dash-chart" role="img" aria-label={title}>
      <div className="dash-chart__head">
        <p className="dash-chart__title">{title}</p>
        {subtitle ? <p className="dash-chart__subtitle">{subtitle}</p> : null}
      </div>

      <div className="dash-chart__figure">
        <div className="dash-chart__yaxis" aria-hidden>
          {chart.yTicks.map((tick) => (
            <span key={tick} className="dash-chart__ylabel">
              {tick}
            </span>
          ))}
        </div>

        <div className="dash-chart__plot-wrap">
          <div className="dash-chart__plot">
            <svg
              className="dash-chart__svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              <line
                className="dash-chart__baseline"
                x1={chart.padL}
                y1={chart.baselineY}
                x2={100 - chart.padR}
                y2={chart.baselineY}
              />
              {chart.linePath ? (
                <path
                  className="dash-chart__line"
                  d={chart.linePath}
                  fill="none"
                  style={{ stroke: color }}
                  vectorEffect="nonScalingStroke"
                />
              ) : null}
            </svg>
          </div>

          <div className="dash-chart__xaxis">
            {xLabels.map((b) => (
              <span
                key={b.key}
                className="dash-chart__xlabel"
                style={{
                  left: `${
                    buckets.length === 1 ? 50 : (b.i / (buckets.length - 1)) * 100
                  }%`,
                }}
                title={`${b.label}: ${b.count}`}
              >
                {shortAxisLabel(b.label)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
