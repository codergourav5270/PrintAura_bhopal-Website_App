import { useEffect, useRef, useState } from 'react'

const INSTAGRAM_URL = 'https://www.instagram.com/printaura_bhopal?igsh=MWp0NDFqbnhsaHU3aA=='

const videos = [
  'https://res.cloudinary.com/dqlzmrztl/video/upload/q_75,w_400,f_mp4/v1774856690/VID20260219164531_xznaeb.mp4',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/q_75,w_400,f_mp4/v1774856382/WhatsApp_Video_2026-01-31_at_14.13.53_n456nk.mp4',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/q_75,w_400,f_mp4/v1774856381/VID-20260313-WA0056_pnvxzz.mp4',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/q_75,w_400,f_mp4/v1774856378/VID-20260209-WA0026_ehvabm.mp4',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/q_75,w_400,f_mp4/v1774856377/VID-20260313-WA0053_s7vjoh.mp4',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/q_75,w_400,f_mp4/v1774856375/VID-20260201-WA0000_1_squubm.mp4',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/q_75,w_400,f_mp4/v1774856507/VN20260302_182824_grptmp.mp4',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/q_75,w_400,f_mp4/v1774856381/VID-20260313-WA0057_u3skz3.mp4',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/q_75,w_400,f_mp4/v1774856380/VN20260302_182958_arattj.mp4',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/q_75,w_400,f_mp4/v1774856378/VID-20260216-WA0056_1_yui8vi.mp4',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/q_75,w_400,f_mp4/v1774856375/VID-20260203-WA0288_yauv6p.mp4',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/q_75,w_400,f_mp4/v1774856375/VID-20260313-WA0058_urjeoe.mp4',    
]

const thumbnails = [
  'https://res.cloudinary.com/dqlzmrztl/video/upload/so_0,w_300,h_300,c_fill,f_jpg/v1774856690/VID20260219164531_xznaeb.jpg',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/so_0,w_300,h_300,c_fill,f_jpg/v1774856382/WhatsApp_Video_2026-01-31_at_14.13.53_n456nk.jpg',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/so_0,w_300,h_300,c_fill,f_jpg/v1774856381/VID-20260313-WA0056_pnvxzz.jpg',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/so_0,w_300,h_300,c_fill,f_jpg/v1774856378/VID-20260209-WA0026_ehvabm.jpg',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/so_0,w_300,h_300,c_fill,f_jpg/v1774856377/VID-20260313-WA0053_s7vjoh.jpg',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/so_0,w_300,h_300,c_fill,f_jpg/v1774856375/VID-20260201-WA0000_1_squubm.jpg',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/so_0,w_300,h_300,c_fill,f_jpg/v1774856507/VN20260302_182824_grptmp.jpg',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/so_0,w_300,h_300,c_fill,f_jpg/v1774856381/VID-20260313-WA0057_u3skz3.jpg',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/so_0,w_300,h_300,c_fill,f_jpg/v1774856380/VN20260302_182958_arattj.jpg',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/so_0,w_300,h_300,c_fill,f_jpg/v1774856378/VID-20260216-WA0056_1_yui8vi.jpg',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/so_0,w_300,h_300,c_fill,f_jpg/v1774856375/VID-20260203-WA0288_yauv6p.jpg',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/so_0,w_300,h_300,c_fill,f_jpg/v1774856375/VID-20260313-WA0058_urjeoe.jpg',
]

const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size))
const videoGroups = chunk(videos, 4)

function VideoItem({ src, active, preload }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (active) {
      el.src = src
      el.load()
      el.play().catch(() => {})
    } else if (preload) {
      el.src = src
      el.load()
    } else {
      el.pause()
      el.src = ''
    }
  }, [active, preload, src])
  return <video ref={ref} loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
}

function ScrollStrip({ direction }) {
  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <div style={{
        display: 'flex', gap: '10px',
        animation: `${direction === 'left' ? 'scrollLeft' : 'scrollRight'} 25s linear infinite`,
        width: 'max-content',
      }}>
        {[...thumbnails, ...thumbnails, ...thumbnails].map((src, i) => (
          <img key={i} src={src} alt="" style={{ width: '140px', height: '140px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }} />
        ))}
      </div>
    </div>
  )
}

function VideoCarousel({ vids }) {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % vids.length), 4000)
    return () => clearInterval(t)
  }, [vids])

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: '16px', overflow: 'hidden', height: '400px' }}>
      {vids.map((src, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0,
          opacity: current === i ? 1 : 0,
          transition: 'opacity 0.5s ease',
          pointerEvents: current === i ? 'auto' : 'none',
        }}>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', height: '100%' }}>
          <VideoItem src={src} active={current === i} preload={i === (current + 1) % vids.length} />
          </a>
        </div>
      ))}
      <button onClick={() => setCurrent(p => (p - 1 + vids.length) % vids.length)} style={{
        position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
        background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%',
        width: '36px', height: '36px', color: '#fff', fontSize: '18px', cursor: 'pointer', zIndex: 10,
      }}>‹</button>
      <button onClick={() => setCurrent(p => (p + 1) % vids.length)} style={{
        position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
        background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%',
        width: '36px', height: '36px', color: '#fff', fontSize: '18px', cursor: 'pointer', zIndex: 10,
      }}>›</button>
      <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 10 }}>
        {vids.map((_, i) => (
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

export function InstagramStrip() {
  return (
    <section className="border-t border-border py-12" style={{ background: 'var(--bg, #faf9f7)', overflow: 'hidden' }}>

      {/* Header */}
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

      {/* Row 1 — Left to Right strip */}
      <ScrollStrip direction="right" />

      {/* 3 Video carousels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', padding: '16px 24px' }}>
        {videoGroups.slice(0, 3).map((group, i) => (
          <VideoCarousel key={i} vids={group} />
        ))}
      </div>

      {/* Row 2 — Right to Left strip */}
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
