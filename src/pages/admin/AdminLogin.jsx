import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { ADMIN_EMAIL, supabase } from '../../lib/supabase'

export default function AdminLogin() {
  const { session, loading, user } = useAuth()
  const location = useLocation()
  const from = location.state?.from || '/admin/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!loading && session && user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return <Navigate to={from} replace />
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    if (err) {
      setBusy(false)
      setError(err.message)
      return
    }
    const em = data.user?.email?.toLowerCase() || ''
    if (em !== ADMIN_EMAIL.toLowerCase()) {
      await supabase.auth.signOut()
      setBusy(false)
      setError('This account is not authorized for admin access.')
      return
    }
    setBusy(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-[#111] p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-xl font-black text-black">
            P
          </span>
          <h1 className="mt-4 text-xl font-bold text-white">Admin Panel</h1>
          <p className="mt-1 text-sm text-[#aaaaaa]">Poster Galaxy operations</p>
        </div>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-xs text-[#aaaaaa]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-white outline-none focus:border-accent"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-xs text-[#aaaaaa]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-white outline-none focus:border-accent"
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full min-h-[48px] rounded-xl bg-accent font-semibold text-black hover:bg-[#e6b800] disabled:opacity-50"
          >
            {busy ? 'Signing in…' : 'Login'}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-[#666]">
          <Link to="/" className="text-accent hover:underline">
            ← Back to store
          </Link>
        </p>
      </div>
    </div>
  )
}
