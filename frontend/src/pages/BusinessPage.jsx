import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  IconBuilding,
  IconChartBars,
  IconSearch,
  IconStarOutline,
} from '../components/Icons.jsx'
import './BusinessPage.css'

const FEATURES = [
  {
    id: 'feedback',
    title: 'Feedback Reports',
    body: "See what percentage loved your goodie bag and what they'd want improved.",
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
 * Business landing: claim a company profile and preview insights (search is client-only until API exists).
 */
export default function BusinessPage() {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const prev = document.title
    document.title = 'For Business — RateMyPopUp'
    return () => {
      document.title = prev
    }
  }, [])

  const onSearch = useCallback((e) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    // Placeholder: wire to company search / claim flow when backend is ready
  }, [query])

  return (
    <div className="business-page">
      <div className="business-page__inner">
        <Link to="/" className="business-page__back">
          ← Back to home
        </Link>

        <header className="business-hero">
          <div className="business-hero__icon-wrap" aria-hidden>
            <IconBuilding className="business-hero__icon" ariaHidden />
          </div>
          <h1 className="business-hero__title">Claim Your Company</h1>
          <p className="business-hero__lead">
            Get insights into what attendees really think. Improve your pop-up game.
          </p>
        </header>

        <form className="business-search" onSubmit={onSearch} noValidate>
          <label className="sr-only" htmlFor="business-company-search">
            Search for your company
          </label>
          <div className="business-search__row">
            <div className="business-search__input-wrap">
              <IconSearch className="business-search__icon" ariaHidden />
              <input
                id="business-company-search"
                name="company"
                type="search"
                className="business-search__input"
                placeholder="Search your company..."
                autoComplete="organization"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="business-search__submit">
              Search
            </button>
          </div>
        </form>

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
      </div>
    </div>
  )
}
