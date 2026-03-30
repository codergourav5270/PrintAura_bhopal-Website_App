import { useEffect, useState } from 'react'
import { fetchSiteSettings } from '../../lib/siteSettings'
import { AnnouncementBar } from '../../components/layout/AnnouncementBar.jsx'
import { Footer } from '../../components/layout/Footer.jsx'
import { Navbar } from '../../components/layout/Navbar.jsx'

export default function About() {
  const [siteName, setSiteName] = useState('PrintAura_bhopal')
  useEffect(() => {
    fetchSiteSettings().then((s) => s?.website_name && setSiteName(s.website_name))
  }, [])
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold text-white">About {siteName}</h1>
        <p className="mt-6 leading-relaxed text-[#aaaaaa]">
          We are a small Indian team obsessed with print quality and packaging. Every
          poster is inspected before it leaves our studio. From matte paper stock to
          crush-proof tubes, we build an unboxing experience worth sharing.
        </p>
      </main>
      <Footer />
    </>
  )
}
