import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { fetchSiteSettings } from '../../lib/siteSettings.js'

export function Hero() {
  const [card, setCard] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const s = await fetchSiteSettings()
      if (cancelled) return
      const c = s.hero_background?.card
      setCard(c && c.src ? c : null)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const placeholder =
    'https://placehold.co/600x800/1a1a1a/f5c518?text=Your+Wall%0AYour+Story'

  return (
    <section className="relative min-h-[85vh] overflow-hidden border-b border-border bg-gradient-to-b from-[#0a0a0a] via-[#111] to-bg">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-accent/20 blur-[120px]" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-amber-600/10 blur-[100px]" />
      </div>
      <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-4 pb-16 pt-24 md:min-h-[85vh] md:pb-24 md:pt-32 lg:flex-row lg:items-center lg:gap-12">
        <div className="flex-1">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Premium wall art
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
            Posters that{' '}
            <span className="text-accent">transform</span> your space.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#aaaaaa] md:text-lg">
            Hand-picked designs from cinema, anime, sports &amp; more. Printed on
            thick matte paper with archival inks — delivered safely to your door.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-accent px-8 py-3 font-semibold text-black transition hover:bg-[#e6b800]"
            >
              Shop collection
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/custom-poster"
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-border px-8 py-3 font-semibold text-white hover:border-accent/50 hover:text-accent"
            >
              Custom poster
            </Link>
          </div>
        </div>
        <div className="mt-12 flex flex-1 justify-center lg:mt-0">
          <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl border border-border shadow-2xl shadow-black/50 lg:max-w-md">
            {card?.type === 'video' && card.src ? (
              <video
                src={card.src}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src={card?.src || placeholder}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-6">
              <p className="text-sm text-accent">Editor&apos;s pick</p>
              <p className="text-lg font-semibold text-white">Minimal cinema collection</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
