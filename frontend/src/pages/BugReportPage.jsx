import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LEGAL_CONTACT_EMAIL } from '../components/LegalPageLayout.jsx'
import './BugReportPage.css'

const MAX_NAME = 80
const MAX_EMAIL = 120
const MAX_PAGE = 120
const MAX_DESCRIPTION = 2000
const MAX_STEPS = 1500

function buildMailto({ name, email, page, description, steps, browser }) {
  const subject = encodeURIComponent('[RateMyPopUp Bug] User report')
  const lines = [
    'Bug report from RateMyPopUp',
    '',
    `Name: ${name || 'Not provided'}`,
    `Reply email: ${email}`,
    `Page / feature: ${page || 'Not specified'}`,
    `Browser / device: ${browser || 'Not specified'}`,
    '',
    'What happened:',
    description,
    '',
    'Steps to reproduce:',
    steps || 'Not provided',
  ]
  const body = encodeURIComponent(lines.join('\n'))
  return `mailto:${LEGAL_CONTACT_EMAIL}?subject=${subject}&body=${body}`
}

export default function BugReportPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [page, setPage] = useState('')
  const [description, setDescription] = useState('')
  const [steps, setSteps] = useState('')
  const [browser, setBrowser] = useState('')
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const prev = document.title
    document.title = 'Report a Bug — RateMyPopUp'
    return () => {
      document.title = prev
    }
  }, [])

  useEffect(() => {
    if (typeof navigator === 'undefined') return
    setBrowser(navigator.userAgent.slice(0, 240))
  }, [])

  const validate = useCallback(() => {
    const next = {}
    const trimmedEmail = email.trim()
    const trimmedDescription = description.trim()

    if (!trimmedEmail) {
      next.email = 'Please enter your email so we can follow up.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      next.email = 'Please enter a valid email address.'
    }

    if (!trimmedDescription) {
      next.description = 'Please describe what went wrong.'
    } else if (trimmedDescription.length < 10) {
      next.description = 'Please add a bit more detail (at least 10 characters).'
    }

    return next
  }, [description, email])

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const mailto = buildMailto({
      name: name.trim(),
      email: email.trim(),
      page: page.trim(),
      description: description.trim(),
      steps: steps.trim(),
      browser: browser.trim(),
    })

    window.location.href = mailto
    setSubmitted(true)
  }

  return (
    <div className="bug-page">
      <div className="bug-page__inner">
        <Link to="/" className="bug-page__back">
          ← Back to home
        </Link>

        <header className="bug-page__header">
          <h1 className="bug-page__title">Bugs?</h1>
          <p className="bug-page__lead">
            Found something broken? Tell us what happened and we&apos;ll look into it.
            Reports are sent to{' '}
            <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>.
          </p>
        </header>

        {submitted ? (
          <div className="bug-page__success" role="status" aria-live="polite">
            <p className="bug-page__success-title">Thanks — your email app should open now.</p>
            <p className="bug-page__success-text">
              Send the pre-filled message to complete your report. If nothing opened, email us
              directly at{' '}
              <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>.
            </p>
            <button
              type="button"
              className="bug-page__submit"
              onClick={() => setSubmitted(false)}
            >
              Send another report
            </button>
          </div>
        ) : (
          <form className="bug-form" onSubmit={handleSubmit} noValidate>
            <div className="bug-field">
              <label className="bug-field__label" htmlFor="bug-name">
                Your name
              </label>
              <input
                id="bug-name"
                type="text"
                className="bug-field__input"
                value={name}
                maxLength={MAX_NAME}
                autoComplete="name"
                onChange={(e) => setName(e.target.value.slice(0, MAX_NAME))}
              />
            </div>

            <div className="bug-field">
              <label className="bug-field__label" htmlFor="bug-email">
                Your email{' '}
                <abbr className="bug-required" title="required">
                  *
                </abbr>
              </label>
              <input
                id="bug-email"
                type="email"
                className={`bug-field__input ${errors.email ? 'bug-field__input--error' : ''}`}
                value={email}
                maxLength={MAX_EMAIL}
                autoComplete="email"
                required
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'bug-email-error' : undefined}
                onChange={(e) => {
                  setEmail(e.target.value.slice(0, MAX_EMAIL))
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                }}
              />
              {errors.email ? (
                <p id="bug-email-error" className="bug-field__error" role="alert">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div className="bug-field">
              <label className="bug-field__label" htmlFor="bug-page">
                Page or feature
              </label>
              <input
                id="bug-page"
                type="text"
                className="bug-field__input"
                placeholder="e.g. Review form, Explore, sign-in"
                value={page}
                maxLength={MAX_PAGE}
                onChange={(e) => setPage(e.target.value.slice(0, MAX_PAGE))}
              />
            </div>

            <div className="bug-field">
              <label className="bug-field__label" htmlFor="bug-description">
                What happened?{' '}
                <abbr className="bug-required" title="required">
                  *
                </abbr>
              </label>
              <textarea
                id="bug-description"
                className={`bug-field__textarea ${errors.description ? 'bug-field__input--error' : ''}`}
                rows={5}
                value={description}
                maxLength={MAX_DESCRIPTION}
                required
                placeholder="Describe the bug — what you expected vs what actually happened."
                aria-invalid={errors.description ? 'true' : 'false'}
                aria-describedby={errors.description ? 'bug-description-error' : undefined}
                onChange={(e) => {
                  setDescription(e.target.value.slice(0, MAX_DESCRIPTION))
                  if (errors.description) {
                    setErrors((prev) => ({ ...prev, description: undefined }))
                  }
                }}
              />
              {errors.description ? (
                <p id="bug-description-error" className="bug-field__error" role="alert">
                  {errors.description}
                </p>
              ) : null}
            </div>

            <div className="bug-field">
              <label className="bug-field__label" htmlFor="bug-steps">
                Steps to reproduce
              </label>
              <textarea
                id="bug-steps"
                className="bug-field__textarea"
                rows={4}
                value={steps}
                maxLength={MAX_STEPS}
                placeholder="1. Go to… 2. Click… 3. See error"
                onChange={(e) => setSteps(e.target.value.slice(0, MAX_STEPS))}
              />
            </div>

            <div className="bug-field">
              <label className="bug-field__label" htmlFor="bug-browser">
                Browser / device
              </label>
              <input
                id="bug-browser"
                type="text"
                className="bug-field__input"
                value={browser}
                maxLength={240}
                onChange={(e) => setBrowser(e.target.value.slice(0, 240))}
              />
            </div>

            <button type="submit" className="bug-page__submit">
              Send bug report
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
