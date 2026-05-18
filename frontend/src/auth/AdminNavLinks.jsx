import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'
import { isAdminUser } from './admin.js'
import { IconBuilding, IconChartBars, IconTrendUp } from '../components/Icons.jsx'

/**
 * Admin-only navigation entries (dashboard + full report).
 * Security: links are harmless; routes remain guarded by <RequireAdmin />.
 */
export function AdminNavLinks() {
  const { user, loading } = useAuth()
  if (loading || !isAdminUser(user)) return null

  return (
    <>
      <li>
        <Link to="/dashboard" className="nav-link">
          <IconChartBars className="nav-icon" aria-hidden />
          <span className="nav-link__text">Dashboard</span>
        </Link>
      </li>
      <li>
        <Link to="/admin" className="nav-link">
          <IconTrendUp className="nav-icon" aria-hidden />
          <span className="nav-link__text">Admin</span>
        </Link>
      </li>
    </>
  )
}
