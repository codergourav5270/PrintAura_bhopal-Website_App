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
        <p className="mt-6 text-[#aaaaaa]">
          Email:{' '}
          <a href="mailto:hello@postergalaxy.in" className="text-accent">
            hello@postergalaxy.in
          </a>
        </p>
        <p className="mt-2 text-[#aaaaaa]">Hours: Mon–Sat, 10am–7pm IST</p>
      </main>
      <Footer />
    </>
  )
}
