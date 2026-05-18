import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { CompanyAutocomplete } from '../components/CompanyAutocomplete.jsx'
import { StarRating } from '../components/StarRating.jsx'
import {
  attachProofToReview,
  getOrCreateCompanyId,
  insertReview,
  uploadReviewProof,
  validateProofImage,
} from '../utils/reviews.js'
import './ReviewPage.css'

const SECURE_OPTIONS = [
  'Goodie bag',
  'Sample',
  'Full product',
  'Drink/Food',
  'Photo opportunity',
  'Stickers',
  'Tote bag',
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

/**
 * 5-point Likert for brand perception (stored as 1–5 in `brand_perception_likert`).
 */
const BRAND_PERCEPTION_LIKERT = [
  { value: 1, label: 'Strongly disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly agree' },
]

/** Matches DB `attended_with` CHECK (lowercase). */
const ATTENDED_WITH_OPTIONS = [
  { value: 'alone', label: 'Alone' },
  { value: 'friends', label: 'Friends' },
  { value: 'partner', label: 'Partner' },
  { value: 'family', label: 'Family' },
]

const MAX_OTHER_TEXT = 200
/** Hard cap to avoid accidental spammy multi-company submissions. */
const MAX_COLLAB_COMPANIES = 6
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
  const location = useLocation()
  const { user } = useAuth()
  const initialCompanyQuery = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('company')?.slice(0, 120) ?? ''
  }, [location.search])
  const initialCompanyId = useMemo(() => {
    const params = new URLSearchParams(location.search)
    const raw = params.get('companyId')
    return raw && raw.length <= 64 ? raw : null
  }, [location.search])
  const [companyQuery, setCompanyQuery] = useState('')
  const [selectedCompanies, setSelectedCompanies] = useState([])
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
  const [proofPreviewUrl, setProofPreviewUrl] = useState(null)
  const proofPreviewRef = useRef(null)
  const [proofValidating, setProofValidating] = useState(false)
  const [proofError, setProofError] = useState('')
  const [comments, setComments] = useState('')
  const [errors, setErrors] = useState({})
  /** 0 = none selected; 1–5 = Likert score for brand perception. */
  const [brandPerceptionLikert, setBrandPerceptionLikert] = useState(0)
  /** null until user picks Yes or No */
  const [purchasedAtPopup, setPurchasedAtPopup] = useState(null)
  const [heardBrandBefore, setHeardBrandBefore] = useState(null)
  /** '' until user picks; values match DB enum: alone | friends | partner | family */
  const [attendedWith, setAttendedWith] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submittedCount, setSubmittedCount] = useState(1)
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const prev = document.title
    document.title = 'Rate a Pop-Up — RateMyPopUp'
    return () => {
      document.title = prev
    }
  }, [])

  useEffect(() => {
    const next = []
    if (initialCompanyQuery.trim()) {
      next.push({
        id: initialCompanyId,
        name: initialCompanyQuery.trim().slice(0, 120),
      })
    }
    setSelectedCompanies(next)
    setCompanyQuery('')
  }, [initialCompanyId, initialCompanyQuery])

  const clearError = useCallback((key) => {
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const companiesToSubmit = useMemo(() => {
    const out = []
    const seen = new Set()

    for (const item of selectedCompanies) {
      const name = String(item?.name ?? '').trim()
      if (!name) continue
      const key = item?.id ? `id:${item.id}` : `name:${name.toLowerCase()}`
      if (seen.has(key)) continue
      seen.add(key)
      out.push({ id: item?.id ?? null, name })
    }

    const trailing = companyQuery.trim()
    if (trailing) {
      const key = `name:${trailing.toLowerCase()}`
      if (!seen.has(key)) {
        out.push({ id: null, name: trailing })
      }
    }

    return out.slice(0, MAX_COLLAB_COMPANIES)
  }, [companyQuery, selectedCompanies])

  const addSelectedCompany = useCallback((name, companyId = null) => {
    const trimmed = String(name ?? '').trim()
    if (!trimmed) return

    setSelectedCompanies((prev) => {
      const deduped = prev.filter((item) => {
        if (companyId && item.id && item.id === companyId) return false
        return item.name.toLowerCase() !== trimmed.toLowerCase()
      })

      return [...deduped, { id: companyId, name: trimmed }].slice(
        0,
        MAX_COLLAB_COMPANIES
      )
    })
    setCompanyQuery('')
    clearError('company')
  }, [clearError])

  const removeSelectedCompany = useCallback((idx) => {
    setSelectedCompanies((prev) => prev.filter((_, i) => i !== idx))
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

  const clearProofPreview = useCallback(() => {
    if (proofPreviewRef.current) {
      URL.revokeObjectURL(proofPreviewRef.current)
      proofPreviewRef.current = null
    }
    setProofPreviewUrl(null)
  }, [])

  const onProofChange = useCallback(async (e) => {
    const file = e.target.files?.[0]
    setProofError('')
    clearProofPreview()
    setProofFile(null)

    if (!file) return

    setProofValidating(true)
    try {
      const result = await validateProofImage(file)
      if (!result.ok) {
        setProofError(result.error)
        e.target.value = ''
        return
      }
      setProofFile(file)
      const url = URL.createObjectURL(file)
      proofPreviewRef.current = url
      setProofPreviewUrl(url)
    } finally {
      setProofValidating(false)
    }
  }, [clearProofPreview])

  useEffect(() => () => clearProofPreview(), [clearProofPreview])

  const validate = useCallback(() => {
    const e = {}
    if (companiesToSubmit.length === 0) {
      e.company = 'Add at least one company for this review.'
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
      e.goodie = 'Rate item obtained quality.'
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
    if (brandPerceptionLikert < 1 || brandPerceptionLikert > 5) {
      e.brandPerception =
        'Please rate whether this experience improved your perception of the brand.'
    }
    if (purchasedAtPopup !== true && purchasedAtPopup !== false) {
      e.purchasedAtPopup = 'Please say whether you made a purchase at this pop-up.'
    }
    if (heardBrandBefore !== true && heardBrandBefore !== false) {
      e.heardBrandBefore = 'Please say whether you had heard of this brand before.'
    }
    if (!attendedWith) {
      e.attendedWith = 'Please say who you attended with.'
    }
    return e
  }, [
    companiesToSubmit,
    secured,
    securedOther,
    vibe,
    queue,
    goodieQuality,
    visitMain,
    visitMainOther,
    hearAbout,
    hearAboutOther,
    brandPerceptionLikert,
    purchasedAtPopup,
    heardBrandBefore,
    attendedWith,
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
      return
    }
    if (e.brandPerception) {
      document.getElementById('likert-first')?.focus()
      return
    }
    if (e.purchasedAtPopup) {
      document.getElementById('purchase-yes')?.focus()
      return
    }
    if (e.heardBrandBefore) {
      document.getElementById('heard-yes')?.focus()
      return
    }
    if (e.attendedWith) {
      document.getElementById('attended-first')?.focus()
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) {
      focusFirstInvalid(e)
      return
    }
    if (!user?.id) {
      setSubmitError('You must be signed in to submit a review.')
      return
    }

    if (proofFile) {
      const proofCheck = await validateProofImage(proofFile)
      if (!proofCheck.ok) {
        setProofError(proofCheck.error)
        document.getElementById('proof-upload')?.focus()
        return
      }
    }

    setSubmitting(true)
    try {
      // Resolve every selected collaborator to a canonical company uuid.
      const resolvedCompanyIds = []
      for (const company of companiesToSubmit) {
        const companyId = company.id ?? (await getOrCreateCompanyId(company.name))
        if (!resolvedCompanyIds.includes(companyId)) {
          resolvedCompanyIds.push(companyId)
        }
      }
      if (resolvedCompanyIds.length === 0) {
        throw new Error('Please add at least one company before submitting.')
      }

      // Serialize multi-select chips (existing columns are varchar).
      const securedPayload = [
        ...Array.from(secured).filter((s) => s !== 'Other'),
        ...(secured.has('Other') && securedOther.trim()
          ? [`Other: ${securedOther.trim().slice(0, MAX_OTHER_TEXT)}`]
          : []),
      ]
      const visitPayload = [
        ...Array.from(visitMain).filter((s) => s !== 'Other'),
        ...(visitMain.has('Other') && visitMainOther.trim()
          ? [`Other: ${visitMainOther.trim().slice(0, MAX_OTHER_TEXT)}`]
          : []),
      ]
      const hearAboutPayload =
        hearAbout === 'Other' && hearAboutOther.trim()
          ? `Other: ${hearAboutOther.trim().slice(0, MAX_OTHER_TEXT)}`
          : hearAbout

      // Keep one shared timestamp across all collaborator rows so the home
      // feed can collapse them into a single combined card.
      const submittedAt = new Date().toISOString()
      let createdCount = 0
      let proofAttached = false
      for (const companyId of resolvedCompanyIds) {
        const review = await insertReview({
          account_id: user.id,
          company_id: companyId,
          items_secured: JSON.stringify(securedPayload),
          vibe,
          queue_speed: queue,
          goodie_bag_quality: goodieQuality,
          reason_visit: JSON.stringify(visitPayload),
          hear_about: hearAboutPayload,
          comments: comments.trim() || null,
          proof: null,
          date: submittedAt,
          brand_perception_likert: brandPerceptionLikert,
          purchased_at_popup: purchasedAtPopup,
          heard_brand_before: heardBrandBefore,
          attended_with: attendedWith,
        })
        createdCount += 1

        if (proofFile && !proofAttached) {
          try {
            const proofMeta = await uploadReviewProof({
              file: proofFile,
              userId: user.id,
              reviewId: review.review_id,
            })
            if (proofMeta) {
              await attachProofToReview(review.review_id, proofMeta)
              proofAttached = true
            }
          } catch (uploadErr) {
            console.warn('[review] proof upload failed:', uploadErr?.message)
            setSubmitError(
              uploadErr?.message ||
                'Your review was saved, but the photo could not be uploaded. Try again without a photo or re-submit later.'
            )
          }
        }
      }

      setSubmittedCount(createdCount)
      setSubmitSuccess(true)
    } catch (err) {
      setSubmitError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
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
            <p className="review-success__title">Review Uploading!</p>
            <p className="review-success__hint">
            </p>
          </div>
        ) : (
        <form className="review-form" onSubmit={handleSubmit} noValidate>
          <div className="review-field">
            <label className="review-field__label" htmlFor="company-search">
              Company(ies){' '}
              <abbr className="review-required" title="required">
                *
              </abbr>
            </label>
            <div
              className="review-company-input-row"
              onKeyDown={(event) => {
                const target = event.target
                if (
                  event.key !== 'Enter' ||
                  event.defaultPrevented ||
                  !(target instanceof HTMLElement) ||
                  target.id !== 'company-search'
                ) {
                  return
                }
                event.preventDefault()
                addSelectedCompany(companyQuery, null)
              }}
            >
              <CompanyAutocomplete
                id="company-search"
                value={companyQuery}
                onValueChange={(name, companyId) => {
                  if (companyId) {
                    addSelectedCompany(name, companyId)
                    return
                  }
                  setCompanyQuery(name)
                  clearError('company')
                }}
                error={errors.company}
                required
              />
            </div>
            <p className="review-company-hint">
              Press Enter after typing, or pick an existing company. Remove by clicking.
            </p>
            {selectedCompanies.length > 0 ? (
              <ul className="review-company-list" aria-label="Selected companies">
                {selectedCompanies.map((item, index) => (
                  <li
                    key={`${item.id ?? item.name}-${index}`}
                    className="review-company-item"
                  >
                    <button
                      type="button"
                      className="review-company-chip"
                      onClick={() => removeSelectedCompany(index)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <span>{item.name}</span>
                    </button>
                    {index < selectedCompanies.length - 1 ? (
                      <span className="review-company-separator" aria-hidden>
                        x
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}
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
              label="Item Obtained Quality"
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

          <fieldset
            className={`review-field review-likert-scale-field ${errors.brandPerception ? 'review-field--invalid' : ''}`}
          >
            <legend className="review-field__label">
              Has this experience improved your perception of this brand?{' '}
              <abbr className="review-required" title="required">
                *
              </abbr>
            </legend>
            <p className="review-likert-scale__hints">
              <span>Strongly disagree</span>
              <span>Strongly agree</span>
            </p>
            <div
              className="review-likert-scale"
              role="radiogroup"
              aria-label="Brand perception after visit"
              aria-required="true"
            >
              <div className="review-likert-scale__nodes">
                {BRAND_PERCEPTION_LIKERT.map((opt, i) => (
                  <Fragment key={opt.value}>
                    <div className="review-likert-scale__step">
                      <button
                        type="button"
                        id={i === 0 ? 'likert-first' : undefined}
                        role="radio"
                        aria-checked={brandPerceptionLikert === opt.value}
                        aria-label={`${opt.label} (${opt.value} of 5)`}
                        className={`review-likert-scale__node ${brandPerceptionLikert === opt.value ? 'is-selected' : ''}`}
                        onClick={() => {
                          setBrandPerceptionLikert(opt.value)
                          clearError('brandPerception')
                        }}
                      >
                        <span className="review-likert-scale__node-value">{opt.value}</span>
                      </button>
                    </div>
                    {i < BRAND_PERCEPTION_LIKERT.length - 1 ? (
                      <div
                        className={`review-likert-scale__connector ${brandPerceptionLikert > i + 1 ? 'is-filled' : ''}`}
                        aria-hidden
                      />
                    ) : null}
                  </Fragment>
                ))}
              </div>
            </div>
            <p className="review-likert-scale__current" aria-live="polite">
              {brandPerceptionLikert >= 1 && brandPerceptionLikert <= 5
                ? BRAND_PERCEPTION_LIKERT.find((o) => o.value === brandPerceptionLikert)?.label
                : '\u00a0'}
            </p>
            {errors.brandPerception ? (
              <p className="review-field__error" role="alert">
                {errors.brandPerception}
              </p>
            ) : null}
          </fieldset>

          <fieldset
            className={`review-field review-field--chips ${errors.purchasedAtPopup ? 'review-field--invalid' : ''}`}
          >
            <legend className="review-field__label">
              Did you make a purchase at this pop-up?{' '}
              <abbr className="review-required" title="required">
                *
              </abbr>
            </legend>
            <div
              className="review-yesno review-chips"
              role="radiogroup"
              aria-label="Made a purchase"
              aria-required="true"
            >
              <button
                id="purchase-yes"
                type="button"
                role="radio"
                aria-checked={purchasedAtPopup === true}
                className={`review-chip ${purchasedAtPopup === true ? 'review-chip--selected' : ''}`}
                onClick={() => {
                  setPurchasedAtPopup(true)
                  clearError('purchasedAtPopup')
                }}
              >
                Yes
              </button>
              <button
                id="purchase-no"
                type="button"
                role="radio"
                aria-checked={purchasedAtPopup === false}
                className={`review-chip ${purchasedAtPopup === false ? 'review-chip--selected' : ''}`}
                onClick={() => {
                  setPurchasedAtPopup(false)
                  clearError('purchasedAtPopup')
                }}
              >
                No
              </button>
            </div>
            {errors.purchasedAtPopup ? (
              <p className="review-field__error" role="alert">
                {errors.purchasedAtPopup}
              </p>
            ) : null}
          </fieldset>

          <fieldset
            className={`review-field review-field--chips ${errors.heardBrandBefore ? 'review-field--invalid' : ''}`}
          >
            <legend className="review-field__label">
              Have you heard of this brand before?{' '}
              <abbr className="review-required" title="required">
                *
              </abbr>
            </legend>
            <div
              className="review-yesno review-chips"
              role="radiogroup"
              aria-label="Heard of brand before visit"
              aria-required="true"
            >
              <button
                id="heard-yes"
                type="button"
                role="radio"
                aria-checked={heardBrandBefore === true}
                className={`review-chip ${heardBrandBefore === true ? 'review-chip--selected' : ''}`}
                onClick={() => {
                  setHeardBrandBefore(true)
                  clearError('heardBrandBefore')
                }}
              >
                Yes
              </button>
              <button
                id="heard-no"
                type="button"
                role="radio"
                aria-checked={heardBrandBefore === false}
                className={`review-chip ${heardBrandBefore === false ? 'review-chip--selected' : ''}`}
                onClick={() => {
                  setHeardBrandBefore(false)
                  clearError('heardBrandBefore')
                }}
              >
                No
              </button>
            </div>
            {errors.heardBrandBefore ? (
              <p className="review-field__error" role="alert">
                {errors.heardBrandBefore}
              </p>
            ) : null}
          </fieldset>

          <fieldset
            className={`review-field review-field--chips ${errors.attendedWith ? 'review-field--invalid' : ''}`}
          >
            <legend className="review-field__label">
              Who did you attend with?{' '}
              <abbr className="review-required" title="required">
                *
              </abbr>
            </legend>
            <div className="review-chips" role="radiogroup" aria-label="Who you attended with">
              {ATTENDED_WITH_OPTIONS.map((opt, i) => (
                <button
                  key={opt.value}
                  id={i === 0 ? 'attended-first' : undefined}
                  type="button"
                  role="radio"
                  aria-checked={attendedWith === opt.value}
                  className={`review-chip ${attendedWith === opt.value ? 'review-chip--selected' : ''}`}
                  onClick={() => {
                    setAttendedWith(opt.value)
                    clearError('attendedWith')
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {errors.attendedWith ? (
              <p className="review-field__error" role="alert">
                {errors.attendedWith}
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
              disabled={proofValidating || submitting}
              aria-describedby={proofError ? 'proof-error' : undefined}
            />
            <label htmlFor="proof-upload" className="review-upload">
              <IconCamera className="review-upload__icon" />
              <span className="review-upload__text">
                {proofValidating
                  ? 'Checking photo…'
                  : proofFile
                    ? proofFile.name
                    : 'Tap to upload photo'}
              </span>
            </label>
            {proofPreviewUrl ? (
              <div className="review-proof-preview">
                <img
                  src={proofPreviewUrl}
                  alt="Preview of your proof of visit"
                  className="review-proof-preview__img"
                />
                <p className="review-proof-preview__hint">Photo looks good — it will appear with your review.</p>
              </div>
            ) : null}
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

          {submitError ? (
            <p className="review-field__error review-form__submit-error" role="alert">
              {submitError}
            </p>
          ) : null}

          <div className="review-form__actions">
            <button
              type="submit"
              className="btn btn-primary review-submit"
              disabled={submitting}
              aria-busy={submitting}
            >
              <IconSend className="review-submit__icon" />
              {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  )
}
