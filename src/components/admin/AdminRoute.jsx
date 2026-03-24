import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { ADMIN_EMAIL } from '../../lib/supabase'

export function AdminRoute({ children }) {
  const { session, loading, user } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    )
  }

  if (!session) {
    return (
      <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
    )
  }

  const email = (user?.email || '').toLowerCase()
  if (!ADMIN_EMAIL || email !== ADMIN_EMAIL.toLowerCase()) {
    return <Navigate to="/" replace />
  }

  return children
}
