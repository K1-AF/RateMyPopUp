import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  IconBuilding,
  IconChartBars,
  IconStarOutline,
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
    body: 'Understand who shows up and what keeps them coming back.',
    icon: IconBuilding,
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
            <p className="business-hero__eyebrow">For pop-up operators</p>
            <h1 className="business-hero__title">Business owner?</h1>
            <p className="business-hero__lead">
              Track what attendees loved, where the queue lost momentum, and
              which freebies actually moved the room.
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
