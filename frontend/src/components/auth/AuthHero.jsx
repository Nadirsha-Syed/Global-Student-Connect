import { Globe, HeartHandshake, Sparkles, Users, Compass } from 'lucide-react';

export function AuthHero({ mode = 'login' }) {
  const isLogin = mode === 'login';

  return (
    <div
      style={{
        flex: 1,
        background: 'linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 50%, #0284c7 100%)',
        color: '#ffffff',
        padding: '3.5rem 2.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative subtle background shapes */}
      <div
        style={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 240,
          height: 240,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -40,
          left: -40,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.25) 0%, rgba(255,255,255,0) 70%)',
        }}
      />

      {/* Top Brand Logo */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <HeartHandshake size={24} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Global Student Connect
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.85)', margin: 0 }}>
              Different Cultures. Same Curiosity.
            </p>
          </div>
        </div>
      </div>

      {/* Center Hero Card */}
      <div style={{ position: 'relative', zIndex: 1, margin: '2rem 0' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'rgba(255, 255, 255, 0.18)',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '1rem',
            backdropFilter: 'blur(4px)',
          }}
        >
          <Sparkles size={14} color="#fde047" />
          <span>{isLogin ? 'Welcome Back!' : 'Create Your Global Identity'}</span>
        </div>

        <h1
          style={{
            fontSize: '2.15rem',
            fontWeight: 800,
            lineHeight: 1.2,
            color: '#ffffff',
            marginBottom: '1rem',
          }}
        >
          {isLogin
            ? 'The world is waiting for your story.'
            : 'Students. Cultures. Conversations Without Borders.'}
        </h1>

        <p
          style={{
            fontSize: '0.975rem',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: 1.6,
            maxWidth: 420,
            marginBottom: '1.75rem',
          }}
        >
          {isLogin
            ? 'Connect with verified students from over 100+ countries. Practice languages, share passions, and explore global perspectives in a safe community.'
            : 'Join a safe, friendly community of students worldwide. Match with peers who share your exact interests and curiosity.'}
        </p>

        {/* Interactive Feature Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.825rem',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Users size={14} />
            <span>10K+ Students</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.825rem',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Globe size={14} />
            <span>100+ Countries</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.825rem',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Compass size={14} />
            <span>50+ Topics</span>
          </div>
        </div>
      </div>

      {/* Bottom Motto Quote */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          paddingTop: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          className="handwriting-quote"
          style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.25rem' }}
        >
          Students today, a kinder tomorrow.
        </span>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>
          Learn • Share • Grow
        </span>
      </div>
    </div>
  );
}

export default AuthHero;
