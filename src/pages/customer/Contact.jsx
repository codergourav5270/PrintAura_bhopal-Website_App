import { AnnouncementBar } from '../../components/layout/AnnouncementBar.jsx'
import { Footer } from '../../components/layout/Footer.jsx'
import { Navbar } from '../../components/layout/Navbar.jsx'

export default function Contact() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold text-white">Contact</h1>
        <p className="mt-6 text-sm font-semibold text-white">Website Name</p>
        <p className="mt-1 text-[#aaaaaa]">PrintAura_bhopal</p>

        <p className="mt-6 text-sm font-semibold text-white">Official Email</p>
        <a
          href="mailto:printaura999@gmail.com"
          className="mt-1 block text-accent hover:underline"
        >
          printaura999@gmail.com
        </a>

        <p className="mt-6 text-sm font-semibold text-white">For Enquiries</p>
        <a
          href="mailto:query999@gmail.com"
          className="mt-1 block text-accent hover:underline"
        >
          query999@gmail.com
        </a>

        <p className="mt-6 text-sm font-semibold text-white">Help &amp; Support</p>
        <a
          href="mailto:support999@gmail.com"
          className="mt-1 block text-accent hover:underline"
        >
          support999@gmail.com
        </a>

        <p className="mt-6 text-sm font-semibold text-white">Direct Contact</p>
        <ul className="mt-2 space-y-2 text-[#aaaaaa]">
          <li>Raman Nathawat — 7869014601</li>
          <li>Ambesh Rajput — 7999830083</li>
        </ul>
      </main>
      <Footer />
    </>
  )
}
