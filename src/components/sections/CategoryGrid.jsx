import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, categoryToSlug } from '../../lib/supabase'

const categoryImages = {
  'Movies':       ['https://res.cloudinary.com/dqlzmrztl/image/upload/v1775416971/mov-1_jurffv.jpg',   'https://res.cloudinary.com/dqlzmrztl/image/upload/v1775416970/mov-2_zqzjdg.jpg'],
  'Anime':        ['https://res.cloudinary.com/dqlzmrztl/image/upload/v1775416875/a-1_wi7hkk.jpg',    'https://res.cloudinary.com/dqlzmrztl/image/upload/v1775416929/a-2_hbgias.jpg'],
  'Sports':       ['https://res.cloudinary.com/dqlzmrztl/image/upload/v1775416998/S-1_lgzzel.jpg',    'https://res.cloudinary.com/dqlzmrztl/image/upload/v1775416998/s-2_g6fjc2.jpg'],
  'Motivational': ['https://res.cloudinary.com/dqlzmrztl/image/upload/v1775416970/Mot-1_w2sofq.jpg',  'https://res.cloudinary.com/dqlzmrztl/image/upload/v1775416971/mot-2_hoi7mw.jpg'],
  'Aesthetic':    ['https://res.cloudinary.com/dqlzmrztl/image/upload/v1775416970/m-1_jtmhrm.jpg',    'https://res.cloudinary.com/dqlzmrztl/image/upload/v1775416970/m-2_i5v0ij.jpg'],
  'Nature':       ['https://res.cloudinary.com/dqlzmrztl/image/upload/v1775416969/Nat-1_scxzc8.jpg',  'https://res.cloudinary.com/dqlzmrztl/image/upload/v1775416970/nat-2_wkn8oz.jpg'],
  'Music':        ['https://res.cloudinary.com/dqlzmrztl/image/upload/v1775416970/mus-1_w5fjzc.jpg',  'https://res.cloudinary.com/dqlzmrztl/image/upload/v1775416969/mus-2_chzyy8.jpg'],
  'Movie/Series': ['https://res.cloudinary.com/dqlzmrztl/image/upload/v1775416998/ser-1_s5l1yv.jpg',  'https://res.cloudinary.com/dqlzmrztl/image/upload/v1775416998/ser-2_lgnoji.jpg'],
  'Car':          ['https://res.cloudinary.com/dqlzmrztl/image/upload/v1775416929/car-1_sabw7n.jpg',  'https://res.cloudinary.com/dqlzmrztl/image/upload/v1775416929/car-2_w7x5kp.jpg'],
  'Bike':         ['https://res.cloudinary.com/dqlzmrztl/image/upload/v1775416929/bike-1_v45hic.jpg', 'https://res.cloudinary.com/dqlzmrztl/image/upload/v1775416929/bike-2_kq5gcr.jpg'],
  'God / Spiritual': ['https://res.cloudinary.com/dqlzmrztl/image/upload/v1775416928/god-1_zi342r.jpg', 'https://res.cloudinary.com/dqlzmrztl/image/upload/v1775416929/god-2_pi9ug9.jpg'],
  'Custom':       ['https://res.cloudinary.com/dqlzmrztl/image/upload/v1776622990/cus_1_rn74ow.jpg', 'https://res.cloudinary.com/dqlzmrztl/image/upload/v1776622995/cus_2_qyin10.jpg'],
  'Girls Point':  ['https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1776629510/lad_1_ektsv0.jpg', 'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1776629363/lad_2_wh1ayf.jpg'],
'Love':         ['https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1776629725/love_1_rx3rv5.jpg', 'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1776629732/Love_2_c6mz4b.jpg'],
'Gym':          ['https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1776629753/gym_1_wzvrgb.jpg', 'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1776629770/gym_2_msgtpc.jpg'],
'Foodie':       ['https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1776629809/foo_1_b1bo5r.jpg', 'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1776629817/foo_2_xpljxx.jpg'],
}

// Mobile card — small fixed size, no hover
function MobileCard({ c }) {
  const imgs = categoryImages[c] || categoryImages['Movies']
  return (
    <Link
      to={`/category/${categoryToSlug(c)}`}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card"
      style={{ flexShrink: 0, width: '22vw' }}
    >
      <div style={{ position: 'relative', width: '22vw', height: '28vw' }}>
        <img src={imgs[0]} alt="" loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      <p className="absolute bottom-2 left-2 text-xs font-semibold text-white">{c}</p>
    </Link>
  )
}

// Desktop card — full size with hover effect
function DesktopCard({ c }) {
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
        <img src={imgs[0]} alt="" loading="lazy"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            opacity: hovered ? 0 : 1,
            transition: 'opacity 0.4s ease',
          }}
        />
        <img src={imgs[1]} alt="" loading="lazy"
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

function ScrollRow({ items, direction, speed }) {
  const tripled = [...items]
  return (
    <div style={{ width: '100%', padding: '0 8px', marginBottom: '10px' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', width: '100%', gap: '8px',
        animation: `none`,
      }}>
        {tripled.map((c, i) => (
          <MobileCard key={`${c}-${i}`} c={c} />
        ))}
      </div>
    </div>
  )
}

export function CategoryGrid() {
  const row1 = CATEGORIES.slice(0, 4)
  const row2 = CATEGORIES.slice(4, 8)
  const row3 = CATEGORIES.slice(8, 12)
  const row4 = CATEGORIES.slice(12)

  return (
    <section className="py-16" style={{ overflow: 'hidden', maxWidth: '100vw' }}>
      <div className="flex justify-center mb-10 px-4">
        <div className="bg-[#f5f0e8] rounded-2xl px-6 py-3 text-center">
          <h2 className="text-2xl font-bold text-[#7b1c1c] md:text-3xl">Shop by category</h2>
          <p className="mt-1 text-sm text-[#7b1c1c]">Eleven curated worlds of wall art.</p>
        </div>
      </div>

      {/* Mobile — 4 scrolling rows, NO hover */}
      <div className="md:hidden">
        <ScrollRow items={row1} direction="left"  speed={18} />
        <ScrollRow items={row2} direction="right" speed={22} />
        <ScrollRow items={row3} direction="left"  speed={20} />
        <ScrollRow items={row4} direction="right" speed={16} />
      </div>

      {/* Desktop — normal grid WITH hover */}
      <div className="hidden md:grid mx-auto max-w-7xl px-4"
        style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {CATEGORIES.map((c) => (
          <DesktopCard key={c} c={c} />
        ))}
      </div>

      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes scrollRight {
          0% { transform: translateX(-33.33%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  )
}
