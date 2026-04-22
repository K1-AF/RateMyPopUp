import { useEffect, useRef, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import { GoogleSignInButton } from './GoogleSignInButton.jsx'

function getInitial(user) {
  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    '?'
  return name.trim().charAt(0).toUpperCase() || '?'
}

/**
 * Header widget: shows Google sign-in button when signed out, or a small
 * profile menu (avatar + email + sign out) when signed in.
 */
export function AuthMenu() {
  const { isAuthenticated, user, signOut, loading } = useAuth()
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const handleClick = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false)
    }
    const handleKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  if (loading) {
    return <span className="auth-menu__placeholder" aria-hidden />
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-menu auth-menu--signed-out">
        <GoogleSignInButton label="Sign in" />
      </div>
    )
  }

  const avatarUrl = user?.user_metadata?.avatar_url
  const displayName =
    user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email
  const initial = getInitial(user)

  return (
    <div className="auth-menu" ref={wrapperRef}>
      <button
        type="button"
        className="auth-menu__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${displayName}`}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className="auth-menu__avatar"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="auth-menu__avatar auth-menu__avatar--initial">
            {initial}
          </span>
        )}
      </button>

      {open && (
        <div className="auth-menu__panel" role="menu">
          <div className="auth-menu__panel-header">
            <p className="auth-menu__name">{displayName}</p>
            {user?.email && displayName !== user.email && (
              <p className="auth-menu__email">{user.email}</p>
            )}
          </div>
          <button
            type="button"
            className="auth-menu__signout"
            onClick={async () => {
              setOpen(false)
              try {
                await signOut()
              } catch {
                /* error already logged in context */
              }
            }}
            role="menuitem"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
