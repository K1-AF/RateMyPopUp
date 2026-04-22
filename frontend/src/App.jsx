import { Link, Route, Routes } from 'react-router-dom'
import bannerLogoImg from './assets/ratemypopup.png'
import { AuthMenu } from './auth/AuthMenu.jsx'
import { RequireAuth } from './auth/RequireAuth.jsx'
import { IconBuilding, IconSearch, IconStarOutline } from './components/Icons.jsx'
import BusinessPage from './pages/BusinessPage.jsx'
import HomePage from './pages/HomePage.jsx'
import ReviewPage from './pages/ReviewPage.jsx'
import './App.css'

export default function App() {
  return (
    <div className="landing">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="site-header" role="banner">
        <div className="header-inner">
          <div className="header-col header-col--left">
            <Link to="/" className="brand" aria-label="Home">
              <img
                src={bannerLogoImg}
                alt=""
                className="brand-logo"
                width={1037}
                height={197}
                decoding="async"
              />
            </Link>
          </div>

          <div className="header-col header-col--right">
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
                  <Link to="/business" className="nav-link">
                    <IconBuilding className="nav-icon" />
                    For Business
                  </Link>
                </li>
              </ul>
            </nav>
            <AuthMenu />
          </div>
        </div>
      </header>

      <main id="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/review"
            element={
              <RequireAuth
                title="Sign in to write a review"
                description="We use your Google account to verify reviewers and prevent spam. You'll be returned here once you sign in."
              >
                <ReviewPage />
              </RequireAuth>
            }
          />
          <Route path="/business" element={<BusinessPage />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <p className="footer-copy">© {new Date().getFullYear()} RateMyPopUp</p>
      </footer>
    </div>
  )
}
