import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <section
      className="hero-section"
      style={{
        position: 'relative',
        minHeight: '100dvh',
        backgroundImage: 'url(/wall.jpeg)',
        backgroundSize: 'contain',
backgroundPosition: 'center center',
backgroundRepeat: 'no-repeat',
backgroundColor: '#1a1a1a',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        paddingTop: 'clamp(1rem, 4vw, 2rem)',
        paddingBottom: 'clamp(1.5rem, 5vw, 3rem)',
      }}
    >
      {/* Dark overlay so text is readable */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.25)',
        zIndex: 1,
      }} />

      {/* Top brand name */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <p style={{
          letterSpacing: '0.3em',
          fontSize: 'clamp(10px, 2vw, 13px)',
          color: '#ffffff',
          fontWeight: 500,
          textTransform: 'uppercase',
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

      {/* Empty space middle */}
      <div style={{ flex: 1 }} />

      {/* Bottom CTA */}
      <div style={{
        position: 'relative',
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
            border: '1.5px solid #ffffff',
            color: '#ffffff',
            

            textTransform: 'uppercase',
            textDecoration: 'none',
            transition: 'all 0.3s',
            padding: 'clamp(12px, 3vw, 14px) clamp(20px, 7vw, 48px)',
            fontSize: 'clamp(11px, 2.5vw, 13px)',
            maxWidth: '280px',
            width: '90%',
            textAlign: 'center',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#ffffff'
            e.target.style.color = '#000000'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent'
            e.target.style.color = '#ffffff'
          }}
        >
          Explore
        </Link>
        <Link
          to="/custom-poster"
          style={{
            fontSize: '12px',
            color: '#ddd',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          Custom poster →
        </Link>
      </div>

      {/* Float animation removed — not needed for background */}
    </section>
  )
}
