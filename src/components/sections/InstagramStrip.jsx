import { useEffect, useRef } from 'react'

const INSTAGRAM_URL = 'https://www.instagram.com/printaura_bhopal?igsh=MWp0NDFqbnhsaHU3aA=='

const imgs = [
  'https://res.cloudinary.com/dqlzmrztl/video/upload/q_auto,f_mp4,w_400/v1774856382/WhatsApp_Video_2026-01-31_at_14.13.53_n456nk.mp4',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/q_auto,f_mp4,w_400/v1774856381/VID-20260313-WA0057_u3skz3.mp4',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/q_auto,f_mp4,w_400/v1774856381/VID-20260313-WA0056_pnvxzz.mp4',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/q_auto,f_mp4,w_400/v1774856380/VN20260302_182958_arattj.mp4',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/q_auto,f_mp4,w_400/v1774856378/VID-20260209-WA0026_ehvabm.mp4',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/q_auto,f_mp4,w_400/v1774856378/VID-20260216-WA0056_1_yui8vi.mp4',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/q_auto,f_mp4,w_400/v1774856377/VID-20260313-WA0053_s7vjoh.mp4',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/q_auto,f_mp4,w_400/v1774856375/VID-20260203-WA0288_yauv6p.mp4',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/q_auto,f_mp4,w_400/v1774856375/VID-20260201-WA0000_1_squubm.mp4',
  'https://res.cloudinary.com/dqlzmrztl/video/upload/q_auto,f_mp4,w_400/v1774856375/VID-20260313-WA0058_urjeoe.mp4',
]

function MediaItem({ src }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.src = src
          el.load()
          el.play().catch(() => {})
        } else {
          el.pause()
          el.src = ''
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [src])

  return (
    <video
      ref={videoRef}
      loop
      muted
      playsInline
      style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#111' }}
    />
  )
}

export function InstagramStrip() {
  return (
    <section className="border-t border-border py-12 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 text-center mb-8">
        <p className="text-sm font-medium text-accent">@printaura_bhopal</p>
        <h2 className="mt-1 text-xl font-bold text-white">On your wall soon</h2>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-black hover:opacity-90">Follow us on Instagram</a>
      </div>
      <div 
  style={{ overflow: 'hidden', width: '100%' }}
  onMouseEnter={e => e.currentTarget.querySelector('div').style.animationPlayState = 'paused'}
  onMouseLeave={e => e.currentTarget.querySelector('div').style.animationPlayState = 'running'}
>
        <div style={{ display: 'flex', gap: '16px', animation: 'scrollLeft 50s linear infinite', width: 'max-content' }}>
          {[...imgs, ...imgs].map((src, i) => (
            <a key={i} href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" style={{ width: '420px', height: '480px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0, display: 'block' }}>
              <MediaItem src={src} />
            </a>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
