import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { IconStarFilled } from '../components/Icons.jsx'
import {
  fetchCompanyById,
  fetchReviewsForCompany,
  parseMultiField,
} from '../utils/reviews.js'
import '../components/RecentReviewsCarousel.css'
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
  const avgOverall = useMemo(() => {
    if (!stats.count) return 0
    return (stats.avgVibe + stats.avgQueue + stats.avgGoodie) / 3
  }, [stats])

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
              <div className="company-page__title-row">
                <h1 id="company-title" className="company-page__title">
                  {company?.company_name}
                </h1>
                <p className="company-page__avg" title="Average overall rating">
                  <IconStarFilled className="company-page__avg-star" ariaHidden />
                  <span>{avgOverall.toFixed(1)}</span>
                </p>
              </div>
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
                    <li key={row.review_id} className="recent-review company-review">
                      <header className="recent-review__head">
                        <div>
                          <p className="recent-review__company">
                            {company?.company_name || 'Unknown pop-up'}
                          </p>
                          <p className="recent-review__meta">
                            <span>{row.account?.display_name || 'Anonymous'}</span>
                            <span className="recent-review__dot" aria-hidden>
                              •
                            </span>
                            <time dateTime={row.date}>{formatDate(row.date)}</time>
                          </p>
                        </div>
                        {row.hear_about ? (
                          <span className="recent-review__chip recent-review__chip--source">
                            via {row.hear_about}
                          </span>
                        ) : null}
                      </header>

                      <div className="recent-review__ratings">
                        <div
                          className="recent-review__stars"
                          aria-label={`Vibe: ${row.vibe} out of 5`}
                        >
                          <span className="recent-review__stars-label">Vibe</span>
                          <span className="recent-review__stars-row" aria-hidden>
                            {[1, 2, 3, 4, 5].map((n) => (
                              <svg
                                key={`vibe-${row.review_id}-${n}`}
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                className={`recent-review__star ${n <= Number(row.vibe || 0) ? 'is-filled' : ''}`}
                              >
                                <path
                                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                  fill={n <= Number(row.vibe || 0) ? '#fbbf24' : 'none'}
                                  stroke="#eab308"
                                  strokeWidth="1.4"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            ))}
                          </span>
                          <span className="recent-review__stars-value">
                            {Number(row.vibe || 0)}/5
                          </span>
                        </div>
                        <div
                          className="recent-review__stars"
                          aria-label={`Queue: ${row.queue_speed} out of 5`}
                        >
                          <span className="recent-review__stars-label">Queue</span>
                          <span className="recent-review__stars-row" aria-hidden>
                            {[1, 2, 3, 4, 5].map((n) => (
                              <svg
                                key={`queue-${row.review_id}-${n}`}
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                className={`recent-review__star ${n <= Number(row.queue_speed || 0) ? 'is-filled' : ''}`}
                              >
                                <path
                                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                  fill={n <= Number(row.queue_speed || 0) ? '#fbbf24' : 'none'}
                                  stroke="#eab308"
                                  strokeWidth="1.4"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            ))}
                          </span>
                          <span className="recent-review__stars-value">
                            {Number(row.queue_speed || 0)}/5
                          </span>
                        </div>
                        <div
                          className="recent-review__stars"
                          aria-label={`Goodie bag: ${row.goodie_bag_quality} out of 5`}
                        >
                          <span className="recent-review__stars-label">Goodie bag</span>
                          <span className="recent-review__stars-row" aria-hidden>
                            {[1, 2, 3, 4, 5].map((n) => (
                              <svg
                                key={`goodie-${row.review_id}-${n}`}
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                className={`recent-review__star ${n <= Number(row.goodie_bag_quality || 0) ? 'is-filled' : ''}`}
                              >
                                <path
                                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                  fill={n <= Number(row.goodie_bag_quality || 0) ? '#fbbf24' : 'none'}
                                  stroke="#eab308"
                                  strokeWidth="1.4"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            ))}
                          </span>
                          <span className="recent-review__stars-value">
                            {Number(row.goodie_bag_quality || 0)}/5
                          </span>
                        </div>
                      </div>

                      {row.comments ? <p className="recent-review__comments">“{row.comments}”</p> : null}

                      {secured.length > 0 ? (
                        <div className="recent-review__chips-group">
                          <p className="recent-review__chips-label">Secured:</p>
                          <ul className="recent-review__chips">
                            {secured.map((item) => (
                              <li key={`${row.review_id}-secured-${item}`} className="recent-review__chip">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {reasons.length > 0 ? (
                        <div className="recent-review__chips-group">
                          <p className="recent-review__chips-label">Main reason:</p>
                          <ul className="recent-review__chips">
                            {reasons.map((item) => (
                              <li
                                key={`${row.review_id}-reason-${item}`}
                                className="recent-review__chip recent-review__chip--soft"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
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
