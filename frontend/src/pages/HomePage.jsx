import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import collageTwoImg from '../assets/collage2.png'
import homeBannerImg from '../assets/homebanner.png'
import { IconSearch, IconStarFilled } from '../components/Icons.jsx'
import { BrowseLiveSections } from '../components/BrowseLiveSections.jsx'
import { CommunityStats } from '../components/CommunityStats.jsx'
import { LeaderboardSection } from '../components/LeaderboardSection.jsx'
import { RecentReviewsCarousel } from '../components/RecentReviewsCarousel.jsx'
import './HomePage.css'

/**
 * Landing page: hero, browse/live sections, community stats.
 */
export default function HomePage() {
  const location = useLocation()
  const [activeSlide, setActiveSlide] = useState(0)
  const [hoverTooltip, setHoverTooltip] = useState({
    visible: false,
    text: '',
    x: 0,
    y: 0,
  })
  const bannerSlides = useMemo(
    () => [
      {
        id: 'home-banner',
        src: homeBannerImg,
        alt: 'Pop-up storefront collage banner',
        width: 1167,
        height: 507,
        hotspots: [
          {
            id: 'pureseoul-dinto',
            left: '13%',
            top: '52%',
            width: '16%',
            height: '70%',
            text: '📍Pureseoul x Dinto',
          },
          {
            id: 'charlotte-tilbury-pillowtalk',
            left: '27%',
            top: '44%',
            width: '12%',
            height: '78%',
            text: '📍Charlotte Tilbury Pillowtalk in Bloom',
          },
          {
            id: 'ilia-space-nk',
            left: '40.5%',
            top: '52%',
            width: '18%',
            height: '70%',
            text: '📍ILIA Beauty x Space NK',
          },
          {
            id: 'prada-picnic',
            left: '54%',
            top: '44%',
            width: '12%',
            height: '78%',
            text: '📍The Prada Picnic',
          },
          {
            id: 'laneige-boots-juice-pop',
            left: '68.5%',
            top: '52%',
            width: '19%',
            height: '70%',
            text: '📍Laneige X Boots | The Juice Pop Party',
          },
          {
            id: 'ordinary-immersive',
            left: '84%',
            top: '44%',
            width: '12%',
            height: '78%',
            text: '📍The Ordinary Immersive Experience',
          },
        ],
      },
      {
        id: 'home-collage-2',
        src: collageTwoImg,
        alt: 'Second pop-up collage banner with branded activations',
        width: 1167,
        height: 507,
        hotspots: [
          {
            id: 'kayali-experience',
            left: '9%',
            top: '52%',
            width: '14%',
            height: '72%',
            text: '📍KAYALI The Experience',
          },
          {
            id: 'dr-althea-moida',
            left: '23.5%',
            top: '50%',
            width: '13%',
            height: '72%',
            text: '📍Dr Althea x MOIDA',
          },
          {
            id: 'coca-cola-cherry-coke',
            left: '38.5%',
            top: '52%',
            width: '14%',
            height: '72%',
            text: '📍Coca-Cola Cherry Coke Cafe',
          },
          {
            id: 'loreal-glass-sweet-shop',
            left: '53%',
            top: '50%',
            width: '14%',
            height: '72%',
            text: "📍L'Oréal The Glass Sweet Shop",
          },
          {
            id: 'edikted-london-tour',
            left: '68%',
            top: '52%',
            width: '14%',
            height: '72%',
            text: '📍Edikted London Tour',
          },
          {
            id: 'lush-wellness-lounge',
            left: '83%',
            top: '52%',
            width: '14%',
            height: '72%',
            text: '📍Lush Wellness Lounge',
          },
        ],
      },
    ],
    []
  )

  const activeHotspots = bannerSlides[activeSlide]?.hotspots ?? []

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
    }, 7500)
    return () => window.clearInterval(intervalId)
  }, [bannerSlides.length])

  useEffect(() => {
    setHoverTooltip((current) =>
      current.visible ? { visible: false, text: '', x: 0, y: 0 } : current
    )
  }, [activeSlide])

  const handleHotspotMove = (event, text) => {
    const banner = event.currentTarget.closest('.home-banner')
    if (!banner) return
    const rect = banner.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    setHoverTooltip({ visible: true, text, x, y })
  }

  const handleHotspotLeave = () => {
    setHoverTooltip({ visible: false, text: '', x: 0, y: 0 })
  }

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
        {activeHotspots.length > 0 && (
          <div className="home-banner__hotspots" aria-hidden={false}>
            {activeHotspots.map((spot) => (
              <button
                key={spot.id}
                type="button"
                className="home-banner__hotspot"
                style={{
                  left: spot.left,
                  top: spot.top,
                  width: spot.width,
                  height: spot.height,
                }}
                aria-label={spot.text}
                onMouseEnter={(event) => handleHotspotMove(event, spot.text)}
                onMouseMove={(event) => handleHotspotMove(event, spot.text)}
                onFocus={(event) => handleHotspotMove(event, spot.text)}
                onBlur={handleHotspotLeave}
                onMouseLeave={handleHotspotLeave}
              />
            ))}
          </div>
        )}
        {hoverTooltip.visible && (
          <div
            className="home-banner__tooltip"
            style={{ left: `${hoverTooltip.x + 16}px`, top: `${hoverTooltip.y - 10}px` }}
            role="status"
            aria-live="polite"
          >
            {hoverTooltip.text}
          </div>
        )}
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

      <RecentReviewsCarousel />

      <BrowseLiveSections />

      <LeaderboardSection />

      <CommunityStats />
    </div>
  )
}
