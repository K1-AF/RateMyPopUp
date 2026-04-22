import { useEffect, useMemo, useRef, useState } from 'react'
import { fetchRecentReviews, parseMultiField } from '../utils/reviews.js'
import './RecentReviewsCarousel.css'

/**
 * RecentReviewsCarousel
 *
 * Renders a carousel of community reviews. Right now the data is hardcoded
 * (see REVIEWS_SEED) so the page has something to show before the Supabase
 * backend is wired in. The shape mirrors the ReviewPage form fields:
 *   - company        (string)   event / pop-up name
 *   - createdAt      (ISO date) used to sort "most recent first"
 *   - reviewer       (string)   display name (first name + last initial)
 *   - ratings        (1-5 each) vibe, queue, goodieQuality
 *   - secured        (string[]) chips picked in the form
 *   - visitMain      (string[]) why they went
 *   - hearAbout      (string)   discovery channel
 *   - comments       (string)   free text
 *
 * Security notes:
 * - All strings are rendered as text (React escapes by default) — no HTML
 *   is injected from review content.
 * - Auto-rotation pauses on hover / keyboard focus so screen-reader users
 *   aren't fighting the timer.
 */

const SLIDE_MS = 6500

const REVIEWS_SEED = [
  {
    id: 'r-ordinary',
    company: 'The Ordinary Immersive Experience',
    createdAt: '2026-04-18T10:15:00Z',
    reviewer: 'Maya R.',
    ratings: { vibe: 5, queue: 4, goodie: 5 },
    secured: ['Full product', 'Sample', 'Sticker'],
    visitMain: ['Freebies', 'Photos'],
    hearAbout: 'Instagram',
    comments:
      'Stunning build-out and the coffee cups were such a clever touch. Staff were lovely and I walked away with a full-size serum — 10/10.',
  },
  {
    id: 'r-laneige',
    company: 'Laneige x Boots | The Juice Pop Party',
    createdAt: '2026-04-16T17:40:00Z',
    reviewer: 'Priya S.',
    ratings: { vibe: 5, queue: 3, goodie: 4 },
    secured: ['Goodie bag', 'Drink/Food', 'Photo opportunity'],
    visitMain: ['Freebies', 'In the area'],
    hearAbout: 'TikTok',
    comments:
      'Queue moved faster than expected and the juice bar photo wall was a vibe. Goodie bag had a full lip sleeping mask!',
  },
  {
    id: 'r-kayali',
    company: 'KAYALI The Experience',
    createdAt: '2026-04-14T12:05:00Z',
    reviewer: 'Jess T.',
    ratings: { vibe: 5, queue: 4, goodie: 4 },
    secured: ['Sample', 'Tote bag', 'Photo opportunity'],
    visitMain: ['Photos', 'Shopping'],
    hearAbout: 'Friend',
    comments:
      'The neon set piece is iconic. Got three perfume samples and a tote. Would’ve loved a full bottle draw but otherwise flawless.',
  },
  {
    id: 'r-prada',
    company: 'The Prada Picnic',
    createdAt: '2026-04-11T09:30:00Z',
    reviewer: 'Ava L.',
    ratings: { vibe: 5, queue: 2, goodie: 3 },
    secured: ['Photo opportunity', 'Drink/Food'],
    visitMain: ['Photos', 'In the area'],
    hearAbout: 'Walk-by',
    comments:
      'Aesthetic dream but the line was no joke — got in after ~40 minutes. The macarons and set design made it worth it.',
  },
  {
    id: 'r-lush',
    company: 'Lush Wellness Lounge',
    createdAt: '2026-04-08T15:50:00Z',
    reviewer: 'Noor K.',
    ratings: { vibe: 4, queue: 5, goodie: 4 },
    secured: ['Sample', 'Full product'],
    visitMain: ['Shopping', 'In the area'],
    hearAbout: 'Newsletter',
    comments:
      'Calm, spa-like corner of the shop. Walked in, got a hand massage, left with a bath bomb. Very low-queue, very high-vibe.',
  },
]

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

/**
 * Maps a Supabase review row into the shape the card expects.
 * Keeps the rest of the component agnostic to the on-disk schema.
 */
function adaptRow(row) {
  return {
    id: row.review_id,
    company: row.company?.company_name || 'Unknown pop-up',
    createdAt: row.date,
    reviewer: row.account?.display_name || 'Anonymous',
    ratings: {
      vibe: row.vibe ?? 0,
      queue: row.queue_speed ?? 0,
      goodie: row.goodie_bag_quality ?? 0,
    },
    secured: parseMultiField(row.items_secured),
    visitMain: parseMultiField(row.reason_visit),
    hearAbout: row.hear_about || '',
    comments: row.comments || '',
  }
}

/**
 * Collab submissions are stored as one review per company_id (same payload).
 * For home feed UX we collapse those sibling rows into one card and combine
 * names like "Nars x Refy" while preserving the newest-first ordering.
 */
function collapseCollaborativeRows(rows) {
  const grouped = new Map()
  const order = []

  for (const row of rows ?? []) {
    const key = [
      row.account_id ?? '',
      row.date ?? '',
      row.vibe ?? '',
      row.queue_speed ?? '',
      row.goodie_bag_quality ?? '',
      row.items_secured ?? '',
      row.reason_visit ?? '',
      row.hear_about ?? '',
      row.comments ?? '',
    ].join('|')

    const companyName = row.company?.company_name
      ? String(row.company.company_name).trim()
      : ''

    if (!grouped.has(key)) {
      grouped.set(key, {
        ...row,
        _companies: companyName ? [companyName] : [],
      })
      order.push(key)
      continue
    }

    const bucket = grouped.get(key)
    if (companyName && !bucket._companies.includes(companyName)) {
      bucket._companies.push(companyName)
    }
  }

  return order.map((key) => {
    const row = grouped.get(key)
    const names = [...(row._companies ?? [])].sort((a, b) =>
      a.localeCompare(b)
    )
    const combinedName = names.length > 0 ? names.join(' x ') : row.company?.company_name
    return {
      ...row,
      company: { ...(row.company ?? {}), company_name: combinedName || 'Unknown pop-up' },
    }
  })
}

export function RecentReviewsCarousel() {
  const seed = useMemo(
    () =>
      [...REVIEWS_SEED].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    []
  )

  const [reviews, setReviews] = useState(seed)
  const [active, setActive] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    fetchRecentReviews(30)
      .then((rows) => {
        if (cancelled) return
        if (!rows || rows.length === 0) return // keep seed fallback
        const collapsed = collapseCollaborativeRows(rows).slice(0, 10)
        const mapped = collapsed.map(adaptRow)
        setReviews(mapped)
        setActive(0)
      })
      .catch((err) => {
        console.warn('[home] failed to load reviews:', err?.message)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (reviews.length < 2 || isPaused) return undefined
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % reviews.length)
    }, SLIDE_MS)
    return () => window.clearInterval(id)
  }, [reviews.length, isPaused])

  const goTo = (index) => {
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
              <span className="recent-review__chip recent-review__chip--source">
                via {activeReview.hearAbout}
              </span>
            </header>

            <div className="recent-review__ratings">
              <StarRow label="Vibe" value={activeReview.ratings.vibe} />
              <StarRow label="Queue" value={activeReview.ratings.queue} />
              <StarRow label="Goodie bag" value={activeReview.ratings.goodie} />
            </div>

            {activeReview.comments && (
              <p className="recent-review__comments">
                “{activeReview.comments}”
              </p>
            )}

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
