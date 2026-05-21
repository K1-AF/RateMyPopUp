import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  CAROUSEL_REVIEW_LIMIT,
  getHardcodedReviews,
  mergeCarouselReviews,
  HARDCODED_REVIEWS,
} from '../data/hardcodedReviews.js'
import {
  fetchRecentReviews,
  mapReviewForCarousel,
} from '../utils/reviews.js'
import './RecentReviewsCarousel.css'

const SLIDE_MS = 6500
const LIVE_REVIEW_FETCH_LIMIT = CAROUSEL_REVIEW_LIMIT

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

function StarRow({ label, value }) {
  return (
    <div className="recent-review__stars" aria-label={`${label}: ${value} out of 5`}>
      <span className="recent-review__stars-label">{label}</span>
      <span className="recent-review__stars-row" aria-hidden>
        {[1, 2, 3, 4, 5].map((n) => (
          <svg
            key={n}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            className={`recent-review__star ${n <= value ? 'is-filled' : ''}`}
          >
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={n <= value ? '#fbbf24' : 'none'}
              stroke="#eab308"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        ))}
      </span>
      <span className="recent-review__stars-value">{value}/5</span>
    </div>
  )
}

export function RecentReviewsCarousel() {
  const hardcodedReviews = useMemo(
    () =>
      [...HARDCODED_REVIEWS].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    []
  )
  const [reviews, setReviews] = useState(() => getHardcodedReviews())
  const [active, setActive] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const wrapperRef = useRef(null)

  const loadReviews = useCallback(async () => {
    try {
      const rows = await fetchRecentReviews(LIVE_REVIEW_FETCH_LIMIT)
      const liveReviews = rows.map(mapReviewForCarousel)
      setReviews(mergeCarouselReviews(hardcodedReviews, liveReviews))
    } catch (err) {
      console.warn('[carousel] failed to load live reviews:', err?.message)
      setReviews(getHardcodedReviews())
    }
  }, [hardcodedReviews])

  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  useEffect(() => {
    if (reviews.length < 2 || isPaused) return undefined
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % reviews.length)
    }, SLIDE_MS)
    return () => window.clearInterval(id)
  }, [reviews.length, isPaused])

  const goTo = (index) => {
    if (!reviews.length) return
    setActive(((index % reviews.length) + reviews.length) % reviews.length)
  }

  const activeReview = reviews[active]

  return (
    <section
      className="recent-reviews"
      aria-labelledby="recent-reviews-heading"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(e) => {
        if (!wrapperRef.current?.contains(e.relatedTarget)) {
          setIsPaused(false)
        }
      }}
      ref={wrapperRef}
    >
      <div className="recent-reviews__container">
        <div className="recent-reviews__header">
          <h2 id="recent-reviews-heading" className="section-heading">
            Most Recent Reviews
          </h2>
          <p className="recent-reviews__sub">
            Fresh takes from the community · sorted by newest
          </p>
        </div>

        <div
          className="recent-reviews__viewport"
          role="region"
          aria-roledescription="carousel"
          aria-live="polite"
          aria-atomic="true"
        >
          <article className="recent-review" key={activeReview.id}>
            <header className="recent-review__head">
              <div>
                <p className="recent-review__company">{activeReview.company}</p>
                <p className="recent-review__meta">
                  <span>{activeReview.reviewer}</span>
                  <span className="recent-review__dot" aria-hidden>
                    •
                  </span>
                  <time dateTime={activeReview.createdAt}>
                    {formatDate(activeReview.createdAt)}
                  </time>
                </p>
              </div>
              {activeReview.hearAbout ? (
                <span className="recent-review__chip recent-review__chip--source">
                  via {activeReview.hearAbout}
                </span>
              ) : null}
            </header>

            <div className="recent-review__ratings">
              <StarRow label="Vibe" value={activeReview.ratings.vibe} />
              <StarRow label="Queue" value={activeReview.ratings.queue} />
              <StarRow label="Goodie bag" value={activeReview.ratings.goodie} />
            </div>

            {activeReview.comments ? (
              <p className="recent-review__comments">
                “{activeReview.comments}”
              </p>
            ) : null}

            {activeReview.secured.length > 0 ? (
              <div className="recent-review__chips-group">
                <p className="recent-review__chips-label">Secured:</p>
                <ul className="recent-review__chips">
                  {activeReview.secured.map((item) => (
                    <li key={item} className="recent-review__chip">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {activeReview.visitMain.length > 0 ? (
              <div className="recent-review__chips-group">
                <p className="recent-review__chips-label">Main reason:</p>
                <ul className="recent-review__chips">
                  {activeReview.visitMain.map((item) => (
                    <li key={item} className="recent-review__chip recent-review__chip--soft">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </article>
        </div>

        <div className="recent-reviews__controls">
          <button
            type="button"
            className="recent-reviews__nav"
            onClick={() => goTo(active - 1)}
            aria-label="Previous review"
          >
            ‹
          </button>
          <div className="recent-reviews__dots" role="tablist">
            {reviews.map((r, index) => (
              <button
                key={`${r.id}-dot`}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={`Show review ${index + 1} of ${reviews.length}`}
                className={`recent-reviews__dot ${index === active ? 'is-active' : ''}`}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
          <button
            type="button"
            className="recent-reviews__nav"
            onClick={() => goTo(active + 1)}
            aria-label="Next review"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  )
}
