import { Link, Route, Routes } from 'react-router-dom'
import bannerLogoImg from './assets/ratemypopup.png'
import { AdminNavLinks } from './auth/AdminNavLinks.jsx'
import { AuthMenu } from './auth/AuthMenu.jsx'
import { RequireAuth } from './auth/RequireAuth.jsx'
import { RequireAdmin } from './auth/RequireAdmin.jsx'
import { IconBuilding, IconSearch, IconStarOutline } from './components/Icons.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'
import TermsPage from './pages/TermsPage.jsx'
import CookiesPage from './pages/CookiesPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import BusinessPage from './pages/BusinessPage.jsx'
import CompanyPage from './pages/CompanyPage.jsx'
import ExplorePage from './pages/ExplorePage.jsx'
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
                  <Link to="/explore" className="nav-link">
                    <IconSearch className="nav-icon" aria-hidden />
                    <span className="nav-link__text">Explore</span>
                  </Link>
                </li>
                <li>
                  <Link to="/review" className="nav-link">
                    <IconStarOutline className="nav-icon" aria-hidden />
                    <span className="nav-link__text">Review</span>
                  </Link>
                </li>
                <li className="nav-item--business">
                  <Link to="/business" className="nav-link">
                    <IconBuilding className="nav-icon" aria-hidden />
                    <span className="nav-link__text">For Business</span>
                  </Link>
                </li>
                <AdminNavLinks />
              </ul>
            </nav>
            <AuthMenu />
          </div>
        </div>
      </header>

      <main id="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/companies/:companyId" element={<CompanyPage />} />
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
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin
                title="Admin sign-in required"
                description="Use the RateMyPopUp admin account to access reporting and PDF export."
              >
                <AdminPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireAdmin
                title="Admin sign-in required"
                description="Use the RateMyPopUp admin account to access the site dashboard."
              >
                <DashboardPage />
              </RequireAdmin>
            }
          />
        </Routes>
      </main>

      <footer className="site-footer">
        <nav className="footer-legal" aria-label="Legal">
          <Link to="/privacy" className="footer-legal__link">
            Privacy
          </Link>
          <Link to="/terms" className="footer-legal__link">
            Terms
          </Link>
          <Link to="/cookies" className="footer-legal__link">
            Cookies
          </Link>
        </nav>
        <p className="footer-copy">© {new Date().getFullYear()} RateMyPopUp</p>
      </footer>
    </div>
  )
}
