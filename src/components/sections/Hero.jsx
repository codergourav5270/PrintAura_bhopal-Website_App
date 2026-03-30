import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#080808',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        paddingTop: '2rem',
        paddingBottom: '3rem',
      }}
    >
      {/* Full screen background image */}
      <div style={{
        position: 'absolute',
        inset: '20px',
        zIndex: 1,
        borderRadius: '16px',
        overflow: 'hidden',
      }}>
        <img
          src="/wall.jpeg"
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            animation: 'floatUp 6s ease-in-out infinite',
            filter: 'brightness(1.1) contrast(1.05)',
          }}
        />
      </div>

      

      {/* Top brand name */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <p style={{
          letterSpacing: '0.3em',
          fontSize: '13px',
          color: '#f5c518',
          fontWeight: 500,
          textTransform: 'uppercase',
        }}>
          Premium Wall Art
        </p>
        <h2 style={{
          letterSpacing: '0.2em',
          fontSize: 'clamp(22px, 4vw, 36px)',
          color: '#ffffff',
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
            padding: '14px 48px',
            letterSpacing: '0.25em',
            fontSize: '13px',
            fontWeight: 600,
            textTransform: 'uppercase',
            textDecoration: 'none',
            transition: 'all 0.3s',
            
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
            color: '#aaa',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          Custom poster →
        </Link>
      </div>

      {/* Float animation */}
      <style>{`
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px) scale(1.02); }
          50% { transform: translateY(-15px) scale(1.04); }
        }
      `}</style>
    </section>
  )
}
