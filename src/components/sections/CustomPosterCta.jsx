import { Palette } from 'lucide-react'
import { Link } from 'react-router-dom'

export function CustomPosterCta() {
  return (
    <section className="mx-4 my-8 overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-[#1a1208] to-[#0d0d0d] md:mx-auto md:max-w-7xl">
      <div className="flex flex-col items-center gap-6 px-6 py-14 text-center md:flex-row md:justify-between md:text-left lg:px-16">
        <div className="flex flex-col items-center md:items-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            <Palette className="h-3.5 w-3.5" />
            Custom studio
          </span>
          <h2 className="mt-4 text-2xl font-bold text-white md:text-3xl">
            Your photo. Your dimensions. Your poster.
          </h2>
          <p className="mt-2 max-w-lg text-sm text-[#aaaaaa]">
            Upload high-resolution artwork — we&apos;ll proof, print, and ship with the
            same premium finish as our store collection.
          </p>
        </div>
        <Link
          to="/custom-poster"
          className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-xl bg-accent px-8 py-3 font-semibold text-black hover:bg-[#e6b800]"
        >
          Start custom order
        </Link>
      </div>
    </section>
  )
}
