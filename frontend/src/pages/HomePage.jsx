import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import collageTwoImg from '../assets/collage2.png'
import homeBannerImg from '../assets/homebanner.png'
import { IconSearch, IconStarFilled } from '../components/Icons.jsx'
import { BrowseLiveSections } from '../components/BrowseLiveSections.jsx'
import { LeaderboardSection } from '../components/LeaderboardSection.jsx'
import './HomePage.css'

/**
 * Landing page: hero, browse/live sections, community stats.
 */
export default function HomePage() {
  const location = useLocation()
  const [activeSlide, setActiveSlide] = useState(0)
  const bannerSlides = useMemo(
    () => [
      {
        id: 'home-banner',
        src: homeBannerImg,
        alt: 'Pop-up storefront collage banner',
        width: 1167,
        height: 507,
      },
      {
        id: 'home-collage-2',
        src: collageTwoImg,
        alt: 'Second pop-up collage banner with branded activations',
        width: 1167,
        height: 507,
      },
    ],
    []
  )

  useEffect(() => {
    const raw = location.hash.replace(/^#/, '')
    if (!raw) return
    const el = document.getElementById(raw)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [location])

  useEffect(() => {
    if (bannerSlides.length < 2) return undefined
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % bannerSlides.length)
    }, 4500)
    return () => window.clearInterval(intervalId)
  }, [bannerSlides.length])

  return (
    <div className="home-page">
      <div id="top" className="home-banner">
        {bannerSlides.map((slide, index) => (
          <img
            key={slide.id}
            src={slide.src}
            alt={slide.alt}
            className={`home-banner__img ${index === activeSlide ? 'is-active' : ''}`}
            width={slide.width}
            height={slide.height}
            decoding="async"
            fetchPriority={index === 0 ? 'high' : 'auto'}
            aria-hidden={index !== activeSlide}
          />
        ))}
        <div className="home-banner__controls" aria-label="Banner slideshow controls">
          {bannerSlides.map((slide, index) => (
            <button
              key={`${slide.id}-dot`}
              type="button"
              className={`home-banner__dot ${index === activeSlide ? 'is-active' : ''}`}
              aria-label={`Show banner ${index + 1}`}
              aria-pressed={index === activeSlide}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>
      </div>

      <section className="hero" aria-label="Home">
        <div className="hero__inner">
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
        </div>
      </section>

      <BrowseLiveSections />

      <LeaderboardSection />

      <section id="stats" className="stats" aria-label="Community stats">
        <div className="stats__inner">
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
        </div>
      </section>
    </div>
  )
}
