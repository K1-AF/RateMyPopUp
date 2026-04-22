import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { supabase } from '../utils/supabase.js'

/**
 * Auth context: exposes Supabase session/user plus sign-in/out helpers.
 *
 * Security notes:
 * - Sessions are stored by supabase-js in localStorage with auto refresh.
 * - We never accept user-supplied OAuth providers; only 'google' is wired up.
 * - `redirectTo` is locked to the current origin so OAuth cannot be hijacked
 *   to send the user to an attacker-controlled URL.
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    supabase.auth.getSession().then(({ data, error }) => {
      if (cancelled) return
      if (error) {
        console.error('[auth] getSession failed:', error.message)
      }
      setSession(data?.session ?? null)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null)
    })

    return () => {
      cancelled = true
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  const signInWithGoogle = useCallback(async (returnTo) => {
    /*
     * Build a redirect URL that always points back to *this* app.
     * Using a relative path resolved against window.location.origin prevents
     * an open-redirect: even if a caller passes a full external URL, we drop
     * everything but the path/query/hash.
     */
    let safePath = '/'
    if (typeof returnTo === 'string' && returnTo.length > 0) {
      try {
        const parsed = new URL(returnTo, window.location.origin)
        safePath = parsed.pathname + parsed.search + parsed.hash
      } catch {
        safePath = '/'
      }
    }
    const redirectTo = window.location.origin + safePath

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
    if (error) {
      console.error('[auth] Google sign-in failed:', error.message)
      throw error
    }
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('[auth] sign-out failed:', error.message)
      throw error
    }
  }, [])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session?.user),
      loading,
      signInWithGoogle,
      signOut,
    }),
    [session, loading, signInWithGoogle, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return ctx
}
