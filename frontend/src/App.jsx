import { useCallback, useEffect, useRef, useState } from 'react'
import logoImg from './assets/ratemypopup.png'
import {
  IconBuilding,
  IconSearch,
  IconStarFilled,
  IconStarOutline,
} from './components/Icons.jsx'
import { BrowseLiveSections } from './components/BrowseLiveSections.jsx'
import './App.css'

/**
 * Smooth-scroll to a section by id — used by nav and CTAs.
 */
function scrollToSection(id) {
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function App() {
  const signInRef = useRef(null)
  const [signInOpen, setSignInOpen] = useState(false)

  const openSignIn = useCallback(() => {
    setSignInOpen(true)
    signInRef.current?.showModal()
  }, [])

  const closeSignIn = useCallback(() => {
    signInRef.current?.close()
    setSignInOpen(false)
  }, [])

  // Sync state if dialog closed via Escape
  useEffect(() => {
    const dlg = signInRef.current
    if (!dlg) return
    const onClose = () => setSignInOpen(false)
    dlg.addEventListener('close', onClose)
    return () => dlg.removeEventListener('close', onClose)
  }, [])

  return (
    <div className="landing">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="site-header" role="banner">
        <div className="header-inner">
          <a
            href="#top"
            className="brand"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection('top')
            }}
          >
            <img
              src={logoImg}
              alt=""
              className="brand-logo"
              width={72}
              height={72}
              decoding="async"
            />
          </a>

          <nav className="site-nav" aria-label="Primary">
            <ul className="nav-list">
              <li>
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => scrollToSection('section-explore')}
                >
                  <IconSearch className="nav-icon" />
                  Explore
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => scrollToSection('live-now')}
                >
                  <IconStarOutline className="nav-icon" />
                  Review
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => scrollToSection('stats')}
                >
                  <IconBuilding className="nav-icon" />
                  For Business
                </button>
              </li>
            </ul>
            <button type="button" className="btn-sign-in" onClick={openSignIn}>
              Sign In
            </button>
          </nav>
        </div>
      </header>

      <main id="main-content">
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
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => scrollToSection('live-now')}
            >
              <IconStarFilled className="btn-icon" ariaHidden />
              Rate a Pop-Up
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => scrollToSection('section-explore')}
            >
              <IconSearch className="btn-icon" ariaHidden />
              Explore
            </button>
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
      </main>

      <footer className="site-footer">
        <p className="footer-copy">© {new Date().getFullYear()} RateMyPopUp</p>
      </footer>

      {/* Sign-in placeholder — wire to real auth when backend is ready */}
      <dialog
        ref={signInRef}
        className="sign-in-dialog"
        aria-labelledby="sign-in-title"
        onClick={(e) => {
          if (e.target === signInRef.current) closeSignIn()
        }}
      >
        <div className="dialog-panel" onClick={(e) => e.stopPropagation()}>
          <h2 id="sign-in-title">Sign in</h2>
          <p className="dialog-lead">
            Account sign-in will connect to our API when authentication is
            enabled.
          </p>
          <form
            className="sign-in-form"
            onSubmit={(e) => {
              e.preventDefault()
              closeSignIn()
            }}
            noValidate
          >
            <label htmlFor="signin-email">Email</label>
            <input
              id="signin-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="dialog-input"
            />
            <label htmlFor="signin-password">Password</label>
            <input
              id="signin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="dialog-input"
            />
            <div className="dialog-actions">
              <button type="button" className="btn btn-ghost" onClick={closeSignIn}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Continue
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* aria-live for dialog open state — helps assistive tech */}
      <span className="sr-only" aria-live="polite">
        {signInOpen ? 'Sign in dialog opened' : ''}
      </span>
    </div>
  )
}
