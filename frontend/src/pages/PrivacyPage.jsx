import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  LEGAL_COMPANY_NAME,
  LEGAL_CONTACT_EMAIL,
  LEGAL_LAST_UPDATED,
  LegalPageLayout,
} from '../components/LegalPageLayout.jsx'

export default function PrivacyPage() {
  useEffect(() => {
    const prev = document.title
    document.title = 'Privacy Policy — RateMyPopUp'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated={LEGAL_LAST_UPDATED}>
      <p className="legal-page__notice">
        This policy describes how Rate My Popup (&ldquo;RateMyPopUp&rdquo;,
        &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) collects,
        uses, and protects personal information when you use our website and
        services.
      </p>

      <h2>1. Who we are</h2>
      <p>
        Rate My Popup is operated by {LEGAL_COMPANY_NAME}. We provide a platform
        for pop-up and event attendees to submit reviews and for business owners
        to understand attendee sentiment, queue performance, and freebie
        effectiveness.
      </p>
      <p>
        For privacy-related questions, contact us at{' '}
        <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>.
      </p>

      <h2>2. Information we collect</h2>
      <p>We may collect the following categories of information:</p>
      <ul>
        <li>
          <strong>Account information:</strong> When you sign in with Google, we
          receive your name, email address, and basic profile information made
          available by Google (such as your profile picture).
        </li>
        <li>
          <strong>Review and user-generated content:</strong> Ratings, written
          feedback, optional photos, event or company selections, and other
          details you submit when leaving a review.
        </li>
        <li>
          <strong>Usage and technical data:</strong> Pages visited, actions
          taken on the site, browser type, device information, and approximate
          location derived from IP address.
        </li>
        <li>
          <strong>Cookies and similar technologies:</strong> See our{' '}
          <Link to="/cookies">Cookie Policy</Link> for details.
        </li>
      </ul>
      <p>
        We do not intentionally collect sensitive personal data. Please do not
        include unnecessary personal information in public review content.
      </p>

      <h2>3. How we use your information</h2>
      <p>We use personal information to:</p>
      <ul>
        <li>Provide, operate, and improve Rate My Popup;</li>
        <li>Authenticate users and prevent spam or abuse;</li>
        <li>Display reviews and aggregated insights to users and business owners;</li>
        <li>Respond to support requests and communicate about the service;</li>
        <li>Maintain security, debug issues, and comply with legal obligations;</li>
        <li>Analyze usage trends to improve product features and performance.</li>
      </ul>

      <h2>4. Legal bases for processing</h2>
      <p>
        Where applicable (for example, under UK or EU data protection law), we
        process personal data on the basis of: (a) performance of a contract
        when you use the service; (b) legitimate interests such as fraud
        prevention, analytics, and service improvement; (c) consent where
        required (for example, non-essential cookies); and (d) compliance with
        legal obligations.
      </p>

      <h2>5. Third-party services</h2>
      <p>
        We use trusted providers to run Rate My Popup. These providers process
        data on our behalf and under appropriate safeguards:
      </p>
      <ul>
        <li>
          <strong>Supabase</strong> — authentication, database hosting, file
          storage, and backend infrastructure. Data is stored and processed
          according to Supabase&apos;s security and privacy practices.
        </li>
        <li>
          <strong>Google</strong> — OAuth sign-in. When you choose &ldquo;Sign in
          with Google,&rdquo; Google processes your credentials according to{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google&apos;s Privacy Policy
          </a>
          .
        </li>
      </ul>
      <p>
        We do not sell your personal information. We may share data when required
        by law, to protect rights and safety, or in connection with a business
        transfer (such as a merger), subject to appropriate notice where
        required.
      </p>

      <h2>6. Data retention</h2>
      <p>
        We retain personal information for as long as needed to provide the
        service, fulfill the purposes described in this policy, and comply with
        legal obligations. Review content may remain visible after account
        deletion where needed for platform integrity or legal compliance, unless
        deletion is required by law or we agree otherwise.
      </p>

      <h2>7. Your rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct,
        delete, restrict, or object to certain processing of your personal data,
        and to data portability or withdrawal of consent where processing is
        consent-based.
      </p>
      <p>
        To exercise these rights, email{' '}
        <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>. We
        may need to verify your identity before responding. You may also lodge a
        complaint with your local data protection authority.
      </p>

      <h2>8. Cookies</h2>
      <p>
        We use cookies and similar technologies for authentication, security,
        and basic site functionality. For a full description of cookies we use
        and how to manage them, see our <Link to="/cookies">Cookie Policy</Link>.
      </p>

      <h2>9. International transfers</h2>
      <p>
        Your information may be processed in countries other than your own,
        including where our service providers operate. Where required, we use
        appropriate safeguards for cross-border transfers.
      </p>

      <h2>10. Children</h2>
      <p>
        Rate My Popup is not directed at children under 13 (or the minimum age
        required in your jurisdiction). We do not knowingly collect personal
        information from children. If you believe a child has provided us data,
        contact us and we will take appropriate steps to delete it.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The &ldquo;Last
        updated&rdquo; date at the top reflects the latest revision. Material
        changes will be posted on this page; continued use of the service after
        changes take effect constitutes acceptance of the updated policy.
      </p>

      <h2>12. Contact</h2>
      <p>
        {LEGAL_COMPANY_NAME}
        <br />
        Email:{' '}
        <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>
      </p>
    </LegalPageLayout>
  )
}
