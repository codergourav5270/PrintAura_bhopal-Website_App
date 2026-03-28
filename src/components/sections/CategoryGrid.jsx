import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, categoryToSlug } from '../../lib/supabase'
import {
  DEFAULT_SITE_SETTINGS,
  fetchSiteSettings,
} from '../../lib/siteSettings.js'

const fallbackPreview = DEFAULT_SITE_SETTINGS.category_data.previews

export function CategoryGrid() {
  const [preview, setPreview] = useState(fallbackPreview)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const s = await fetchSiteSettings()
      if (cancelled) return
      const p = s.category_data?.previews
      if (Array.isArray(p) && p.length >= 8) setPreview(p)
      else setPreview(fallbackPreview)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const eight = CATEGORIES.slice(0, 8)
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <h2 className="text-center text-2xl font-bold text-white md:text-3xl">
        Shop by category
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-[#aaaaaa]">
        Scroll on mobile — eight curated worlds of wall art.
      </p>
      <div className="mt-10 flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-4 md:overflow-visible">
        {eight.map((c, i) => (
          <Link
            key={c}
            to={`/category/${categoryToSlug(c)}`}
            className="group relative w-[72vw] shrink-0 overflow-hidden rounded-2xl border border-border bg-card md:w-auto"
          >
            <div className="aspect-[4/5]">
              <img
                src={preview[i] || preview[0]}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover opacity-80 transition group-hover:scale-105 group-hover:opacity-100"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <p className="absolute bottom-4 left-4 text-lg font-semibold text-white">
              {c}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
