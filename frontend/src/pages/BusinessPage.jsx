import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  IconChartBars,
  IconCommunity,
  IconPeople,
  IconShieldCheck,
  IconStarOutline,
  IconUserCheck,
} from '../components/Icons.jsx'
import './BusinessPage.css'

const FEATURES = [
  {
    id: 'feedback',
    title: 'Feedback Reports',
    body: "See what percentage loved your pop-up and what they'd want improved.",
    icon: IconChartBars,
  },
  {
    id: 'trends',
    title: 'Event Trends',
    body: 'Spot which products or freebies drive the strongest reviews.',
    icon: IconStarOutline,
  },
  {
    id: 'audience',
    title: 'Audience Signals',
    body: 'Know who shows up — and why they keep coming back.',
    icon: IconPeople,
  },
]

const WHY_US = [
  {
    id: 'community',
    title: 'Strong community',
    body: 'A growing network of pop-up lovers who show up, review, and tell friends what’s worth the queue.',
    icon: IconCommunity,
  },
  {
    id: 'authentic',
    title: 'Authentic reviews',
    body: 'Honest ratings on vibe, queue speed, and goodie bags — not polished brand copy or paid posts.',
    icon: IconShieldCheck,
  },
  {
    id: 'real-people',
    title: 'Real people',
    body: 'Every review comes from a verified visitor. No fake accounts, no anonymous spam.',
    icon: IconUserCheck,
  },
]

/**
 * Business landing: contact + benefits preview.
 */
export default function BusinessPage() {
  useEffect(() => {
    const prev = document.title
    document.title = 'For Business — RateMyPopUp'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <div className="business-page">
      <div className="business-page__inner">
        <Link to="/" className="business-page__back">
          ← Back to home
        </Link>

        <header className="business-hero">
          <div className="business-hero__copy">
            <h1 className="business-hero__title">Business owner?</h1>
            <p className="business-hero__lead">
              Track what attendees loved, where the queue lost momentum, and
              what makes you stand out.
            </p>
          </div>

          <div className="business-chart" aria-label="Example pop-up insight chart">
            <div className="business-chart__header">
              <span>Attendee Signals</span>
              <strong>4.7</strong>
            </div>
            <div className="business-chart__bars" aria-hidden>
              <span className="business-chart__bar business-chart__bar--vibe" />
              <span className="business-chart__bar business-chart__bar--queue" />
              <span className="business-chart__bar business-chart__bar--goodie" />
            </div>
            <div className="business-chart__legend" aria-hidden>
              <span>Vibe</span>
              <span>Queue</span>
              <span>Goodie bag</span>
            </div>
          </div>
        </header>

        <section className="business-benefits" aria-labelledby="business-benefits-heading">
          <h2 id="business-benefits-heading" className="business-benefits__title">
            What You Get
          </h2>
          <ul className="business-benefits__list">
            {FEATURES.map(({ id, title, body, icon }) => {
              const IconComponent = icon
              return (
              <li key={id} className="business-card">
                <div className="business-card__icon" aria-hidden>
                  <IconComponent className="business-card__icon-svg" ariaHidden />
                </div>
                <div className="business-card__body">
                  <h3 className="business-card__title">{title}</h3>
                  <p className="business-card__text">{body}</p>
                </div>
              </li>
              )
            })}
          </ul>
        </section>

        <section className="business-why" aria-labelledby="business-why-heading">
          <h2 id="business-why-heading" className="business-benefits__title">
            Why us?
          </h2>
          <ul className="business-benefits__list">
            {WHY_US.map(({ id, title, body, icon }) => {
              const IconComponent = icon
              return (
                <li key={id} className="business-card business-card--why">
                  <div className="business-card__icon business-card__icon--why" aria-hidden>
                    <IconComponent className="business-card__icon-svg" ariaHidden />
                  </div>
                  <div className="business-card__body">
                    <h3 className="business-card__title">{title}</h3>
                    <p className="business-card__text">{body}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        <p className="business-contact">
          Contact us -{' '}
          <a className="business-contact__button" href="mailto:ratemypopup@gmail.com">
            ratemypopup@gmail.com
          </a>
        </p>
      </div>
    </div>
  )
}
