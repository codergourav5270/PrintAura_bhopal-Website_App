import { Link, useLocation } from 'react-router-dom'
import { AnnouncementBar } from '../../components/layout/AnnouncementBar.jsx'
import { Footer } from '../../components/layout/Footer.jsx'
import { Navbar } from '../../components/layout/Navbar.jsx'

export default function OrderSuccess() {
  const { state } = useLocation()
  const orderNumber = state?.orderNumber || '—'

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <svg
            className="h-24 w-24 -rotate-90 text-accent"
            viewBox="0 0 36 36"
            aria-hidden
          >
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="animate-draw-circle text-accent/30"
            />
            <path
              d="M10 18l5 5 12-12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-checkmark-pop"
              style={{ transformOrigin: 'center' }}
            />
          </svg>
          <span className="absolute text-3xl animate-checkmark-pop" aria-hidden>
            ✅
          </span>
        </div>
        <h1 className="mt-8 text-2xl font-bold text-white md:text-3xl">
          🎉 Order placed successfully!
        </h1>
        <p className="mt-2 text-sm text-[#aaaaaa]">
          Order number:{' '}
          <span className="font-mono text-accent">{orderNumber}</span>
        </p>
        <p className="mt-4 text-sm text-[#cccccc]">
          Estimated delivery: 3–5 business days across metro cities.
        </p>
        <Link
          to="/shop"
          className="mt-10 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-accent px-8 py-3 font-semibold text-black hover:bg-[#e6b800]"
        >
          Continue shopping
        </Link>
      </main>
      <Footer />
    </>
  )
}
