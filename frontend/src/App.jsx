import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import logoImg from './assets/ratemypopup.png'
import { IconBuilding, IconSearch, IconStarOutline } from './components/Icons.jsx'
import HomePage from './pages/HomePage.jsx'
import ReviewPage from './pages/ReviewPage.jsx'
import './App.css'

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
          <Link to="/" className="brand">
            <img
              src={logoImg}
              alt=""
              className="brand-logo"
              width={72}
              height={72}
              decoding="async"
            />
          </Link>

          <nav className="site-nav" aria-label="Primary">
            <ul className="nav-list">
              <li>
                <Link
                  to={{ pathname: '/', hash: 'section-explore' }}
                  className="nav-link"
                >
                  <IconSearch className="nav-icon" />
                  Explore
                </Link>
              </li>
              <li>
                <Link to="/review" className="nav-link">
                  <IconStarOutline className="nav-icon" />
                  Review
                </Link>
              </li>
              <li>
                <Link to={{ pathname: '/', hash: 'stats' }} className="nav-link">
                  <IconBuilding className="nav-icon" />
                  For Business
                </Link>
              </li>
            </ul>
            <button type="button" className="btn-sign-in" onClick={openSignIn}>
              Sign In
            </button>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/review" element={<ReviewPage />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <p className="footer-copy">© {new Date().getFullYear()} RateMyPopUp</p>
      </footer>

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

      <span className="sr-only" aria-live="polite">
        {signInOpen ? 'Sign in dialog opened' : ''}
      </span>
    </div>
  )
}
