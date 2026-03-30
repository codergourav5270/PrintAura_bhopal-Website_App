import { Heart, Menu, Search, ShoppingBag } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext.jsx'
import { CATEGORIES, categoryToSlug } from '../../lib/supabase'
import { MobileMenu } from './MobileMenu.jsx'
import { fetchSiteSettings } from '../../lib/siteSettings'

export function Navbar() {
  const { cartCount } = useCart()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const [siteName, setSiteName] = useState('PrintAura_bhopal')
useEffect(() => {
  fetchSiteSettings().then((s) => s?.website_name && setSiteName(s.website_name))
}, [])

  const onSearch = (e) => {
    e.preventDefault()
    const term = q.trim()
    if (term) nav(`/shop?q=${encodeURIComponent(term)}`)
    else nav('/shop')
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-lg text-white lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-bold tracking-tight text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-base font-black text-black">
                P
              </span>
              <span className="hidden sm:inline">{siteName}</span>
            </Link>
          </div>

          <nav className="hidden items-center gap-6 lg:flex">
            <Link
              to="/shop"
              className="text-sm text-[#aaaaaa] hover:text-white"
            >
              Shop
            </Link>
            <div className="group relative">
              <button
                type="button"
                className="flex items-center gap-1 text-sm text-[#aaaaaa] hover:text-white"
              >
                Categories
              </button>
              <div className="invisible absolute left-0 top-full z-50 mt-2 w-52 rounded-xl border border-border bg-card py-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                {CATEGORIES.slice(0, 8).map((c) => (
                  <Link
                    key={c}
                    to={`/category/${categoryToSlug(c)}`}
                    className="block px-4 py-2 text-sm text-[#aaaaaa] hover:bg-white/5 hover:text-white"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              to="/custom-poster"
              className="text-sm text-[#aaaaaa] hover:text-white"
            >
              Custom
            </Link>
            <Link
              to="/bulk"
              className="text-sm text-[#aaaaaa] hover:text-white"
            >
              Bulk
            </Link>
          </nav>

          <form
            onSubmit={onSearch}
            className="hidden max-w-xs flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 md:flex"
          >
            <Search className="h-4 w-4 shrink-0 text-[#666]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search posters..."
              className="min-h-[44px] w-full bg-transparent py-2 text-sm text-white outline-none placeholder:text-[#666]"
            />
          </form>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/wishlist"
              className="flex h-11 w-11 items-center justify-center rounded-lg text-[#aaaaaa] hover:bg-white/5 hover:text-white"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>
            <Link
              to="/cart"
              className="relative flex h-11 w-11 items-center justify-center rounded-lg text-[#aaaaaa] hover:bg-white/5 hover:text-white"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-black">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
        <form
          onSubmit={onSearch}
          className="mx-auto flex max-w-7xl items-center gap-2 border-t border-border px-4 py-2 md:hidden"
        >
          <Search className="h-4 w-4 shrink-0 text-[#666]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search..."
            className="min-h-[44px] w-full bg-transparent text-sm text-white outline-none placeholder:text-[#666]"
          />
        </form>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  )
}
