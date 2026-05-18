import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AdminRatingBars, AdminTimelineBars } from '../components/admin/AdminAnalyticsCharts.jsx'
import {
  ADMIN_COMPARE_MAX,
  buildFilteredCompanyList,
  buildMonthlyBuckets,
  chartCompaniesFromSelection,
  collectReviewsForTimeline,
} from '../utils/adminAnalytics.js'
import { fetchAdminCompanyReport } from '../utils/adminReport.js'
import './AdminPage.css'

const SORT_OPTIONS = [
  { value: 'reviews_desc', label: 'Reviews (most first)' },
  { value: 'reviews_asc', label: 'Reviews (fewest first)' },
  { value: 'name_asc', label: 'Name A–Z' },
  { value: 'name_desc', label: 'Name Z–A' },
  { value: 'overall_desc', label: 'Overall rating (high)' },
  { value: 'overall_asc', label: 'Overall rating (low)' },
  { value: 'vibe_desc', label: 'Vibe (high)' },
  { value: 'purchase_desc', label: 'Purchase rate (high)' },
  { value: 'newest_activity', label: 'Latest review (newest first)' },
  { value: 'oldest_activity', label: 'Earliest review (oldest first)' },
]

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
  const [searchParams, setSearchParams] = useSearchParams()
  const focusedCompanyId = searchParams.get('company') || ''

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [report, setReport] = useState({
    companies: [],
    totals: { companyCount: 0, reviewCount: 0, commentsCount: 0 },
  })
  const [lastUpdated, setLastUpdated] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('reviews_desc')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [minReviews, setMinReviews] = useState('')
  const [hideEmptyInRange, setHideEmptyInRange] = useState(false)
  const [compareIds, setCompareIds] = useState([])

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

  const filterOptions = useMemo(
    () => ({
      searchQuery,
      dateFrom,
      dateTo,
      minReviews,
      sortBy,
      hideCompaniesWithNoReviewsInRange: hideEmptyInRange,
    }),
    [searchQuery, dateFrom, dateTo, minReviews, sortBy, hideEmptyInRange]
  )

  const filteredCompanies = useMemo(
    () => buildFilteredCompanyList(report.companies, filterOptions),
    [report.companies, filterOptions]
  )

  const focusedCompany = useMemo(
    () => filteredCompanies.find((c) => c.companyId === focusedCompanyId) ?? null,
    [filteredCompanies, focusedCompanyId]
  )

  const isFocused = Boolean(focusedCompany)

  const displayCompanies = useMemo(() => {
    if (!isFocused) return filteredCompanies
    return focusedCompany ? [focusedCompany] : []
  }, [filteredCompanies, focusedCompany, isFocused])

  useEffect(() => {
    if (focusedCompanyId && !focusedCompany && !loading) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.delete('company')
          return next
        },
        { replace: true }
      )
    }
  }, [focusedCompanyId, focusedCompany, loading, setSearchParams])

  const focusCompany = useCallback(
    (companyId) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (companyId) next.set('company', companyId)
          else next.delete('company')
          return next
        },
        { replace: false }
      )
    },
    [setSearchParams]
  )

  const clearFocus = useCallback(() => focusCompany(''), [focusCompany])

  const visibleIds = useMemo(() => new Set(filteredCompanies.map((c) => c.companyId)), [filteredCompanies])

  useEffect(() => {
    if (isFocused) {
      setCompareIds([])
      return
    }
    setCompareIds((prev) => prev.filter((id) => visibleIds.has(id)))
  }, [visibleIds, isFocused])

  const summaryStats = useMemo(() => {
    if (isFocused && focusedCompany) {
      return {
        labelSuffix: ' (this company)',
        companyCount: 1,
        reviewCount: focusedCompany.summary.reviewCount,
        commentsCount: focusedCompany.summary.commentsCount,
      }
    }
    return {
      labelSuffix: ' (filtered list)',
      companyCount: filteredCompanies.length,
      reviewCount: filteredCompanies.reduce((s, c) => s + c.summary.reviewCount, 0),
      commentsCount: filteredCompanies.reduce((s, c) => s + c.summary.commentsCount, 0),
    }
  }, [isFocused, focusedCompany, filteredCompanies])

  const timelineBuckets = useMemo(() => {
    const all = collectReviewsForTimeline(displayCompanies)
    return buildMonthlyBuckets(all)
  }, [displayCompanies])

  const chartCompanies = useMemo(() => {
    if (isFocused && focusedCompany) return [focusedCompany]
    return chartCompaniesFromSelection(filteredCompanies, compareIds)
  }, [isFocused, focusedCompany, filteredCompanies, compareIds])

  const compareCompanies = useMemo(
    () =>
      compareIds
        .map((id) => filteredCompanies.find((x) => x.companyId === id))
        .filter(Boolean)
        .slice(0, ADMIN_COMPARE_MAX),
    [compareIds, filteredCompanies]
  )

  const toggleCompare = useCallback((companyId) => {
    setCompareIds((prev) => {
      if (prev.includes(companyId)) return prev.filter((id) => id !== companyId)
      if (prev.length >= ADMIN_COMPARE_MAX) return prev
      return [...prev, companyId]
    })
  }, [])

  const clearCompare = useCallback(() => setCompareIds([]), [])

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    Boolean(dateFrom) ||
    Boolean(dateTo) ||
    Boolean(String(minReviews).trim()) ||
    hideEmptyInRange ||
    isFocused

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
              {totals.companyCount != null ? (
                <>
                  {' '}
                  · All data: {totals.companyCount} companies, {totals.reviewCount} reviews
                </>
              ) : null}
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

        <section className="admin-summary" aria-label={isFocused ? 'Company totals' : 'Filtered totals'}>
          <div className="admin-summary__item">
            <p className="admin-summary__label">Companies{summaryStats.labelSuffix}</p>
            <p className="admin-summary__value">{summaryStats.companyCount}</p>
          </div>
          <div className="admin-summary__item">
            <p className="admin-summary__label">Reviews{summaryStats.labelSuffix}</p>
            <p className="admin-summary__value">{summaryStats.reviewCount}</p>
          </div>
          <div className="admin-summary__item">
            <p className="admin-summary__label">Comments{summaryStats.labelSuffix}</p>
            <p className="admin-summary__value">{summaryStats.commentsCount}</p>
          </div>
        </section>

        {isFocused && focusedCompany ? (
          <section className="admin-focus-banner no-print" aria-label="Company focus">
            <div className="admin-focus-banner__text">
              <p className="admin-focus-banner__label">Viewing company</p>
              <h2 className="admin-focus-banner__name">{focusedCompany.companyName}</h2>
            </div>
            <button type="button" className="btn btn-secondary" onClick={clearFocus}>
              ← All companies
            </button>
          </section>
        ) : null}

        <section className="admin-toolbar no-print" aria-label="Filter and sort companies">
          <div className="admin-toolbar__row">
            <label className="admin-toolbar__field">
              <span className="admin-toolbar__label">Jump to company</span>
              <select
                className="admin-toolbar__select"
                value={focusedCompanyId}
                onChange={(e) => focusCompany(e.target.value)}
              >
                <option value="">All companies — overview</option>
                {filteredCompanies.map((c) => (
                  <option key={c.companyId} value={c.companyId}>
                    {c.companyName} ({c.summary.reviewCount} reviews)
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-toolbar__field">
              <span className="admin-toolbar__label">Search companies</span>
              <input
                type="search"
                className="admin-toolbar__input"
                placeholder="Name contains…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                spellCheck="false"
              />
            </label>
            <label className="admin-toolbar__field">
              <span className="admin-toolbar__label">Sort by</span>
              <select className="admin-toolbar__select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-toolbar__field admin-toolbar__field--narrow">
              <span className="admin-toolbar__label">Min reviews</span>
              <input
                type="number"
                min={0}
                step={1}
                className="admin-toolbar__input"
                placeholder="0"
                value={minReviews}
                onChange={(e) => setMinReviews(e.target.value)}
              />
            </label>
          </div>
          <div className="admin-toolbar__row">
            <label className="admin-toolbar__field">
              <span className="admin-toolbar__label">Reviews from (date)</span>
              <input
                type="date"
                className="admin-toolbar__input"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </label>
            <label className="admin-toolbar__field">
              <span className="admin-toolbar__label">Reviews through (date)</span>
              <input
                type="date"
                className="admin-toolbar__input"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </label>
            <label className="admin-toolbar__check">
              <input
                type="checkbox"
                checked={hideEmptyInRange}
                onChange={(e) => setHideEmptyInRange(e.target.checked)}
                disabled={!dateFrom && !dateTo}
              />
              <span>Hide companies with zero reviews in range</span>
            </label>
          </div>
          <p className="admin-toolbar__meta">
            {isFocused && focusedCompany ? (
              <>
                Stats for <strong>{focusedCompany.companyName}</strong>
                {hasActiveFilters ? ' with current filters applied' : ''}. Date filters still apply to
                reviews shown below.
              </>
            ) : (
              <>
                Showing <strong>{summaryStats.companyCount}</strong> companies,{' '}
                <strong>{summaryStats.reviewCount}</strong> reviews
                {hasActiveFilters ? ' (filters applied)' : ''}. Click a company or use the dropdown to view one
                company only. Compare up to {ADMIN_COMPARE_MAX} companies; charts use your selection when set.
              </>
            )}
          </p>
        </section>

        {!isFocused && filteredCompanies.length > 0 ? (
          <section className="admin-company-index no-print" aria-label="Company list">
            <h2 className="admin-company-index__title">Companies</h2>
            <ul className="admin-company-index__list">
              {filteredCompanies.map((c) => (
                <li key={c.companyId}>
                  <button
                    type="button"
                    className="admin-company-index__btn"
                    onClick={() => focusCompany(c.companyId)}
                  >
                    <span className="admin-company-index__name">{c.companyName}</span>
                    <span className="admin-company-index__meta">
                      {c.summary.reviewCount} reviews · {fmtAvg(c.summary.overallAvg)} overall
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="admin-charts no-print" aria-label="Charts">
          <AdminRatingBars
            title={
              isFocused && focusedCompany
                ? `Rating breakdown — ${focusedCompany.companyName}`
                : compareIds.length
                  ? `Rating breakdown — selected (${Math.min(compareIds.length, ADMIN_COMPARE_MAX)} companies)`
                  : `Rating breakdown — top ${Math.min(chartCompanies.length, ADMIN_COMPARE_MAX)} by current sort`
            }
            companies={chartCompanies}
          />
          <AdminTimelineBars
            title={
              isFocused && focusedCompany
                ? `Reviews per month — ${focusedCompany.companyName}`
                : 'Reviews per month (filtered list)'
            }
            buckets={timelineBuckets}
          />
        </div>

        {!isFocused && compareCompanies.length > 0 ? (
          <section className="admin-compare no-print" aria-label="Company comparison">
            <div className="admin-compare__head">
              <h2 className="admin-compare__title">Compare companies</h2>
              <button type="button" className="btn btn-secondary" onClick={clearCompare}>
                Clear selection
              </button>
            </div>
            <div className="admin-compare__table-wrap">
              <table className="admin-compare__table">
                <thead>
                  <tr>
                    <th scope="col">Metric</th>
                    {compareCompanies.map((c) => (
                      <th key={c.companyId} scope="col">
                        {c.companyName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Reviews</th>
                    {compareCompanies.map((c) => (
                      <td key={c.companyId}>{c.summary.reviewCount}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">Overall</th>
                    {compareCompanies.map((c) => (
                      <td key={c.companyId}>{fmtAvg(c.summary.overallAvg)}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">Vibe</th>
                    {compareCompanies.map((c) => (
                      <td key={c.companyId}>{fmtAvg(c.summary.vibeAvg)}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">Queue</th>
                    {compareCompanies.map((c) => (
                      <td key={c.companyId}>{fmtAvg(c.summary.queueAvg)}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">Goodie</th>
                    {compareCompanies.map((c) => (
                      <td key={c.companyId}>{fmtAvg(c.summary.goodieAvg)}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">Perception</th>
                    {compareCompanies.map((c) => (
                      <td key={c.companyId}>{fmtAvg(c.summary.perceptionAvg)}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">Purchase rate</th>
                    {compareCompanies.map((c) => (
                      <td key={c.companyId}>{fmtPct(c.summary.purchaseRate)}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">Heard-before rate</th>
                    {compareCompanies.map((c) => (
                      <td key={c.companyId}>{fmtPct(c.summary.heardBeforeRate)}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {error ? (
          <p className="admin-page__error" role="alert">
            {error}
          </p>
        ) : null}

        {!loading && !error && report.companies.length === 0 ? (
          <p className="admin-page__empty">No companies or reviews found.</p>
        ) : null}

        {!error && isFocused
          ? displayCompanies.map((company) => {
            const isCompared = compareIds.includes(company.companyId)
            const compareDisabled = !isCompared && compareIds.length >= ADMIN_COMPARE_MAX
            return (
              <section
                key={company.companyId}
                className={`admin-company${isFocused ? ' admin-company--focused' : ''}`}
                aria-label={company.companyName}
              >
                <header className="admin-company__header">
                  <div className="admin-company__header-main">
                    {isFocused ? (
                      <h2 className="admin-company__title">{company.companyName}</h2>
                    ) : (
                      <h2 className="admin-company__title">
                        <button
                          type="button"
                          className="admin-company__title-btn no-print"
                          onClick={() => focusCompany(company.companyId)}
                        >
                          {company.companyName}
                        </button>
                        <span className="admin-company__title-print">{company.companyName}</span>
                      </h2>
                    )}
                    {!isFocused ? (
                      <label className="admin-company__compare no-print">
                        <input
                          type="checkbox"
                          checked={isCompared}
                          disabled={compareDisabled}
                          onChange={() => toggleCompare(company.companyId)}
                          aria-label={`Include ${company.companyName} in compare (max ${ADMIN_COMPARE_MAX})`}
                        />
                        <span>Compare</span>
                      </label>
                    ) : null}
                  </div>
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
                    <strong>Staff Helpfulness:</strong> {fmtAvg(company.summary.staffAvg)}
                  </p>
                  <p>
                    <strong>Perception Lift:</strong> {fmtAvg(company.summary.perceptionAvg)}
                  </p>
                  <p>
                    <strong>Online Purchase Intent:</strong>{' '}
                    {fmtAvg(company.summary.onlinePurchaseAvg)}
                  </p>
                  <p>
                    <strong>Purchase rate:</strong> {fmtPct(company.summary.purchaseRate)}
                  </p>
                  <p>
                    <strong>Heard-before rate:</strong> {fmtPct(company.summary.heardBeforeRate)}
                  </p>
                </div>

                {company.reviews.length === 0 ? (
                  <p className="admin-company__empty">No reviews in the current filter.</p>
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
                          <th>Staff</th>
                          <th>Perception</th>
                          <th>Buy Online</th>
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
                            <td>{review.staffHelpfulness || '—'}</td>
                            <td>{review.brandPerceptionLikert || '—'}</td>
                            <td>{review.onlinePurchaseLikert || '—'}</td>
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
            )
          })
          : null}
      </div>
    </div>
  )
}
