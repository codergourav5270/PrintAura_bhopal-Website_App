import { useEffect, useState } from 'react'
import { AnnouncementBar } from '../../components/layout/AnnouncementBar.jsx'
import { Footer } from '../../components/layout/Footer.jsx'
import { Navbar } from '../../components/layout/Navbar.jsx'
import { DEFAULT_SITE_SETTINGS, fetchSiteSettings } from '../../lib/siteSettings.js'

export default function Bulk() {
  const [email, setEmail] = useState(DEFAULT_SITE_SETTINGS.email)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const s = await fetchSiteSettings()
      if (!cancelled) setEmail(s.email || DEFAULT_SITE_SETTINGS.email)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold text-white">Bulk orders</h1>
        <p className="mt-6 leading-relaxed text-[#aaaaaa]">
          Cafes, co-working spaces, retail stores, and film clubs — we offer tiered
          pricing for 25+ units. Share your moodboard and timeline; we&apos;ll assign
          a dedicated production slot.
        </p>
        <p className="mt-4 text-sm text-[#666]">
          Write to{' '}
          <a href={`mailto:${email}`} className="text-accent">
            {email}
          </a>
        </p>
      </main>
      <Footer />
    </>
  )
}
