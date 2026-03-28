import { useEffect, useState } from 'react'
import { AnnouncementBar } from '../../components/layout/AnnouncementBar.jsx'
import { Footer } from '../../components/layout/Footer.jsx'
import { Navbar } from '../../components/layout/Navbar.jsx'
import {
  DEFAULT_SITE_SETTINGS,
  fetchSiteSettings,
} from '../../lib/siteSettings.js'

export default function Contact() {
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
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold text-white">Contact</h1>
        <p className="mt-6 text-sm font-semibold text-white">Website Name</p>
        <p className="mt-1 text-[#aaaaaa]">{site.website_name}</p>

        <p className="mt-6 text-sm font-semibold text-white">Official Email</p>
        <a
          href={`mailto:${site.email}`}
          className="mt-1 block text-accent hover:underline"
        >
          {site.email}
        </a>

        <p className="mt-6 text-sm font-semibold text-white">For Enquiries</p>
        <a
          href={`mailto:${enquiriesEmail}`}
          className="mt-1 block text-accent hover:underline"
        >
          {enquiriesEmail}
        </a>

        <p className="mt-6 text-sm font-semibold text-white">Help &amp; Support</p>
        <a
          href={`mailto:${helpEmail}`}
          className="mt-1 block text-accent hover:underline"
        >
          {helpEmail}
        </a>

        <p className="mt-6 text-sm font-semibold text-white">Direct Contact</p>
        <ul className="mt-2 space-y-2 text-[#aaaaaa]">
          {phones.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  )
}
