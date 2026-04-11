import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logoImg from '../assets/ratemypopup.png'
import { IconSearch, IconStarFilled } from '../components/Icons.jsx'
import { BrowseLiveSections } from '../components/BrowseLiveSections.jsx'

/**
 * Landing page: hero, browse/live sections, community stats.
 */
export default function HomePage() {
  const location = useLocation()

  useEffect(() => {
    const raw = location.hash.replace(/^#/, '')
    if (!raw) return
    const el = document.getElementById(raw)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [location])

  return (
    <>
      <section id="top" className="hero" aria-label="Home">
        <div className="hero-logo-wrap">
          <img
            src={logoImg}
            alt="RateMyPopUp — Discover, rate, and review pop-up beauty events"
            className="hero-logo"
            width={500}
            height={500}
            decoding="async"
          />
        </div>

        <p className="hero-description">
          The #1 platform to find pop-up events, rate goodie bags, and share
          your haul with the community.
        </p>

        <div className="hero-ctas">
          <Link to="/review" className="btn btn-primary">
            <IconStarFilled className="btn-icon" ariaHidden />
            Rate a Pop-Up
          </Link>
          <a href="/#section-explore" className="btn btn-secondary">
            <IconSearch className="btn-icon" ariaHidden />
            Explore
          </a>
        </div>
      </section>

      <BrowseLiveSections />

      <section id="stats" className="stats" aria-label="Community stats">
        <div className="stat">
          <span className="stat-value text-brand">2,847</span>
          <span className="stat-label">Reviews</span>
        </div>
        <div className="stat">
          <span className="stat-value text-brand">312</span>
          <span className="stat-label">Pop-Ups</span>
        </div>
        <div className="stat">
          <span className="stat-value text-brand">18k</span>
          <span className="stat-label">Users</span>
        </div>
      </section>
    </>
  )
}
