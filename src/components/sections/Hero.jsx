import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <section
      className="hero-section"
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Top brand name — ABOVE image, no overlap */}
      <div style={{
        width: '100%',
        textAlign: 'center',
        padding: 'clamp(1rem, 4vw, 2rem) 0 clamp(0.5rem, 2vw, 1rem) 0',
        backgroundColor: '#ffffff',
      }}>
        <p style={{
          letterSpacing: '0.3em',
          fontSize: 'clamp(10px, 2vw, 13px)',
          color: '#1a1a1a',
          fontWeight: 500,
          textTransform: 'uppercase',
          margin: 0,
        }}>
          Premium Wall Art
        </p>
        <h2 style={{
          letterSpacing: '0.2em',
          fontSize: 'clamp(18px, 4vw, 36px)',
          color: '#c0392b',
          fontWeight: 700,
          marginTop: '8px',
          textTransform: 'uppercase',
        }}>
          PrintAura Bhopal
        </h2>
      </div>

      {/* Hero image — below the text */}
      <div style={{ position: 'relative', width: '100%' }}>
        <img
          src="/wall.jpeg"
          alt="hero"
          style={{
            width: '100%',
            display: 'block',
            objectFit: 'contain',
          }}
        />

        {/* Bottom CTA — over image only */}
        <div style={{
          position: 'absolute',
          bottom: 'clamp(1.5rem, 5vw, 3rem)',
          left: 0,
          right: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}>
          <Link
            to="/shop"
            style={{
              display: 'inline-block',
              border: '1.5px solid #1a1a1a',
              color: '#1a1a1a',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.3s',
              padding: 'clamp(12px, 3vw, 14px) clamp(20px, 7vw, 48px)',
              fontSize: 'clamp(11px, 2.5vw, 13px)',
              maxWidth: '280px',
              width: '90%',
              textAlign: 'center',
              backgroundColor: 'rgba(255,255,255,0.7)',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#1a1a1a'
              e.target.style.color = '#ffffff'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.7)'
              e.target.style.color = '#1a1a1a'
            }}
          >
            Explore
          </Link>
          <Link
            to="/custom-poster"
            style={{
              fontSize: '12px',
              color: '#1a1a1a',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Custom Poster →
          </Link>
        </div>
      </div>

    </section>
  )
}
