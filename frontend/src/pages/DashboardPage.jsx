import { useCallback, useEffect, useMemo, useState } from 'react'
import { CHART_COLORS, DashboardHistogram } from '../components/dashboard/DashboardHistogram.jsx'
import {
  fetchDashboardBundle,
  probeDashboardColumns,
  resolveDashboardRange,
} from '../utils/dashboardStats.js'
import './DashboardPage.css'

const PRESETS = [
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: '90d', label: 'Last 90 days' },
  { id: '365d', label: 'Last 12 months' },
  { id: 'all', label: 'Last 48 months (chart)' },
  { id: 'custom', label: 'Custom range' },
]

function formatInt(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—'
  return Number(n).toLocaleString()
}

function formatRangeLabel(range) {
  if (!range?.start || !range?.end) return ''
  const a = new Date(range.start)
  const b = new Date(range.end)
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return ''
  const opts = { dateStyle: 'medium' }
  return `${a.toLocaleDateString(undefined, opts)} – ${b.toLocaleDateString(undefined, opts)}`
}

export default function DashboardPage() {
  const [preset, setPreset] = useState('30d')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bundle, setBundle] = useState(null)
  const [columns, setColumns] = useState({
    reviewDate: true,
    accountsCreatedAt: true,
  })

  const rangePreview = useMemo(
    () => resolveDashboardRange(preset, customFrom, customTo),
    [preset, customFrom, customTo]
  )

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      if (preset === 'custom' && customFrom && customTo) {
        const a = new Date(`${customFrom}T00:00:00`).getTime()
        const b = new Date(`${customTo}T23:59:59.999`).getTime()
        if (!Number.isNaN(a) && !Number.isNaN(b) && a > b) {
          setBundle(null)
          setError('Custom range: “From” must be on or before “Through”.')
          setLoading(false)
          return
        }
      }
      const probed = await probeDashboardColumns()
      setColumns({
        reviewDate: probed.reviewDate,
        accountsCreatedAt: probed.accountsCreatedAt,
      })
      const data = await fetchDashboardBundle(preset, customFrom, customTo, {
        reviewDate: probed.reviewDate,
        accountsCreatedAt: probed.accountsCreatedAt,
      })
      setBundle(data)
    } catch (err) {
      setBundle(null)
      setError(err?.message || 'Failed to load dashboard.')
    } finally {
      setLoading(false)
    }
  }, [preset, customFrom, customTo])

  useEffect(() => {
    load()
  }, [load])

  const rangeLabel = bundle ? formatRangeLabel(bundle.range) : formatRangeLabel(rangePreview)

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__inner">
        <header className="dashboard-page__header">
          <div>
            <h1 className="dashboard-page__title">Dashboard</h1>
            <p className="dashboard-page__subtitle">
              Site-wide totals and activity over time. Reviews use each row&apos;s{' '}
              <code>date</code>; new users use <code>created_at</code> on accounts when available.
            </p>
          </div>
          <button type="button" className="btn btn-secondary" onClick={load} disabled={loading}>
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </header>

        <section className="dashboard-toolbar" aria-label="Time range">
          <div className="dashboard-toolbar__presets">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`dashboard-preset${preset === p.id ? ' dashboard-preset--active' : ''}`}
                onClick={() => setPreset(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
          {preset === 'custom' ? (
            <div className="dashboard-toolbar__custom">
              <label className="dashboard-field">
                <span>From</span>
                <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
              </label>
              <label className="dashboard-field">
                <span>Through</span>
                <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
              </label>
            </div>
          ) : null}
          <p className="dashboard-toolbar__meta">
            <strong>Window:</strong> {rangeLabel}
            {bundle?.range?.mode === 'day' ? ' · Daily buckets' : ' · Monthly buckets'}
            {bundle?.range?.isAllTime ? ' · “All time” chart shows the last 48 months.' : ''}
          </p>
        </section>

        {error ? (
          <p className="dashboard-page__error" role="alert">
            {error}
          </p>
        ) : null}

        {bundle?.warnings?.length ? (
          <ul className="dashboard-page__warnings" role="status">
            {bundle.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        ) : null}

        <section className="dashboard-cards" aria-label="Summary counts">
          <article className="dashboard-card">
            <h2 className="dashboard-card__title">Reviews</h2>
            <p className="dashboard-card__total">{formatInt(bundle?.totals?.reviews)}</p>
            <p className="dashboard-card__label">All time</p>
            <p className="dashboard-card__period">
              In window: <strong>{formatInt(bundle?.period?.reviews)}</strong>
            </p>
          </article>
          <article className="dashboard-card">
            <h2 className="dashboard-card__title">Users</h2>
            <p className="dashboard-card__total">{formatInt(bundle?.totals?.users)}</p>
            <p className="dashboard-card__label">All time (accounts)</p>
            <p className="dashboard-card__period">
              In window: <strong>{formatInt(bundle?.period?.users)}</strong>
            </p>
          </article>
          <article className="dashboard-card">
            <h2 className="dashboard-card__title">Companies</h2>
            <p className="dashboard-card__total">{formatInt(bundle?.totals?.companies)}</p>
            <p className="dashboard-card__label">All time</p>
          </article>
        </section>

        <section className="dashboard-charts" aria-label="Charts">
          <DashboardHistogram
            title="Reviews over time"
            subtitle={`Bucket: ${bundle?.range?.mode === 'day' ? 'day' : 'month'}`}
            buckets={bundle?.series?.reviews?.buckets}
            emptyHint="No reviews in this window."
            color={CHART_COLORS.reviews}
          />
          <DashboardHistogram
            title="New users over time"
            subtitle={columns.accountsCreatedAt ? 'By account created_at' : 'Column not available'}
            buckets={bundle?.series?.users?.buckets}
            emptyHint={
              columns.accountsCreatedAt ? 'No new users in this window.' : 'Add created_at to accounts or adjust RLS.'
            }
            color={CHART_COLORS.users}
          />
        </section>
      </div>
    </div>
  )
}
