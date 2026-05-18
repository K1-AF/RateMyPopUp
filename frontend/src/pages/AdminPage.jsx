import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchAdminCompanyReport } from '../utils/adminReport.js'
import './AdminPage.css'

function formatDateTime(value) {
  if (!value) return '—'
  const dt = new Date(value)
  if (Number.isNaN(dt.getTime())) return '—'
  return dt.toLocaleString()
}

function fmtAvg(value) {
  if (!Number.isFinite(value)) return '—'
  return `${value.toFixed(2)} / 5`
}

function fmtPct(value) {
  if (!Number.isFinite(value)) return '—'
  return `${value.toFixed(0)}%`
}

function reviewerLabel(review) {
  if (review.reviewerName && review.reviewerName.trim()) return review.reviewerName
  if (review.accountId) return `User ${String(review.accountId).slice(0, 8)}…`
  return 'Unknown'
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [report, setReport] = useState({ companies: [], totals: { companyCount: 0, reviewCount: 0, commentsCount: 0 } })
  const [lastUpdated, setLastUpdated] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchAdminCompanyReport()
      setReport(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err?.message || 'Failed to load admin report.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const totals = useMemo(() => report.totals || {}, [report])

  return (
    <div className="admin-page">
      <div className="admin-page__inner">
        <header className="admin-page__header">
          <div>
            <h1 className="admin-page__title">Admin Company Report</h1>
            <p className="admin-page__subtitle">
              Full company-level review data for analysis and PDF export.
            </p>
            <p className="admin-page__meta">
              Last updated: {lastUpdated ? lastUpdated.toLocaleString() : '—'}
            </p>
          </div>
          <div className="admin-page__actions no-print">
            <button type="button" className="btn btn-secondary" onClick={load} disabled={loading}>
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => window.print()}
              disabled={loading}
            >
              Export PDF
            </button>
          </div>
        </header>

        <section className="admin-summary" aria-label="Global totals">
          <div className="admin-summary__item">
            <p className="admin-summary__label">Companies</p>
            <p className="admin-summary__value">{totals.companyCount ?? 0}</p>
          </div>
          <div className="admin-summary__item">
            <p className="admin-summary__label">Reviews</p>
            <p className="admin-summary__value">{totals.reviewCount ?? 0}</p>
          </div>
          <div className="admin-summary__item">
            <p className="admin-summary__label">Comments</p>
            <p className="admin-summary__value">{totals.commentsCount ?? 0}</p>
          </div>
        </section>

        {error ? (
          <p className="admin-page__error" role="alert">
            {error}
          </p>
        ) : null}

        {!loading && !error && report.companies.length === 0 ? (
          <p className="admin-page__empty">No companies or reviews found.</p>
        ) : null}

        {!error &&
          report.companies.map((company) => (
            <section key={company.companyId} className="admin-company" aria-label={company.companyName}>
              <header className="admin-company__header">
                <h2 className="admin-company__title">{company.companyName}</h2>
                <span className="admin-company__count">{company.summary.reviewCount} reviews</span>
              </header>

              <div className="admin-company__metrics">
                <p>
                  <strong>Overall:</strong> {fmtAvg(company.summary.overallAvg)}
                </p>
                <p>
                  <strong>Vibe:</strong> {fmtAvg(company.summary.vibeAvg)}
                </p>
                <p>
                  <strong>Queue:</strong> {fmtAvg(company.summary.queueAvg)}
                </p>
                <p>
                  <strong>Goodie Quality:</strong> {fmtAvg(company.summary.goodieAvg)}
                </p>
                <p>
                  <strong>Perception Lift:</strong> {fmtAvg(company.summary.perceptionAvg)}
                </p>
                <p>
                  <strong>Purchase rate:</strong> {fmtPct(company.summary.purchaseRate)}
                </p>
                <p>
                  <strong>Heard-before rate:</strong> {fmtPct(company.summary.heardBeforeRate)}
                </p>
              </div>

              {company.reviews.length === 0 ? (
                <p className="admin-company__empty">No reviews yet.</p>
              ) : (
                <div className="admin-company__table-wrap">
                  <table className="admin-company__table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Reviewer</th>
                        <th>Vibe</th>
                        <th>Queue</th>
                        <th>Goodie</th>
                        <th>Perception</th>
                        <th>Purchased</th>
                        <th>Heard Before</th>
                        <th>Attended With</th>
                        <th>Discovery</th>
                        <th>Items Secured</th>
                        <th>Reason Visit</th>
                        <th>Comment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {company.reviews.map((review) => (
                        <tr key={review.reviewId}>
                          <td>{formatDateTime(review.date)}</td>
                          <td>{reviewerLabel(review)}</td>
                          <td>{review.vibe || '—'}</td>
                          <td>{review.queueSpeed || '—'}</td>
                          <td>{review.goodieQuality || '—'}</td>
                          <td>{review.brandPerceptionLikert || '—'}</td>
                          <td>{review.purchasedAtPopup ? 'Yes' : 'No'}</td>
                          <td>{review.heardBrandBefore ? 'Yes' : 'No'}</td>
                          <td>{review.attendedWith || '—'}</td>
                          <td>{review.hearAbout || '—'}</td>
                          <td>{review.itemsSecured.join(', ') || '—'}</td>
                          <td>{review.reasonVisit.join(', ') || '—'}</td>
                          <td>{review.comments?.trim() || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}
      </div>
    </div>
  )
}

