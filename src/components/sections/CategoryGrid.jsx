import { Link } from 'react-router-dom'
import { CATEGORIES, categoryToSlug } from '../../lib/supabase'

const preview = [
  'https://placehold.co/400x533/1a1a1a/f5c518?text=Movies',
  'https://placehold.co/400x533/1a1a1a/ffffff?text=Anime',
  'https://placehold.co/400x533/1a1a1a/f5c518?text=Sports',
  'https://placehold.co/400x533/1a1a1a/ffffff?text=Motivation',
  'https://placehold.co/400x533/1a1a1a/f5c518?text=Aesthetic',
  'https://placehold.co/400x533/1a1a1a/ffffff?text=Nature',
  'https://placehold.co/400x533/1a1a1a/f5c518?text=Music',
  'https://placehold.co/400x533/1a1a1a/ffffff?text=Bollywood',
]

export function CategoryGrid() {
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
