import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  LEGAL_COMPANY_NAME,
  LEGAL_CONTACT_EMAIL,
  LEGAL_LAST_UPDATED,
  LegalPageLayout,
} from '../components/LegalPageLayout.jsx'

export default function CookiesPage() {
  useEffect(() => {
    const prev = document.title
    document.title = 'Cookie Policy — RateMyPopUp'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <LegalPageLayout title="Cookie Policy" lastUpdated={LEGAL_LAST_UPDATED}>
      <p className="legal-page__notice">
        This Cookie Policy explains how Rate My Popup (&ldquo;RateMyPopUp&rdquo;,
        &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) uses cookies
        and similar technologies when you visit our website.
      </p>

      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a
        website. They help sites remember your preferences, keep you signed in,
        and understand how the site is used. We also use similar technologies
        such as local storage, which stores data in your browser for
        authentication and session management.
      </p>

      <h2>2. How we use cookies and similar technologies</h2>
      <p>RateMyPopUp uses cookies and browser storage for the following purposes:</p>

      <h2>3. Strictly necessary</h2>
      <p>
        These are required for the site to function and cannot be switched off
        in our systems. They are usually set in response to actions you take,
        such as signing in.
      </p>
      <ul>
        <li>
          <strong>Authentication and session (Supabase):</strong> Keeps you
          signed in after Google OAuth and maintains secure session tokens.
          Stored via cookies and/or local storage managed by our Supabase
          authentication provider.
        </li>
        <li>
          <strong>Security:</strong> Helps protect against cross-site request
          forgery and unauthorized access.
        </li>
      </ul>

      <h2>4. Functional</h2>
      <p>
        These remember choices you make to provide a more personalized
        experience.
      </p>
      <ul>
        <li>
          <strong>Preferences:</strong> Settings such as UI state or return
          paths after sign-in, where applicable.
        </li>
      </ul>

      <h2>5. Third-party cookies</h2>
      <p>
        Some cookies are set by services we use to operate RateMyPopUp:
      </p>
      <ul>
        <li>
          <strong>Google (OAuth):</strong> When you sign in with Google, Google
          may set cookies to authenticate your account and manage the sign-in
          flow. See{' '}
          <a
            href="https://policies.google.com/technologies/cookies"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google&apos;s cookie information
          </a>
          .
        </li>
        <li>
          <strong>Supabase:</strong> Our backend provider may use cookies or
          comparable technologies for hosting, API requests, and authentication.
          See{' '}
          <a
            href="https://supabase.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Supabase&apos;s privacy documentation
          </a>
          .
        </li>
      </ul>
      <p>
        We do not use third-party advertising cookies on RateMyPopUp at this
        time. If that changes, we will update this policy.
      </p>

      <h2>6. Analytics</h2>
      <p>
        We may use first-party or privacy-focused analytics in the future to
        understand how visitors use the site (for example, page views and
        feature usage). If non-essential analytics cookies are introduced, we
        will describe them here and, where required by law, request your consent
        before they are placed.
      </p>

      <h2>7. How to control cookies</h2>
      <p>You can manage cookies in several ways:</p>
      <ul>
        <li>
          <strong>Browser settings:</strong> Most browsers let you block or
          delete cookies. See your browser&apos;s help section for instructions
          (Chrome, Safari, Firefox, Edge, and others).
        </li>
        <li>
          <strong>Sign out:</strong> Signing out of RateMyPopUp clears active
          session data tied to your account in the browser.
        </li>
        <li>
          <strong>Google account controls:</strong> Manage Google sign-in and
          connected apps from your Google Account security settings.
        </li>
      </ul>
      <p>
        Blocking strictly necessary cookies or clearing local storage may prevent
        you from signing in or using core features such as submitting reviews.
      </p>

      <h2>8. Do Not Track</h2>
      <p>
        Some browsers offer a &ldquo;Do Not Track&rdquo; signal. There is no
        uniform industry standard for responding to DNT signals; we do not
        currently alter our practices solely in response to DNT.
      </p>

      <h2>9. More information</h2>
      <p>
        For details on how we handle personal data, including information
        collected through cookies, see our <Link to="/privacy">Privacy Policy</Link>.
      </p>

      <h2>10. Changes to this policy</h2>
      <p>
        We may update this Cookie Policy from time to time. The &ldquo;Last
        updated&rdquo; date at the top reflects the latest version. Material
        changes will be posted on this page.
      </p>

      <h2>11. Contact</h2>
      <p>
        {LEGAL_COMPANY_NAME}
        <br />
        Email:{' '}
        <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>
      </p>
    </LegalPageLayout>
  )
}
