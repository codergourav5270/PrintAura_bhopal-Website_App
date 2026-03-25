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
            PrintAura_bhopal
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
          <p className="text-sm font-semibold text-white">Links</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link to="/contact" className="text-sm text-[#aaaaaa] hover:text-accent">
                Contact page
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <p className="text-sm font-semibold text-white">Website Name</p>
          <p className="mt-1 text-sm text-[#aaaaaa]">PrintAura_bhopal</p>

          <p className="mt-6 text-sm font-semibold text-white">Official Email</p>
          <a
            href="mailto:printaura999@gmail.com"
            className="mt-1 block text-sm text-accent hover:underline"
          >
            printaura999@gmail.com
          </a>

          <p className="mt-6 text-sm font-semibold text-white">For Enquiries</p>
          <a
            href="mailto:query999@gmail.com"
            className="mt-1 block text-sm text-accent hover:underline"
          >
            query999@gmail.com
          </a>

          <p className="mt-6 text-sm font-semibold text-white">Help &amp; Support</p>
          <a
            href="mailto:support999@gmail.com"
            className="mt-1 block text-sm text-accent hover:underline"
          >
            support999@gmail.com
          </a>

          <p className="mt-6 text-sm font-semibold text-white">Direct Contact</p>
          <ul className="mt-2 space-y-2 text-sm text-[#aaaaaa]">
            <li>Raman Nathawat — 7869014601</li>
            <li>Ambesh Rajput — 7999830083</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center text-xs text-[#666]">
        © {new Date().getFullYear()} PrintAura_bhopal. All rights reserved.
      </div>

      <div className="border-t border-border bg-[#080808] py-4 text-center">
        <p className="text-[10px] leading-relaxed text-[#555] sm:text-[11px]">
          Website Developed &amp; Managed By Gourav Singh
          <span className="mx-2 text-[#444]">·</span>
          Contact{' '}
          <a href="tel:7380931628" className="text-[#666] hover:text-[#888]">
            7380931628
          </a>
          <span className="mx-2 text-[#444]">·</span>
          Email{' '}
          <a
            href="mailto:gourav5270singh@gmail.com"
            className="text-[#666] hover:text-[#888]"
          >
            gourav5270singh@gmail.com
          </a>
        </p>
      </div>
    </footer>
  )
}
