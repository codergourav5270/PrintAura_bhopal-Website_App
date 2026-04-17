import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, categoryToSlug } from '../../lib/supabase'

const categoryImages = {
  'Movies':       ['https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1775416971/mov-1_jurffv.jpg',   'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1775416970/mov-2_zqzjdg.jpg'],
  'Anime':        ['https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1775416875/a-1_wi7hkk.jpg',    'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1775416929/a-2_hbgias.jpg'],
  'Sports':       ['https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1775416998/S-1_lgzzel.jpg',    'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1775416998/s-2_g6fjc2.jpg'],
  'Motivational': ['https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1775416970/Mot-1_w2sofq.jpg',  'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1775416971/mot-2_hoi7mw.jpg'],
  'Aesthetic':    ['https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1775416970/m-1_jtmhrm.jpg',    'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1775416970/m-2_i5v0ij.jpg'],
  'Nature':       ['https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1775416969/Nat-1_scxzc8.jpg',  'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1775416970/nat-2_wkn8oz.jpg'],
  'Music':        ['https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1775416970/mus-1_w5fjzc.jpg',  'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1775416969/mus-2_chzyy8.jpg'],
  'Movie/Series': ['https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1775416998/ser-1_s5l1yv.jpg',  'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1775416998/ser-2_lgnoji.jpg'],
  'Car':          ['https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1775416929/car-1_sabw7n.jpg',  'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1775416929/car-2_w7x5kp.jpg'],
  'Bike':         ['https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1775416929/bike-1_v45hic.jpg', 'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1775416929/bike-2_kq5gcr.jpg'],
  'God':          ['https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1775416928/god-1_zi342r.jpg',  'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1775416929/god-2_pi9ug9.jpg'],
}

function CategoryCard({ c }) {
  const [hovered, setHovered] = useState(false)
  const imgs = categoryImages[c] || categoryImages['Movies']

  return (
    <Link
      to={`/category/${categoryToSlug(c)}`}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? 'perspective(800px) rotateX(4deg) rotateY(-4deg) scale(1.03)' : 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)',
        transition: 'transform 0.4s ease, box-shadow 0.4s ease',
        boxShadow: hovered ? '0 0 25px 6px rgba(107, 15, 26, 0.7)' : '0 0 0px transparent',
      }}
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
            transform: hovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
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
      <div className="flex justify-center mb-10">
        <div className="bg-[#f5f0e8] rounded-2xl px-6 py-3 text-center">
          <h2 className="text-2xl font-bold text-[#7b1c1c] md:text-3xl">
            Shop by category
          </h2>
          <p className="mt-1 text-sm text-[#7b1c1c]">
            Eleven curated worlds of wall art.
          </p>
        </div>
      </div>

      {/* 3 columns on mobile, 4 columns on desktop */}
      <div className="grid grid-cols-3 gap-2 md:grid-cols-4 md:gap-4">
        {CATEGORIES.map((c) => (
          <CategoryCard key={c} c={c} />
        ))}
      </div>
    </section>
  )
}
