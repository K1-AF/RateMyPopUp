import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IconSearch } from '../components/Icons.jsx'
import { StarRating } from '../components/StarRating.jsx'
import './ReviewPage.css'

const SECURE_OPTIONS = [
  'Goodie bag',
  'Sample',
  'Full product',
  'Drink/Food',
  'Photo opportunity',
  'Other',
]

const VISIT_MAIN_OPTIONS = ['Freebies', 'Photos', 'Shopping', 'In the area', 'Other']

const HEAR_ABOUT_OPTIONS = [
  'Instagram',
  'TikTok',
  'Friend',
  'Walk-by',
  'Newsletter',
  'Other',
]

const MAX_PROOF_BYTES = 5 * 1024 * 1024
/** Max length for "Other" free-text fields (limits abuse / oversized payloads). */
const MAX_OTHER_TEXT = 200
/** Time to show success copy before redirecting home (ms). */
const SUCCESS_REDIRECT_MS = 2000

function IconCamera({ className }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h3.17L7 4h10l.83 2H21a2 2 0 012 2v11z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function IconSend({ className }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  )
}

/**
 * Review submission form — client-side validation only until API is wired.
 */
export default function ReviewPage() {
  const navigate = useNavigate()
  const [companyQuery, setCompanyQuery] = useState('')
  const [secured, setSecured] = useState(() => new Set())
  const [vibe, setVibe] = useState(0)
  const [queue, setQueue] = useState(0)
  const [goodieQuality, setGoodieQuality] = useState(0)
  const [visitMain, setVisitMain] = useState(() => new Set())
  const [hearAbout, setHearAbout] = useState('')
  const [securedOther, setSecuredOther] = useState('')
  const [visitMainOther, setVisitMainOther] = useState('')
  const [hearAboutOther, setHearAboutOther] = useState('')
  const [proofFile, setProofFile] = useState(null)
  const [proofError, setProofError] = useState('')
  const [comments, setComments] = useState('')
  const [errors, setErrors] = useState({})
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    const prev = document.title
    document.title = 'Rate a Pop-Up — RateMyPopUp'
    return () => {
      document.title = prev
    }
  }, [])

  useEffect(() => {
    if (!submitSuccess) return
    document.getElementById('review-success-msg')?.focus()
  }, [submitSuccess])

  useEffect(() => {
    if (!submitSuccess) return
    const id = window.setTimeout(() => {
      navigate('/', { replace: true })
    }, SUCCESS_REDIRECT_MS)
    return () => window.clearTimeout(id)
  }, [submitSuccess, navigate])

  const clearError = useCallback((key) => {
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const toggleChip = useCallback((label) => {
    let togglingOffOther = false
    setSecured((prev) => {
      const next = new Set(prev)
      if (next.has(label)) {
        togglingOffOther = label === 'Other'
        next.delete(label)
      } else {
        next.add(label)
      }
      return next
    })
    if (togglingOffOther) setSecuredOther('')
    clearError('secured')
    clearError('securedOther')
  }, [clearError])

  const toggleVisitMain = useCallback((label) => {
    let togglingOffOther = false
    setVisitMain((prev) => {
      const next = new Set(prev)
      if (next.has(label)) {
        togglingOffOther = label === 'Other'
        next.delete(label)
      } else {
        next.add(label)
      }
      return next
    })
    if (togglingOffOther) setVisitMainOther('')
    clearError('visitMain')
    clearError('visitMainOther')
  }, [clearError])

  const selectHearAbout = useCallback(
    (opt) => {
      let leavingOther = false
      setHearAbout((prev) => {
        const next = prev === opt ? '' : opt
        leavingOther = prev === 'Other' && next !== 'Other'
        return next
      })
      if (leavingOther) setHearAboutOther('')
      clearError('hearAbout')
      clearError('hearAboutOther')
    },
    [clearError],
  )

  const onProofChange = useCallback((e) => {
    const file = e.target.files?.[0]
    setProofError('')
    if (!file) {
      setProofFile(null)
      return
    }
    if (!file.type.startsWith('image/')) {
      setProofError('Please upload an image file.')
      setProofFile(null)
      e.target.value = ''
      return
    }
    if (file.size > MAX_PROOF_BYTES) {
      setProofError('Image must be 5MB or smaller.')
      setProofFile(null)
      e.target.value = ''
      return
    }
    setProofFile(file)
  }, [])

  const validate = useCallback(() => {
    const e = {}
    if (!companyQuery.trim()) {
      e.company = 'Enter the company or event name.'
    }
    if (secured.size === 0) {
      e.secured = 'Select at least one option for what you secured.'
    } else if (secured.has('Other') && !securedOther.trim()) {
      e.securedOther = 'Please describe what else you secured.'
    }
    if (vibe < 1) {
      e.vibe = 'Rate the vibe.'
    }
    if (queue < 1) {
      e.queue = 'Rate the queue speed.'
    }
    if (goodieQuality < 1) {
      e.goodie = 'Rate goodie bag quality.'
    }
    if (visitMain.size === 0) {
      e.visitMain = 'Select at least one main reason for visiting.'
    } else if (visitMain.has('Other') && !visitMainOther.trim()) {
      e.visitMainOther = 'Please describe your other reason for visiting.'
    }
    if (!hearAbout) {
      e.hearAbout = 'Select how you heard about this pop-up.'
    } else if (hearAbout === 'Other' && !hearAboutOther.trim()) {
      e.hearAboutOther = 'Please specify how you heard about this pop-up.'
    }
    return e
  }, [
    companyQuery,
    secured,
    securedOther,
    vibe,
    queue,
    goodieQuality,
    visitMain,
    visitMainOther,
    hearAbout,
    hearAboutOther,
  ])

  const focusFirstInvalid = useCallback((e) => {
    if (e.company) {
      document.getElementById('company-search')?.focus()
      return
    }
    if (e.secured) {
      document.getElementById('secured-first')?.focus()
      return
    }
    if (e.securedOther) {
      document.getElementById('secured-other')?.focus()
      return
    }
    if (e.vibe) {
      document.getElementById('rating-vibe')?.querySelector('button')?.focus()
      return
    }
    if (e.queue) {
      document.getElementById('rating-queue')?.querySelector('button')?.focus()
      return
    }
    if (e.goodie) {
      document.getElementById('rating-goodie')?.querySelector('button')?.focus()
      return
    }
    if (e.visitMain) {
      document.getElementById('visit-main-first')?.focus()
      return
    }
    if (e.visitMainOther) {
      document.getElementById('visit-main-other')?.focus()
      return
    }
    if (e.hearAbout) {
      document.getElementById('hear-first')?.focus()
      return
    }
    if (e.hearAboutOther) {
      document.getElementById('hear-about-other')?.focus()
    }
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) {
      focusFirstInvalid(e)
      return
    }
    // POST /api/reviews/ with CSRF + multipart when backend exists
    setSubmitSuccess(true)
  }

  return (
    <div className="review-page">
      <div className="review-page__inner">
        <Link to="/" className="review-page__back">
          ← Back to home
        </Link>

        <header className="review-page__header">
          <h1 className="review-page__title">Rate a Pop-Up</h1>
          <p className="review-page__subtitle">Takes ~30 seconds ⚡</p>
        </header>

        {submitSuccess ? (
          <div
            id="review-success-msg"
            className="review-success"
            tabIndex={-1}
            role="status"
            aria-live="polite"
          >
            <p className="review-success__title">Review uploaded!</p>
            <p className="review-success__hint">Taking you home…</p>
          </div>
        ) : (
        <form className="review-form" onSubmit={handleSubmit} noValidate>
          <div className="review-field">
            <label className="review-field__label" htmlFor="company-search">
              Company {' '}
              <abbr className="review-required" title="required">
                *
              </abbr>
            </label>
            <div className="review-search-wrap">
              <IconSearch className="review-search-wrap__icon" ariaHidden />
              <input
                id="company-search"
                type="search"
                name="company"
                autoComplete="organization"
                placeholder="Search company name..."
                className={`review-search-wrap__input ${errors.company ? 'review-input--error' : ''}`}
                value={companyQuery}
                onChange={(ev) => {
                  setCompanyQuery(ev.target.value)
                  clearError('company')
                }}
                required
                aria-required="true"
                aria-invalid={errors.company ? 'true' : 'false'}
                aria-describedby={errors.company ? 'company-error' : undefined}
              />
            </div>
            {errors.company ? (
              <p id="company-error" className="review-field__error" role="alert">
                {errors.company}
              </p>
            ) : null}
          </div>

          <fieldset
            className={`review-field review-field--chips ${errors.secured || errors.securedOther ? 'review-field--invalid' : ''}`}
          >
            <legend className="review-field__label">
              What did you secure?{' '}
              <abbr className="review-required" title="required">
                *
              </abbr>
            </legend>
            <div className="review-chips" role="group" aria-label="Items secured">
              {SECURE_OPTIONS.map((opt, i) => (
                <button
                  key={opt}
                  id={i === 0 ? 'secured-first' : undefined}
                  type="button"
                  className={`review-chip ${secured.has(opt) ? 'review-chip--selected' : ''}`}
                  onClick={() => toggleChip(opt)}
                  aria-pressed={secured.has(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
            {secured.has('Other') ? (
              <div className="review-field__other-followup">
                <label className="review-field__label" htmlFor="secured-other">
                  Describe other{' '}
                  <abbr className="review-required" title="required">
                    *
                  </abbr>
                </label>
                <input
                  id="secured-other"
                  name="secured_other"
                  type="text"
                  className={`review-text-input ${errors.securedOther ? 'review-input--error' : ''}`}
                  placeholder="What did you secure?"
                  maxLength={MAX_OTHER_TEXT}
                  autoComplete="off"
                  value={securedOther}
                  onChange={(ev) => {
                    const v = ev.target.value.slice(0, MAX_OTHER_TEXT)
                    setSecuredOther(v)
                    clearError('securedOther')
                  }}
                  aria-required="true"
                  aria-invalid={errors.securedOther ? 'true' : 'false'}
                  aria-describedby={errors.securedOther ? 'secured-other-error' : undefined}
                />
                {errors.securedOther ? (
                  <p id="secured-other-error" className="review-field__error" role="alert">
                    {errors.securedOther}
                  </p>
                ) : null}
              </div>
            ) : null}
            {errors.secured ? (
              <p className="review-field__error" role="alert">
                {errors.secured}
              </p>
            ) : null}
          </fieldset>

          <div className="review-star-block" id="rating-block">
            <StarRating
              id="rating-vibe"
              label="Vibe"
              value={vibe}
              onChange={(v) => {
                setVibe(v)
                clearError('vibe')
              }}
              required
              error={errors.vibe}
            />
            <StarRating
              id="rating-queue"
              label="Queue Speed"
              value={queue}
              onChange={(v) => {
                setQueue(v)
                clearError('queue')
              }}
              required
              error={errors.queue}
            />
            <StarRating
              id="rating-goodie"
              label="Goodie Bag Quality"
              value={goodieQuality}
              onChange={(v) => {
                setGoodieQuality(v)
                clearError('goodie')
              }}
              required
              error={errors.goodie}
            />
          </div>

          <fieldset
            className={`review-field review-field--chips ${errors.visitMain || errors.visitMainOther ? 'review-field--invalid' : ''}`}
          >
            <legend className="review-field__label">
              Main reason for visiting{' '}
              <abbr className="review-required" title="required">
                *
              </abbr>
            </legend>
            <div className="review-chips" role="group" aria-label="Main reasons for visiting">
              {VISIT_MAIN_OPTIONS.map((opt, i) => (
                <button
                  key={opt}
                  id={i === 0 ? 'visit-main-first' : undefined}
                  type="button"
                  className={`review-chip ${visitMain.has(opt) ? 'review-chip--selected' : ''}`}
                  onClick={() => toggleVisitMain(opt)}
                  aria-pressed={visitMain.has(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
            {visitMain.has('Other') ? (
              <div className="review-field__other-followup">
                <label className="review-field__label" htmlFor="visit-main-other">
                  Describe other{' '}
                  <abbr className="review-required" title="required">
                    *
                  </abbr>
                </label>
                <input
                  id="visit-main-other"
                  name="visit_main_other"
                  type="text"
                  className={`review-text-input ${errors.visitMainOther ? 'review-input--error' : ''}`}
                  placeholder="Why did you visit?"
                  maxLength={MAX_OTHER_TEXT}
                  autoComplete="off"
                  value={visitMainOther}
                  onChange={(ev) => {
                    const v = ev.target.value.slice(0, MAX_OTHER_TEXT)
                    setVisitMainOther(v)
                    clearError('visitMainOther')
                  }}
                  aria-required="true"
                  aria-invalid={errors.visitMainOther ? 'true' : 'false'}
                  aria-describedby={errors.visitMainOther ? 'visit-main-other-error' : undefined}
                />
                {errors.visitMainOther ? (
                  <p id="visit-main-other-error" className="review-field__error" role="alert">
                    {errors.visitMainOther}
                  </p>
                ) : null}
              </div>
            ) : null}
            {errors.visitMain ? (
              <p className="review-field__error" role="alert">
                {errors.visitMain}
              </p>
            ) : null}
          </fieldset>

          <fieldset
            className={`review-field review-field--chips ${errors.hearAbout || errors.hearAboutOther ? 'review-field--invalid' : ''}`}
          >
            <legend className="review-field__label">
              How did you hear about it?{' '}
              <abbr className="review-required" title="required">
                *
              </abbr>
            </legend>
            <div className="review-chips" role="radiogroup" aria-label="How you heard about the event">
              {HEAR_ABOUT_OPTIONS.map((opt, i) => (
                <button
                  key={opt}
                  id={i === 0 ? 'hear-first' : undefined}
                  type="button"
                  className={`review-chip ${hearAbout === opt ? 'review-chip--selected' : ''}`}
                  onClick={() => selectHearAbout(opt)}
                  role="radio"
                  aria-checked={hearAbout === opt}
                >
                  {opt}
                </button>
              ))}
            </div>
            {hearAbout === 'Other' ? (
              <div className="review-field__other-followup">
                <label className="review-field__label" htmlFor="hear-about-other">
                  Please specify{' '}
                  <abbr className="review-required" title="required">
                    *
                  </abbr>
                </label>
                <input
                  id="hear-about-other"
                  name="hear_about_other"
                  type="text"
                  className={`review-text-input ${errors.hearAboutOther ? 'review-input--error' : ''}`}
                  placeholder="How did you hear about it?"
                  maxLength={MAX_OTHER_TEXT}
                  autoComplete="off"
                  value={hearAboutOther}
                  onChange={(ev) => {
                    const v = ev.target.value.slice(0, MAX_OTHER_TEXT)
                    setHearAboutOther(v)
                    clearError('hearAboutOther')
                  }}
                  aria-required="true"
                  aria-invalid={errors.hearAboutOther ? 'true' : 'false'}
                  aria-describedby={errors.hearAboutOther ? 'hear-about-other-error' : undefined}
                />
                {errors.hearAboutOther ? (
                  <p id="hear-about-other-error" className="review-field__error" role="alert">
                    {errors.hearAboutOther}
                  </p>
                ) : null}
              </div>
            ) : null}
            {errors.hearAbout ? (
              <p className="review-field__error" role="alert">
                {errors.hearAbout}
              </p>
            ) : null}
          </fieldset>

          <div className="review-field">
            <p className="review-field__label" id="proof-heading">
              Proof of Visit (optional)
            </p>
            <input
              id="proof-upload"
              name="proof"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="review-file-input"
              onChange={onProofChange}
              aria-describedby={proofError ? 'proof-error' : undefined}
            />
            <label htmlFor="proof-upload" className="review-upload">
              <IconCamera className="review-upload__icon" />
              <span className="review-upload__text">
                {proofFile ? proofFile.name : 'Tap to upload photo'}
              </span>
            </label>
            {proofError ? (
              <p id="proof-error" className="review-field__error" role="alert">
                {proofError}
              </p>
            ) : null}
          </div>

          <div className="review-field">
            <label className="review-field__label" htmlFor="comments">
              Comments (optional)
            </label>
            <textarea
              id="comments"
              name="comments"
              rows={4}
              className="review-textarea"
              placeholder="Anything else to share?"
              value={comments}
              onChange={(ev) => setComments(ev.target.value)}
            />
          </div>

          <div className="review-form__actions">
            <button type="submit" className="btn btn-primary review-submit">
              <IconSend className="review-submit__icon" />
              Submit Review
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  )
}
