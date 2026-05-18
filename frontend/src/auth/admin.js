/**
 * Single source of truth for admin identity checks.
 *
 * Security note:
 * - UI gating alone is not sufficient for data protection. Use server-side
 *   checks (RLS / RPC auth checks) for true enforcement.
 */
export const ADMIN_ACCOUNT_ID = 'f575a55b-cc80-4082-9b36-8677836d0a49'
export const ADMIN_EMAIL = 'ratemypopup@gmail.com'

export function isAdminUser(user) {
  if (!user) return false
  const byId = String(user.id || '').toLowerCase() === ADMIN_ACCOUNT_ID
  const byEmail =
    String(user.email || '')
      .trim()
      .toLowerCase() === ADMIN_EMAIL
  return byId || byEmail
}
