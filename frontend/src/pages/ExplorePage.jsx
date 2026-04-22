import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { IconSearch, IconStarOutline } from '../components/Icons.jsx'
import { fetchCompanies } from '../utils/reviews.js'
import './ExplorePage.css'

const SEARCH_DEBOUNCE_MS = 220
const MAX_QUERY_LENGTH = 80

export default function ExplorePage() {
  const [query, setQuery] = useState('')
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const normalizedQuery = useMemo(
    () => query.trim().slice(0, MAX_QUERY_LENGTH),
    [query]
  )

  useEffect(() => {
    document.title = 'Explore Pop-Ups — RateMyPopUp'
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    const timer = window.setTimeout(() => {
      fetchCompanies({ query: normalizedQuery, limit: 150 })
        .then((rows) => {
          if (cancelled) return
          setCompanies(rows)
        })
        .catch((err) => {
          if (cancelled) return
          setError(err?.message || 'Could not load companies right now.')
          setCompanies([])
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [normalizedQuery])

  return (
    <section className="explore-page" aria-labelledby="explore-title">
      <div className="explore-page__inner">
        <header className="explore-page__header">
          <h1 id="explore-title" className="explore-page__title">
            Explore companies
          </h1>
        </header>

        <div className="explore-search">
          <label htmlFor="explore-search" className="explore-search__label">
            Search by company name
          </label>
          <div className="explore-search__control">
            <IconSearch className="explore-search__icon" ariaHidden />
            <input
              id="explore-search"
              type="search"
              className="explore-search__input"
              placeholder="e.g. Glossier, Prada, Nike..."
              value={query}
              maxLength={MAX_QUERY_LENGTH}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
            />
          </div>
          <p className="explore-search__meta" role="status" aria-live="polite">
            {loading
              ? 'Loading companies...'
              : `${companies.length} compan${companies.length === 1 ? 'y' : 'ies'} found`}
          </p>
        </div>

        {error ? (
          <p className="explore-page__error" role="alert">
            {error}
          </p>
        ) : null}

        {!loading && !error && companies.length === 0 ? (
          <div className="explore-empty" role="status">
            <p>No companies match that search yet.</p>
            <Link to="/review" className="btn btn-secondary">
              <IconStarOutline className="btn-icon" ariaHidden />
              Add one via a new review
            </Link>
          </div>
        ) : null}

        {companies.length > 0 ? (
          <ul className="explore-list" aria-label="Company results">
            {companies.map((company) => (
              <li key={company.company_id}>
                <Link
                  to={`/review?company=${encodeURIComponent(company.company_name)}&companyId=${encodeURIComponent(company.company_id)}`}
                  className="explore-card"
                >
                  <p className="explore-card__name">{company.company_name}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
