import { useLocation } from 'react-router-dom'
import { isAdminUser } from './admin.js'
import { useAuth } from './AuthContext.jsx'
import { GoogleSignInButton } from './GoogleSignInButton.jsx'
import './auth.css'

/**
 * Guard for admin-only pages.
 *
 * Security:
 * - This blocks UI access in the client.
 * - Sensitive reads should still be enforced in Supabase (RLS/RPC checks).
 */
export function RequireAdmin({
  children,
  title = 'Admin access only',
  description = 'Sign in with the RateMyPopUp admin account to continue.',
}) {
  const { isAuthenticated, loading, user } = useAuth()
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
          <p className="auth-gate__desc">{description}</p>
          <GoogleSignInButton returnTo={returnTo} />
        </div>
      </div>
    )
  }

  if (!isAdminUser(user)) {
    return (
      <div className="auth-gate">
        <div className="auth-gate__card">
          <h1 className="auth-gate__title">Not authorized</h1>
          <p className="auth-gate__desc">
            This page is restricted to the RateMyPopUp admin account.
          </p>
          <p className="auth-gate__legal">
            Signed in as: <strong>{user?.email || 'unknown user'}</strong>
          </p>
        </div>
      </div>
    )
  }

  return children
}
