import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, categoryToSlug } from '../../lib/supabase'
import {
  DEFAULT_SITE_SETTINGS,
  fetchSiteSettings,
} from '../../lib/siteSettings.js'

export function Footer() {
  const [site, setSite] = useState(() => ({
    ...DEFAULT_SITE_SETTINGS,
    admin_settings: { ...DEFAULT_SITE_SETTINGS.admin_settings },
  }))

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const s = await fetchSiteSettings()
      if (!cancelled) setSite(s)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const enquiriesEmail = site.admin_settings?.enquiriesEmail
  const helpEmail = site.admin_settings?.helpEmail
  const phones =
    site.admin_settings?.directPhones?.length > 0
      ? site.admin_settings.directPhones
      : String(site.phone || '')
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean)

  return (
    <footer className="mt-20 border-t border-border bg-[#0d0d0d]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-[#7b1c1c]">
          <img src="/logo.jpeg" alt="Logo" style={{ height: '36px', width: '36px', objectFit: 'contain', borderRadius: '8px' }} />
            {site.website_name}
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-[#f5f0e8]">
            Curated wall posters shipped across India. Museum-grade print, secure
            packaging, happiness guaranteed.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#7b1c1c]">Shop</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link to="/shop" className="text-sm text-[#f5f0e8] hover:text-accent">
                All posters
              </Link>
            </li>
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c}>
                <Link to={`/category/${categoryToSlug(c)}`} className="text-sm text-[#f5f0e8] hover:text-accent">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#7b1c1c]">Company</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link to="/about" className="text-sm text-[#f5f0e8] hover:text-accent">
                About us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-sm text-[#f5f0e8] hover:text-accent">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/bulk" className="text-sm text-[#f5f0e8] hover:text-accent">
                Bulk orders
              </Link>
            </li>
            <li>
              <Link to="/custom-poster" className="text-sm text-[#f5f0e8] hover:text-accent">
                Custom poster
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#7b1c1c]">Links</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link to="/contact" className="text-sm text-[#f5f0e8] hover:text-accent">
                Contact page
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center text-xs text-[#f5f0e8]">
        © {new Date().getFullYear()} {site.website_name}. All rights reserved.
      </div>

      <div className="border-t border-border bg-[#080808] py-4 text-center">
        <p className="text-[10px] leading-relaxed text-[#f5f0e8] sm:text-[11px]">
          Website Developed &amp; Managed By Gourav Singh
          <span className="mx-2 text-[#444]">·</span>
          Contact{' '}
          <a href="tel:7380931628" className="text-[#f5f0e8] hover:text-accent">
            7380931628
          </a>
          <span className="mx-2 text-[#444]">·</span>
          Email{' '}
          <a href="mailto:gourav5270singh@gmail.com" className="text-[#f5f0e8] hover:text-accent">
            gourav5270singh@gmail.com
          </a>
        </p>
      </div>
    </footer>
  )
}
