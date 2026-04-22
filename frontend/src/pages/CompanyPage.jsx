import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  fetchCompanyById,
  fetchReviewsForCompany,
  parseMultiField,
} from '../utils/reviews.js'
import './CompanyPage.css'

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

export default function CompanyPage() {
  const { companyId = '' } = useParams()
  const [company, setCompany] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    Promise.all([fetchCompanyById(companyId), fetchReviewsForCompany(companyId, 60)])
      .then(([companyRow, reviewRows]) => {
        if (cancelled) return
        setCompany(companyRow)
        setReviews(reviewRows)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err?.message || 'Could not load this company right now.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [companyId])

  useEffect(() => {
    document.title = company?.company_name
      ? `${company.company_name} — RateMyPopUp`
      : 'Company — RateMyPopUp'
  }, [company?.company_name])

  const stats = useMemo(() => {
    if (!reviews.length) {
      return { count: 0, avgVibe: 0, avgQueue: 0, avgGoodie: 0 }
    }
    let vibeSum = 0
    let queueSum = 0
    let goodieSum = 0
    for (const row of reviews) {
      vibeSum += Number(row.vibe || 0)
      queueSum += Number(row.queue_speed || 0)
      goodieSum += Number(row.goodie_bag_quality || 0)
    }
    return {
      count: reviews.length,
      avgVibe: vibeSum / reviews.length,
      avgQueue: queueSum / reviews.length,
      avgGoodie: goodieSum / reviews.length,
    }
  }, [reviews])

  return (
    <section className="company-page" aria-labelledby="company-title">
      <div className="company-page__inner">
        <Link to="/explore" className="company-page__back">
          ← Back to explore
        </Link>

        {loading ? (
          <p className="company-page__state" role="status" aria-live="polite">
            Loading company...
          </p>
        ) : error ? (
          <p className="company-page__state company-page__state--error" role="alert">
            {error}
          </p>
        ) : (
          <>
            <header className="company-page__header">
              <h1 id="company-title" className="company-page__title">
                {company?.company_name}
              </h1>
              <div className="company-page__stats" aria-label="Company review summary">
                <span className="company-page__stat">
                  {stats.count} {stats.count === 1 ? 'review' : 'reviews'}
                </span>
                <span className="company-page__stat">Vibe {stats.avgVibe.toFixed(1)}/5</span>
                <span className="company-page__stat">Queue {stats.avgQueue.toFixed(1)}/5</span>
                <span className="company-page__stat">Goodie {stats.avgGoodie.toFixed(1)}/5</span>
              </div>
              <Link
                to={`/review?company=${encodeURIComponent(company?.company_name || '')}&companyId=${encodeURIComponent(company?.company_id || '')}`}
                className="btn btn-primary"
              >
                Review this pop-up
              </Link>
            </header>

            {reviews.length === 0 ? (
              <p className="company-page__state">
                No reviews yet. Be the first person to rate this pop-up.
              </p>
            ) : (
              <ul className="company-reviews" aria-label="Company reviews">
                {reviews.map((row) => {
                  const secured = parseMultiField(row.items_secured)
                  const reasons = parseMultiField(row.reason_visit)
                  return (
                    <li key={row.review_id} className="company-review">
                      <header className="company-review__head">
                        <p className="company-review__meta">
                          <span>{row.account?.display_name || 'Anonymous'}</span>
                          <span aria-hidden>•</span>
                          <time dateTime={row.date}>{formatDate(row.date)}</time>
                        </p>
                        <p className="company-review__scores">
                          Vibe {row.vibe}/5 · Queue {row.queue_speed}/5 · Goodie{' '}
                          {row.goodie_bag_quality}/5
                        </p>
                      </header>

                      {row.comments ? (
                        <p className="company-review__comment">{row.comments}</p>
                      ) : null}

                      {secured.length > 0 ? (
                        <p className="company-review__line">
                          <strong>Secured:</strong> {secured.join(', ')}
                        </p>
                      ) : null}
                      {reasons.length > 0 ? (
                        <p className="company-review__line">
                          <strong>Main reason:</strong> {reasons.join(', ')}
                        </p>
                      ) : null}
                      {row.hear_about ? (
                        <p className="company-review__line">
                          <strong>Heard via:</strong> {row.hear_about}
                        </p>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  )
}
