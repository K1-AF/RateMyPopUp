import { useEffect } from 'react'
import {
  LEGAL_COMPANY_NAME,
  LEGAL_CONTACT_EMAIL,
  LEGAL_LAST_UPDATED,
  LegalPageLayout,
} from '../components/LegalPageLayout.jsx'

export default function TermsPage() {
  useEffect(() => {
    const prev = document.title
    document.title = 'Terms of Service — RateMyPopUp'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <LegalPageLayout title="Terms of Service" lastUpdated={LEGAL_LAST_UPDATED}>
      <p className="legal-page__notice">
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
        use of Rate My Popup (&ldquo;RateMyPopUp&rdquo;, &ldquo;we&rdquo;,
        &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By using the service, you
        agree to these Terms.
      </p>

      <h2>1. About the service</h2>
      <p>
        Rate My Popup is a platform that allows attendees to review pop-up
        events and businesses, and helps event and pop-up business owners track
        attendee sentiment, queue performance, and freebie effectiveness through
        aggregated feedback and reporting tools.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 13 years old (or the minimum age required in your
        jurisdiction) and able to form a binding contract to use the service.
        By using RateMyPopUp, you represent that you meet these requirements.
      </p>

      <h2>3. Accounts and authentication</h2>
      <p>
        Certain features, such as submitting reviews, require you to sign in
        with Google. You are responsible for maintaining the security of your
        Google account and for all activity that occurs under your RateMyPopUp
        account. Notify us promptly at{' '}
        <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a> if
        you suspect unauthorized access.
      </p>
      <p>
        We may suspend or refuse account access if we reasonably believe your
        account is being used in violation of these Terms or applicable law.
      </p>

      <h2>4. User content and reviews</h2>
      <p>
        You retain ownership of content you submit. By posting reviews, photos,
        or other content, you grant {LEGAL_COMPANY_NAME} a non-exclusive,
        worldwide, royalty-free license to use, host, store, reproduce, display,
        and distribute that content solely to operate, promote, and improve
        RateMyPopUp.
      </p>
      <p>You agree that your content will:</p>
      <ul>
        <li>Be truthful to the best of your knowledge;</li>
        <li>Not infringe third-party rights or contain unlawful material;</li>
        <li>Not include harassment, hate speech, or personal data of others without consent;</li>
        <li>Not attempt to manipulate ratings or misrepresent your experience.</li>
      </ul>
      <p>
        We may remove or restrict content that violates these Terms or that we
        reasonably believe is harmful, misleading, or abusive.
      </p>

      <h2>5. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the service for any unlawful purpose;</li>
        <li>Scrape, reverse engineer, or overload our systems without permission;</li>
        <li>Impersonate others or submit fraudulent reviews;</li>
        <li>Interfere with security features or other users&apos; use of the service;</li>
        <li>Access admin or business reporting areas without authorization.</li>
      </ul>

      <h2>6. Business features and analytics</h2>
      <p>
        Business owners may receive aggregated insights derived from user
        reviews. Individual reviewer identities are not shared with businesses
        except as displayed publicly on the platform according to our product
        design and Privacy Policy.
      </p>

      <h2>7. Payments and subscriptions</h2>
      <p>
        Rate My Popup may offer free and paid features. If paid plans are
        introduced, pricing, billing cycles, and refund terms will be presented
        at checkout or in a separate order form. Unless otherwise stated, fees
        are non-refundable except where required by law. We may change pricing
        with reasonable notice for future billing periods.
      </p>
      <p>
        At present, core consumer review features may be available at no charge.
        Nothing in these Terms obligates us to maintain any particular pricing
        model.
      </p>

      <h2>8. Intellectual property</h2>
      <p>
        RateMyPopUp, including its name, logo, software, design, and
        documentation, is owned by {LEGAL_COMPANY_NAME} or its licensors and is
        protected by intellectual property laws. These Terms do not grant you
        any rights to our branding or technology except the limited right to use
        the service as intended.
      </p>

      <h2>9. Termination</h2>
      <p>
        You may stop using the service at any time. We may suspend or terminate
        your access, with or without notice, if you breach these Terms, if
        required by law, or if we discontinue the service. Upon termination,
        provisions that by their nature should survive (including disclaimers,
        limitations of liability, and governing law) will remain in effect.
      </p>

      <h2>10. Disclaimers</h2>
      <p>
        THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
        AVAILABLE.&rdquo; TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM
        ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS
        FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT GUARANTEE
        THAT REVIEWS ARE ACCURATE, COMPLETE, OR REFLECT EVERY USER EXPERIENCE.
      </p>

      <h2>11. Limitation of liability</h2>
      <p>
        TO THE FULLEST EXTENT PERMITTED BY LAW, {LEGAL_COMPANY_NAME} AND ITS
        OFFICERS, DIRECTORS, EMPLOYEES, AND SUPPLIERS WILL NOT BE LIABLE FOR
        ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
        OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE
        SERVICE.
      </p>
      <p>
        OUR TOTAL LIABILITY FOR ANY CLAIM RELATING TO THE SERVICE WILL NOT
        EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US IN THE TWELVE (12)
        MONTHS BEFORE THE CLAIM, OR (B) ONE HUNDRED U.S. DOLLARS (USD $100).
        SOME JURISDICTIONS DO NOT ALLOW CERTAIN LIMITATIONS; IN THOSE CASES, OUR
        LIABILITY IS LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW.
      </p>

      <h2>12. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless {LEGAL_COMPANY_NAME} from claims,
        damages, losses, and expenses (including reasonable legal fees) arising
        from your content, your use of the service, or your violation of these
        Terms or applicable law.
      </p>

      <h2>13. Governing law</h2>
      <p>
        These Terms are governed by the laws of the jurisdiction in which{' '}
        {LEGAL_COMPANY_NAME} is registered and operates, without regard to
        conflict-of-law principles. Courts in that jurisdiction will have
        exclusive venue for disputes, except where mandatory consumer protection
        laws in your country require otherwise.
      </p>

      <h2>14. Changes to these Terms</h2>
      <p>
        We may modify these Terms from time to time. The &ldquo;Last
        updated&rdquo; date indicates the latest version. Material changes will
        be posted on this page. Continued use after changes become effective
        constitutes acceptance of the revised Terms.
      </p>

      <h2>15. Contact</h2>
      <p>
        {LEGAL_COMPANY_NAME}
        <br />
        Email:{' '}
        <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>
      </p>
    </LegalPageLayout>
  )
}
