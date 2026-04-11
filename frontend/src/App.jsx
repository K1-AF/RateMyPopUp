import { Link, Route, Routes } from 'react-router-dom'
import logoImg from './assets/ratemypopup.png'
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
                <Link to="/business" className="nav-link">
                  <IconBuilding className="nav-icon" />
                  For Business
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/business" element={<BusinessPage />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <p className="footer-copy">© {new Date().getFullYear()} RateMyPopUp</p>
      </footer>
    </div>
  )
}
