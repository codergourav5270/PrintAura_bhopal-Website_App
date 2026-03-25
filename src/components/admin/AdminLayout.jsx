import {
  Bell,
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  Tag,
  Ticket,
  Users,
  Wallet,
} from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { supabase } from '../../lib/supabase'

const nav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, emoji: '📊' },
  { to: '/admin/products', label: 'Products', icon: ShoppingBag, emoji: '🖼️' },
  { to: '/admin/orders', label: 'Orders', icon: Package, emoji: '📦' },
  { to: '/admin/customers', label: 'Customers', icon: Users, emoji: '👥' },
  { to: '/admin/payments', label: 'Payments', icon: Wallet, emoji: '💳' },
  { to: '/admin/coupons', label: 'Coupons', icon: Ticket, emoji: '🎟️' },
  { to: '/admin/settings', label: 'Settings', icon: Settings, emoji: '⚙️' },
]

export function AdminLayout({ title, children }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const logout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const linkClass = ({ isActive }) =>
    `flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-sm ${
      isActive
        ? 'bg-accent/15 font-medium text-accent'
        : 'text-[#aaaaaa] hover:bg-white/5 hover:text-white'
    }`

  const NavItems = () => (
    <>
      {nav.map(({ to, label, icon: Icon, emoji }) => (
        <NavLink
          key={to}
          to={to}
          onClick={() => setSidebarOpen(false)}
          className={linkClass}
        >
          <span className="hidden w-6 text-center sm:inline">{emoji}</span>
          <Icon className="h-5 w-5 sm:hidden" />
          <span className="sm:pl-0">{label}</span>
        </NavLink>
      ))}
    </>
  )

  return (
    <div className="min-h-screen bg-bg text-white">
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-56 flex-col border-r border-border bg-adminSidebar lg:flex">
        <div className="flex items-center gap-2 border-b border-border p-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm font-black text-black">
            P
          </span>
          <div>
            <p className="text-xs font-semibold text-white">PrintAura_bhopal</p>
            <span className="rounded bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent">
              Admin
            </span>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          <NavItems />
        </nav>
        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={logout}
            className="flex w-full min-h-[44px] items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-400 hover:bg-red-950/40"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-adminSidebar px-3 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-white"
          aria-label="Open sidebar"
        >
          <LayoutDashboard className="h-6 w-6" />
        </button>
        <Link to="/admin/dashboard" className="font-semibold">
          Admin
        </Link>
        <span className="w-10" />
      </header>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Close"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col bg-adminSidebar shadow-2xl">
            <div className="flex items-center justify-between border-b border-border p-4">
              <span className="font-semibold">Menu</span>
              <button type="button" onClick={() => setSidebarOpen(false)}>
                <ChevronLeft className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto p-3">
              <NavItems />
            </nav>
            <div className="border-t border-border p-3">
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-2 text-red-400"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="lg:pl-56">
        <div className="sticky top-0 z-20 hidden items-center justify-between border-b border-border bg-bg/95 px-6 py-4 backdrop-blur lg:flex">
          <h1 className="text-lg font-semibold text-white">{title}</h1>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border text-[#aaaaaa]"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-accent" />
            </button>
            <div className="text-right text-sm">
              <p className="text-[#aaaaaa]">Signed in</p>
              <p className="max-w-[12rem] truncate font-medium text-white">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        <main className="p-4 pb-24 lg:p-6 lg:pb-6">{children}</main>
      </div>

      {/* Bottom nav mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-border bg-adminSidebar px-2 py-2 lg:hidden">
        {nav.slice(0, 4).map(({ to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-h-[48px] min-w-[48px] flex-col items-center justify-center rounded-lg text-[10px] ${
                isActive ? 'text-accent' : 'text-[#666]'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span className="mt-0.5 max-w-[4rem] truncate">
              {to.replace('/admin/', '')}
            </span>
          </NavLink>
        ))}
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `flex min-h-[48px] min-w-[48px] flex-col items-center justify-center rounded-lg text-[10px] ${
              isActive ? 'text-accent' : 'text-[#666]'
            }`
          }
        >
          <Settings className="h-5 w-5" />
          <span className="mt-0.5">more</span>
        </NavLink>
      </nav>
    </div>
  )
}
