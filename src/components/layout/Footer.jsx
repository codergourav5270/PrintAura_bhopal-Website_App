import { Instagram, Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CATEGORIES, categoryToSlug } from '../../lib/supabase'

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-[#0d0d0d]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-base font-black text-black">
              P
            </span>
            Poster Galaxy
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-[#aaaaaa]">
            Curated wall posters shipped across India. Museum-grade print, secure
            packaging, happiness guaranteed.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Shop</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link to="/shop" className="text-sm text-[#aaaaaa] hover:text-accent">
                All posters
              </Link>
            </li>
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c}>
                <Link
                  to={`/category/${categoryToSlug(c)}`}
                  className="text-sm text-[#aaaaaa] hover:text-accent"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Company</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link to="/about" className="text-sm text-[#aaaaaa] hover:text-accent">
                About us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-sm text-[#aaaaaa] hover:text-accent">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/bulk" className="text-sm text-[#aaaaaa] hover:text-accent">
                Bulk orders
              </Link>
            </li>
            <li>
              <Link
                to="/custom-poster"
                className="text-sm text-[#aaaaaa] hover:text-accent"
              >
                Custom poster
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Connect</p>
          <ul className="mt-3 space-y-3 text-sm text-[#aaaaaa]">
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              hello@postergalaxy.in
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              Mumbai, Maharashtra — India
            </li>
            <li className="flex items-center gap-2">
              <Instagram className="h-4 w-4 text-accent" />
              @postergalaxy
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-[#666]">
        © {new Date().getFullYear()} Poster Galaxy. All rights reserved.
      </div>
    </footer>
  )
}
