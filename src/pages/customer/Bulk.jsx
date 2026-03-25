import { AnnouncementBar } from '../../components/layout/AnnouncementBar.jsx'
import { Footer } from '../../components/layout/Footer.jsx'
import { Navbar } from '../../components/layout/Navbar.jsx'

export default function Bulk() {
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
          <a href="mailto:printaura999@gmail.com" className="text-accent">
            printaura999@gmail.com
          </a>
        </p>
      </main>
      <Footer />
    </>
  )
}
