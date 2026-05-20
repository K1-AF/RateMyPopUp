import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import {
  AccountReviewEditor,
  AccountReviewSummary,
} from '../components/AccountReviewEditor.jsx'
import { deleteReview, fetchMyReviews } from '../utils/myReviews.js'
import './AccountPage.css'

function avgRating(values) {
  const nums = values.filter((n) => Number.isFinite(n) && n > 0)
  if (!nums.length) return null
  return nums.reduce((sum, n) => sum + n, 0) / nums.length
}

function formatAvg(value) {
  return value == null ? '—' : `${value.toFixed(1)}/5`
}

export default function AccountPage() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [actionError, setActionError] = useState('')

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    'Your account'

  const stats = useMemo(() => {
    const popUpsVisited = new Set(
      reviews.map((r) => r.company_id).filter(Boolean)
    ).size

    return {
      popUpsVisited,
      avgVibe: avgRating(reviews.map((r) => Number(r.vibe))),
      avgGoodie: avgRating(reviews.map((r) => Number(r.goodie_bag_quality))),
      avgQueue: avgRating(reviews.map((r) => Number(r.queue_speed))),
    }
  }, [reviews])

  const loadReviews = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    setError('')
    try {
      const rows = await fetchMyReviews(user.id)
      setReviews(rows)
    } catch (err) {
      setError(err?.message || 'Could not load your reviews.')
      setReviews([])
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    document.title = 'My Account — RateMyPopUp'
    loadReviews()
  }, [loadReviews])

  const handleDelete = async (reviewId) => {
    const companyName =
      reviews.find((r) => r.review_id === reviewId)?.company?.company_name || 'this review'
    const ok = window.confirm(
      `Delete your review for ${companyName}? This cannot be undone.`
    )
    if (!ok) return

    setDeletingId(reviewId)
    setActionError('')
    try {
      await deleteReview(reviewId)
      setReviews((prev) => prev.filter((r) => r.review_id !== reviewId))
      if (editingId === reviewId) setEditingId(null)
    } catch (err) {
      setActionError(err?.message || 'Could not delete review.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleSaved = (updated) => {
    setReviews((prev) =>
      prev.map((r) => (r.review_id === updated.review_id ? updated : r))
    )
    setEditingId(null)
    setActionError('')
  }

  return (
    <section className="account-page" aria-labelledby="account-title">
      <div className="account-page__inner">
        <header className="account-page__header">
          <div>
            <h1 id="account-title" className="account-page__title">
              My reviews
            </h1>
            <p className="account-page__subtitle">{displayName}</p>
          </div>
          <Link to="/review" className="account-page__cta">
            Write a review
          </Link>
        </header>

        {!error ? (
          <div className="account-kpis" aria-label="Your review stats">
            <div className="account-kpi">
              <p className="account-kpi__value">
                {loading ? '…' : stats.popUpsVisited}
              </p>
              <p className="account-kpi__label">Pop-ups visited</p>
            </div>
            <div className="account-kpi">
              <p className="account-kpi__value">
                {loading ? '…' : formatAvg(stats.avgVibe)}
              </p>
              <p className="account-kpi__label">Avg vibe rating</p>
            </div>
            <div className="account-kpi">
              <p className="account-kpi__value">
                {loading ? '…' : formatAvg(stats.avgGoodie)}
              </p>
              <p className="account-kpi__label">Avg goodie bag</p>
            </div>
            <div className="account-kpi">
              <p className="account-kpi__value">
                {loading ? '…' : formatAvg(stats.avgQueue)}
              </p>
              <p className="account-kpi__label">Avg queue speed</p>
            </div>
          </div>
        ) : null}

        {loading ? (
          <p className="account-page__state" role="status">
            Loading your reviews…
          </p>
        ) : error ? (
          <p className="account-page__state account-page__state--error" role="alert">
            {error}
          </p>
        ) : reviews.length === 0 ? (
          <div className="account-page__empty">
            <p>You haven&apos;t posted any reviews yet.</p>
            <Link to="/review" className="account-page__cta">
              Rate your first pop-up
            </Link>
          </div>
        ) : (
          <>
            {actionError ? (
              <p className="account-page__state account-page__state--error" role="alert">
                {actionError}
              </p>
            ) : null}
            <ul className="account-review-list">
              {reviews.map((review) => {
                const isEditing = editingId === review.review_id
                const isDeleting = deletingId === review.review_id
                return (
                  <li key={review.review_id} className="account-review-card">
                    {isEditing ? (
                      <AccountReviewEditor
                        review={review}
                        onSaved={handleSaved}
                        onCancel={() => setEditingId(null)}
                      />
                    ) : (
                      <>
                        <AccountReviewSummary review={review} />
                        <div className="account-review-card__actions">
                          <button
                            type="button"
                            className="account-review-card__btn"
                            onClick={() => {
                              setEditingId(review.review_id)
                              setActionError('')
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="account-review-card__btn account-review-card__btn--danger"
                            onClick={() => handleDelete(review.review_id)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? 'Deleting…' : 'Delete'}
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </div>
    </section>
  )
}
