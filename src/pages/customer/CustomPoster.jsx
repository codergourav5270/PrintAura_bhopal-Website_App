import { useEffect, useState } from 'react'
import { AnnouncementBar } from '../../components/layout/AnnouncementBar.jsx'
import { Footer } from '../../components/layout/Footer.jsx'
import { Navbar } from '../../components/layout/Navbar.jsx'
import { DEFAULT_SITE_SETTINGS, fetchSiteSettings } from '../../lib/siteSettings.js'

export default function CustomPoster() {
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
        <h1 className="text-3xl font-bold text-white">Custom poster</h1>
        <p className="mt-4 text-[#aaaaaa] leading-relaxed">
          Upload a high-resolution image (300 DPI recommended). Our team reviews every
          file for print safety, colour balance, and cropping. You&apos;ll receive a
          digital proof before we print.
        </p>
        <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-[#cccccc]">
          <li>Accepted: JPG, PNG, PDF up to 50 MB</li>
          <li>Popular sizes: A4, A3, A2, and large format 24×36</li>
          <li>Typical turnaround: 4–6 business days</li>
        </ul>
        <p className="mt-8 text-sm text-[#666]">
          For bespoke quotes email{' '}
          <a href={`mailto:${email}`} className="text-accent">
            {email}
          </a>{' '}
          with your artwork attached.
        </p>
      </main>
      <Footer />
    </>
  )
}
