import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, HeartHandshake, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from './Avatar';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Top micro bar matching the reference image header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.65rem 1.5rem',
          maxWidth: '1440px',
          margin: '0 auto',
          gap: '1rem',
        }}
      >
        {/* Brand Logo & Tagline */}
        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none' }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 3px 8px rgba(37, 99, 235, 0.3)',
            }}
          >
            <HeartHandshake size={22} />
          </div>
          <div>
            <span
              style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                letterSpacing: '-0.3px',
                display: 'block',
                lineHeight: 1.1,
              }}
            >
              Global Student Connect
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                fontWeight: 500,
                display: 'block',
              }}
            >
              Different Cultures. Same Curiosity. A More Connected World.
            </span>
          </div>
        </Link>

        {/* Center: Meet • Learn • Share • Grow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-body)',
          }}
          className="desktop-only"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--teal)' }} />
            <span>Meet</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--purple)' }} />
            <span>Learn</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--coral)' }} />
            <span>Share</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--amber)' }} />
            <span>Grow</span>
          </div>
        </div>

        {/* Right Quote & Student profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-muted)',
            }}
            className="desktop-only"
          >
            <span className="handwriting-quote" style={{ fontSize: '1.2rem', color: '#475569' }}>
              Students today, a kinder tomorrow.
            </span>
            <Globe size={18} style={{ color: 'var(--primary)' }} />
          </div>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  textDecoration: 'none',
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--bg-subtle)',
                }}
              >
                <Avatar
                  src={user?.avatar}
                  alt={user?.name || 'Student'}
                  size="sm"
                  flag={user?.flag}
                />
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                  }}
                  className="desktop-only"
                >
                  {user?.name?.split(' ')[0] || 'Student'}
                </span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="btn btn-ghost btn-sm"
                title="Sign Out"
                style={{ padding: '0.4rem' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              <UserIcon size={14} />
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile-only Navigation Bar */}
      {isAuthenticated && (
        <div
          className="mobile-only"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '0.5rem 1rem',
            backgroundColor: '#ffffff',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.85rem',
            fontWeight: 700,
          }}
        >
          <Link to="/dashboard" style={{ color: 'var(--primary)', textDecoration: 'none', padding: '0.25rem 0.5rem' }}>
            Dashboard
          </Link>
          <Link to="/matching" style={{ color: 'var(--primary)', textDecoration: 'none', padding: '0.25rem 0.5rem' }}>
            Find Matches
          </Link>
          <Link to="/profile" style={{ color: 'var(--primary)', textDecoration: 'none', padding: '0.25rem 0.5rem' }}>
            My Profile
          </Link>
        </div>
      )}
    </header>
  );
}

export default Navbar;
