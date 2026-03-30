import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, categoryToSlug } from '../../lib/supabase'

const categoryImages = {
  'Movies':       ['https://placehold.co/400x500/1a1a1a/f5c518?text=Movies+1',       'https://placehold.co/400x500/f5c518/1a1a1a?text=Movies+2'],
  'Anime':        ['https://placehold.co/400x500/1a1a1a/f5c518?text=Anime+1',        'https://placehold.co/400x500/f5c518/1a1a1a?text=Anime+2'],
  'Sports':       ['https://placehold.co/400x500/1a1a1a/f5c518?text=Sports+1',       'https://placehold.co/400x500/f5c518/1a1a1a?text=Sports+2'],
  'Motivational': ['https://placehold.co/400x500/1a1a1a/f5c518?text=Motivation+1',   'https://placehold.co/400x500/f5c518/1a1a1a?text=Motivation+2'],
  'Aesthetic':    ['https://placehold.co/400x500/1a1a1a/f5c518?text=Aesthetic+1',    'https://placehold.co/400x500/f5c518/1a1a1a?text=Aesthetic+2'],
  'Nature':       ['https://placehold.co/400x500/1a1a1a/f5c518?text=Nature+1',       'https://placehold.co/400x500/f5c518/1a1a1a?text=Nature+2'],
  'Music':        ['https://placehold.co/400x500/1a1a1a/f5c518?text=Music+1',        'https://placehold.co/400x500/f5c518/1a1a1a?text=Music+2'],
  'Movie/Series': ['https://placehold.co/400x500/1a1a1a/f5c518?text=Series+1',       'https://placehold.co/400x500/f5c518/1a1a1a?text=Series+2'],
  'Car':          ['https://placehold.co/400x500/1a1a1a/f5c518?text=Car+1',          'https://placehold.co/400x500/f5c518/1a1a1a?text=Car+2'],
  'Bike':         ['https://placehold.co/400x500/1a1a1a/f5c518?text=Bike+1',         'https://placehold.co/400x500/f5c518/1a1a1a?text=Bike+2'],
  'God':          ['https://placehold.co/400x500/1a1a1a/f5c518?text=God+1',          'https://placehold.co/400x500/f5c518/1a1a1a?text=God+2'],
}

function CategoryCard({ c }) {
  const [hovered, setHovered] = useState(false)
  const imgs = categoryImages[c] || categoryImages['Movies']

  return (
    <Link
      to={`/category/${categoryToSlug(c)}`}
      className="group relative w-[72vw] shrink-0 overflow-hidden rounded-2xl border border-border bg-card md:w-auto"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="aspect-[4/5]" style={{ position: 'relative' }}>
        <img
          src={imgs[0]}
          alt=""
          loading="lazy"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            opacity: hovered ? 0 : 1,
            transition: 'opacity 0.4s ease',
          }}
        />
        <img
          src={imgs[1]}
          alt=""
          loading="lazy"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      <p className="absolute bottom-4 left-4 text-lg font-semibold text-white">{c}</p>
    </Link>
  )
}

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <h2 className="text-center text-2xl font-bold text-white md:text-3xl">
        Shop by category
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-[#aaaaaa]">
        Scroll on mobile — eleven curated worlds of wall art.
      </p>
      <div className="mt-10 flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-4 md:overflow-visible">
        {CATEGORIES.map((c) => (
          <CategoryCard key={c} c={c} />
        ))}
      </div>
    </section>
  )
}
