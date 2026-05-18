import { Link } from 'react-router-dom'
import './LegalPageLayout.css'

const LEGAL_LINKS = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
  { to: '/cookies', label: 'Cookie Policy' },
]

/**
 * Shared shell for legal pages — matches landing typography and brand colors.
 */
export function LegalPageLayout({ title, lastUpdated, children }) {
  return (
    <div className="legal-page">
      <div className="legal-page__inner">
        <Link to="/" className="legal-page__back">
          ← Back to home
        </Link>

        <header className="legal-page__header">
          <p className="legal-page__updated">Last updated: {lastUpdated}</p>
          <h1 className="legal-page__title">{title}</h1>
        </header>

        <article className="legal-page__content">{children}</article>

        <nav className="legal-page__nav" aria-label="Related legal pages">
          {LEGAL_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className="legal-page__nav-link">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

export const LEGAL_LAST_UPDATED = 'May 18, 2026'

export const LEGAL_CONTACT_EMAIL = 'ratemypopup@gmail.com'

export const LEGAL_COMPANY_NAME = 'RateMyPopUp'
