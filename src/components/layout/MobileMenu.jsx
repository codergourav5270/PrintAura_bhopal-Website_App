import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CATEGORIES, categoryToSlug } from '../../lib/supabase'

const links = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/custom-poster', label: 'Custom Poster' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/bulk', label: 'Bulk Orders' },
  { to: '/wishlist', label: 'Wishlist' },
]

export function MobileMenu({ open, onClose }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[80] lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="Close menu"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <span className="font-semibold text-white">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-[#aaaaaa] hover:bg-white/5"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={onClose}
                  className="flex min-h-[44px] items-center rounded-lg px-3 py-2 text-[#aaaaaa] hover:bg-white/5 hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-[#666]">
            Categories
          </p>
          <ul className="mt-2 space-y-1">
            {CATEGORIES.slice(0, 8).map((c) => (
              <li key={c}>
                <Link
                  to={`/category/${categoryToSlug(c)}`}
                  onClick={onClose}
                  className="flex min-h-[44px] items-center rounded-lg px-3 py-2 text-sm text-[#aaaaaa] hover:bg-white/5 hover:text-white"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
