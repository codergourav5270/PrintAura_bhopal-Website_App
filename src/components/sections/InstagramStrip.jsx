import { useState, useEffect } from 'react'

const INSTAGRAM_URL = 'https://www.instagram.com/printaura_bhopal?igsh=MWp0NDFqbnhsaHU3aA=='

const videoIds = [
  'RiDSHGA-hLQ',
  'Rk9MKA2E4fM',
  '5Xf5U2oF8Qs',
  'gTuidMu0ejE',
  'E7lsl5c9j7U',
  'NWajQpi5tQU',
  'fyqxA_9VsMg',
  'hWgsEPiP-cQ',
  'CxMIZZOYlkA',
  'qPZ2s64RcAM',
  '_ywhwhScC54',
  'jsKKiAsnzA0',
]

const thumbnails = [
  'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1776633309/WhatsApp_Image_2026-04-17_at_23.54.07_edvlwz.jpg',
  'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1776633303/WhatsApp_Image_2026-04-17_at_23.54.10_pjysrr.jpg',
  'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1776633302/WhatsApp_Image_2026-04-17_at_23.54.10_2_yks1yx.jpg',
  'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1776633298/WhatsApp_Image_2026-04-17_at_23.54.11_ycmi2w.jpg',
  'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1776633292/WhatsApp_Image_2026-04-17_at_23.54.09_2_a7ailw.jpg',
  'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1776633289/WhatsApp_Image_2026-04-17_at_23.54.10_1_krize5.jpg',
  'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1776633283/WhatsApp_Image_2026-04-17_at_23.54.05_1_fzgkwo.jpg',
  'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1776633278/WhatsApp_Image_2026-04-17_at_23.54.09_pcgrud.jpg',
  'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1776633275/WhatsApp_Image_2026-04-17_at_23.54.09_1_s5gwct.jpg',
  'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1776633271/WhatsApp_Image_2026-04-17_at_23.54.07_1_xwy4nc.jpg',
  'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1776633261/WhatsApp_Image_2026-04-17_at_23.54.03_1_mr5fq7.jpg',
  'https://res.cloudinary.com/dqlzmrztl/image/upload/q_auto/f_auto/v1776633260/WhatsApp_Image_2026-04-17_at_23.54.05_ifnbui.jpg',
]

const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size))
const videoGroups = chunk(videoIds, 4)

function YouTubeCarousel({ ids, durations = [] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent(p => (p + 1) % ids.length)
    }, 8000)
    return () => clearInterval(t)
  }, [ids])

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: '16px', overflow: 'hidden', height: '400px', background: '#f5f0e8' }}>
      {ids.map((id, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0,
          opacity: current === i ? 1 : 0,
          transition: 'opacity 0.1s ease',
          pointerEvents: current === i ? 'auto' : 'none',
        }}>
          <iframe
  src={current === i 
    ? `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=0&controls=0&rel=0&modestbranding=1`
    : i === (current + 1) % ids.length 
    ? `https://www.youtube.com/embed/${id}?autoplay=0&mute=1`
    : ''}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      ))}
      <button onClick={() => setCurrent(p => (p - 1 + ids.length) % ids.length)} style={{
        position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
        background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%',
        width: '36px', height: '36px', color: '#fff', fontSize: '18px', cursor: 'pointer', zIndex: 10,
      }}>‹</button>
      <button onClick={() => setCurrent(p => (p + 1) % ids.length)} style={{
        position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
        background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%',
        width: '36px', height: '36px', color: '#fff', fontSize: '18px', cursor: 'pointer', zIndex: 10,
      }}>›</button>
      <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 10 }}>
        {ids.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} style={{
            width: current === i ? '18px' : '7px', height: '7px', borderRadius: '4px',
            background: current === i ? '#f5c518' : 'rgba(255,255,255,0.4)',
            border: 'none', cursor: 'pointer', transition: 'all 0.3s',
          }} />
        ))}
      </div>
    </div>
  )
}

function ScrollStrip({ direction }) {
  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <div style={{
        display: 'flex', gap: '12px',
        animation: `${direction === 'left' ? 'scrollLeft' : 'scrollRight'} 40s linear infinite`,
        width: 'max-content',
      }}>
        {[...thumbnails, ...thumbnails, ...thumbnails].map((src, i) => (
          <img key={i} src={src} alt="" style={{ width: '230px', height: '260px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }} />
        ))}
      </div>
    </div>
  )
}

export function InstagramStrip() {
  return (
    <section className="border-t border-border py-12" style={{ background: 'var(--bg, #faf9f7)', overflow: 'hidden' }}>

      <div className="mx-auto max-w-7xl px-4 text-center mb-8">
        <div className="inline-block bg-[#f5f0e8] rounded-2xl px-6 py-3">
          <p className="text-sm font-medium" style={{ color: '#6B0F1A' }}>@printaura_bhopal</p>
          <h2 className="mt-1 text-xl font-bold" style={{ color: '#6B0F1A' }}>On your wall soon</h2>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
            className="mt-4 inline-block rounded-lg px-5 py-2 text-sm font-bold text-white hover:opacity-90" style={{ background: '#6B0F1A' }}>
            Follow us on Instagram
          </a>
        </div>
      </div>

      <ScrollStrip direction="right" />

      <div className="hidden md:block" style={{ padding: '16px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {videoGroups.slice(0, 3).map((group, i) => (
            <YouTubeCarousel key={i} ids={group} />
          ))}
        </div>
      </div>

      <ScrollStrip direction="left" />

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
