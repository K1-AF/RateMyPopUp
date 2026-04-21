import { useState } from 'react'
import { useAuth } from './AuthContext.jsx'

function GoogleGlyph({ className }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 48 48"
      aria-hidden
    >
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.9 6.3 29.2 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5c10.9 0 19.5-7.9 19.5-19.5 0-1.2-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.6 19 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.9 6.3 29.2 4.5 24 4.5 16.3 4.5 9.7 9 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 43.5c5.1 0 9.7-1.7 13.2-4.7l-6.1-5c-2 1.4-4.4 2.2-7.1 2.2-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.6 39 16.2 43.5 24 43.5z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.7 2-2 3.7-3.7 4.9l6.1 5c-.4.4 6.6-4.8 6.6-13.9 0-1.2-.1-2.3-.4-3.5z"
      />
    </svg>
  )
}

export function GoogleSignInButton({ returnTo, label = 'Continue with Google' }) {
  const { signInWithGoogle } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const handleClick = async () => {
    setBusy(true)
    setError(null)
    try {
      await signInWithGoogle(returnTo)
    } catch (err) {
      setBusy(false)
      setError(err?.message || 'Sign-in failed. Please try again.')
    }
  }

  return (
    <>
      <button
        type="button"
        className="google-signin-btn"
        onClick={handleClick}
        disabled={busy}
        aria-busy={busy}
      >
        <GoogleGlyph className="google-signin-btn__glyph" />
        <span>{busy ? 'Redirecting…' : label}</span>
      </button>
      {error && (
        <p className="google-signin-btn__error" role="alert">
          {error}
        </p>
      )}
    </>
  )
}
