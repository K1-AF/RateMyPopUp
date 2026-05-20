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
  const [pendingDeleteId, setPendingDeleteId] = useState(null)
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

  useEffect(() => {
    if (!pendingDeleteId) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !deletingId) setPendingDeleteId(null)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [pendingDeleteId, deletingId])

  const pendingDeleteReview = useMemo(
    () => reviews.find((r) => r.review_id === pendingDeleteId) ?? null,
    [reviews, pendingDeleteId]
  )

  const confirmDelete = async () => {
    if (!pendingDeleteId) return

    setDeletingId(pendingDeleteId)
    setActionError('')
    try {
      await deleteReview(pendingDeleteId)
      setReviews((prev) => prev.filter((r) => r.review_id !== pendingDeleteId))
      if (editingId === pendingDeleteId) setEditingId(null)
      setPendingDeleteId(null)
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
                            onClick={() => {
                              setPendingDeleteId(review.review_id)
                              setActionError('')
                            }}
                            disabled={Boolean(deletingId)}
                          >
                            Delete
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

      {pendingDeleteId ? (
        <div
          className="account-delete-modal"
          role="presentation"
          onClick={() => {
            if (!deletingId) setPendingDeleteId(null)
          }}
        >
          <div
            className="account-delete-modal__dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="account-delete-title"
            aria-describedby="account-delete-desc"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="account-delete-title" className="account-delete-modal__title">
              Are you sure you want to delete this review?
            </h2>
            <p id="account-delete-desc" className="account-delete-modal__text">
              {pendingDeleteReview?.company?.company_name ? (
                <>
                  This will permanently remove your review for{' '}
                  <strong>{pendingDeleteReview.company.company_name}</strong>.
                </>
              ) : (
                'This action cannot be undone.'
              )}
            </p>
            <div className="account-delete-modal__actions">
              <button
                type="button"
                className="account-delete-modal__btn account-delete-modal__btn--yes"
                onClick={confirmDelete}
                disabled={Boolean(deletingId)}
              >
                {deletingId ? 'Deleting…' : 'Yes'}
              </button>
              <button
                type="button"
                className="account-delete-modal__btn account-delete-modal__btn--no"
                onClick={() => setPendingDeleteId(null)}
                disabled={Boolean(deletingId)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
