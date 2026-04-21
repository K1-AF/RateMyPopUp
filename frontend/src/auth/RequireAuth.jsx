import { useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'
import { GoogleSignInButton } from './GoogleSignInButton.jsx'
import './auth.css'

/**
 * Route guard: renders children if the user is signed in, otherwise shows a
 * Google sign-in prompt. After OAuth completes Supabase will redirect back
 * to the current path, so the gated content appears automatically.
 */
export function RequireAuth({ children, title = 'Sign in to continue', description }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="auth-gate" role="status" aria-live="polite">
        <div className="auth-gate__card">
          <p className="auth-gate__loading">Checking your session…</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    const returnTo = location.pathname + location.search + location.hash
    return (
      <div className="auth-gate">
        <div className="auth-gate__card">
          <h1 className="auth-gate__title">{title}</h1>
          {description && <p className="auth-gate__desc">{description}</p>}
          <GoogleSignInButton returnTo={returnTo} />
          <p className="auth-gate__legal">
            By continuing you agree to our community guidelines. We only request
            basic profile info from Google.
          </p>
        </div>
      </div>
    )
  }

  return children
}
