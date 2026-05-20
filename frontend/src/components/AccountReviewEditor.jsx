import { useCallback, useState } from 'react'
import { StarRating } from './StarRating.jsx'
import { getOrCreateCompanyId } from '../utils/reviews.js'
import { updateReview } from '../utils/myReviews.js'
import '../pages/ReviewPage.css'

const MAX_COMMENTS = 1000

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

/**
 * Inline editor for a single review on the account page.
 */
export function AccountReviewEditor({ review, onSaved, onCancel }) {
  const [companyName, setCompanyName] = useState(review.company?.company_name || '')
  const [vibe, setVibe] = useState(Number(review.vibe) || 0)
  const [queue, setQueue] = useState(Number(review.queue_speed) || 0)
  const [goodie, setGoodie] = useState(Number(review.goodie_bag_quality) || 0)
  const [staff, setStaff] = useState(
    Number(review.staff_helpfulness) || Number(review.vibe) || 3
  )
  const [comments, setComments] = useState(review.comments || '')
  const [hearAbout, setHearAbout] = useState(review.hear_about || '')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const validate = useCallback(() => {
    const next = {}
    if (!companyName.trim()) next.company = 'Company name is required.'
    if (vibe < 1) next.vibe = 'Rate the vibe.'
    if (queue < 1) next.queue = 'Rate the queue speed.'
    if (goodie < 1) next.goodie = 'Rate item quality.'
    if (staff < 1) next.staff = 'Rate staff helpfulness.'
    return next
  }, [companyName, vibe, queue, goodie, staff])

  const handleSave = async (event) => {
    event.preventDefault()
    setSaveError('')
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      const companyId = await getOrCreateCompanyId(companyName.trim())
      const updated = await updateReview(review.review_id, {
        company_id: companyId,
        vibe,
        queue_speed: queue,
        goodie_bag_quality: goodie,
        staff_helpfulness: staff,
        comments: comments.trim() || null,
        hear_about: hearAbout.trim() || null,
      })
      onSaved(updated)
    } catch (err) {
      setSaveError(err?.message || 'Could not save changes.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="account-review-editor" onSubmit={handleSave} noValidate>
      <p className="account-review-editor__meta">
        Submitted <time dateTime={review.date}>{formatDate(review.date)}</time>
      </p>

      <div className="account-review-editor__field">
        <label className="account-review-editor__label" htmlFor={`company-${review.review_id}`}>
          Company / pop-up
        </label>
        <input
          id={`company-${review.review_id}`}
          type="text"
          className={`account-review-editor__input ${errors.company ? 'account-review-editor__input--error' : ''}`}
          value={companyName}
          maxLength={120}
          onChange={(e) => {
            setCompanyName(e.target.value.slice(0, 120))
            if (errors.company) setErrors((prev) => ({ ...prev, company: undefined }))
          }}
        />
        {errors.company ? (
          <p className="account-review-editor__error" role="alert">
            {errors.company}
          </p>
        ) : null}
      </div>

      <div className="account-review-editor__stars">
        <StarRating
          id={`edit-vibe-${review.review_id}`}
          label="Vibe"
          value={vibe}
          onChange={setVibe}
          required
          error={errors.vibe}
        />
        <StarRating
          id={`edit-queue-${review.review_id}`}
          label="Queue speed"
          value={queue}
          onChange={setQueue}
          required
          error={errors.queue}
        />
        <StarRating
          id={`edit-goodie-${review.review_id}`}
          label="Item quality"
          value={goodie}
          onChange={setGoodie}
          required
          error={errors.goodie}
        />
        <StarRating
          id={`edit-staff-${review.review_id}`}
          label="Staff helpfulness"
          value={staff}
          onChange={setStaff}
          required
          error={errors.staff}
        />
      </div>

      <div className="account-review-editor__field">
        <label className="account-review-editor__label" htmlFor={`hear-${review.review_id}`}>
          How you heard about it
        </label>
        <input
          id={`hear-${review.review_id}`}
          type="text"
          className="account-review-editor__input"
          value={hearAbout}
          maxLength={120}
          onChange={(e) => setHearAbout(e.target.value.slice(0, 120))}
        />
      </div>

      <div className="account-review-editor__field">
        <label className="account-review-editor__label" htmlFor={`comments-${review.review_id}`}>
          Comments
        </label>
        <textarea
          id={`comments-${review.review_id}`}
          className="account-review-editor__textarea"
          rows={4}
          value={comments}
          maxLength={MAX_COMMENTS}
          onChange={(e) => setComments(e.target.value.slice(0, MAX_COMMENTS))}
        />
      </div>

      {saveError ? (
        <p className="account-review-editor__error" role="alert">
          {saveError}
        </p>
      ) : null}

      <div className="account-review-editor__actions">
        <button type="submit" className="account-review-editor__btn account-review-editor__btn--primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        <button
          type="button"
          className="account-review-editor__btn account-review-editor__btn--ghost"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export function AccountReviewSummary({ review }) {
  const company = review.company?.company_name || 'Unknown pop-up'
  const avg = (
    (Number(review.vibe || 0) +
      Number(review.queue_speed || 0) +
      Number(review.goodie_bag_quality || 0)) /
    3
  ).toFixed(1)

  return (
    <>
      <div className="account-review-card__head">
        <div>
          <h2 className="account-review-card__company">{company}</h2>
          <p className="account-review-card__meta">
            <time dateTime={review.date}>{formatDate(review.date)}</time>
            <span aria-hidden> · </span>
            <span>{avg}/5 avg</span>
          </p>
        </div>
      </div>
      {review.comments ? (
        <p className="account-review-card__comments">&ldquo;{review.comments}&rdquo;</p>
      ) : (
        <p className="account-review-card__comments account-review-card__comments--muted">No comment</p>
      )}
      <dl className="account-review-card__ratings">
        <div>
          <dt>Vibe</dt>
          <dd>{review.vibe ?? '—'}/5</dd>
        </div>
        <div>
          <dt>Queue</dt>
          <dd>{review.queue_speed ?? '—'}/5</dd>
        </div>
        <div>
          <dt>Goodie</dt>
          <dd>{review.goodie_bag_quality ?? '—'}/5</dd>
        </div>
        <div>
          <dt>Staff</dt>
          <dd>{review.staff_helpfulness ?? '—'}/5</dd>
        </div>
      </dl>
    </>
  )
}
