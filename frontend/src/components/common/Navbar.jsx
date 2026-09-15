import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, HeartHandshake, LogOut, User as UserIcon, Bell, Check, X, Video, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { matchingService } from '../../services/matchingService';
import Avatar from './Avatar';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [incomingRequests, setIncomingRequests] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [acceptedSuccess, setAcceptedSuccess] = useState(null);
  const notifRef = useRef(null);

  // Poll for incoming connection requests
  const fetchRequests = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await matchingService.getIncomingRequests();
      if (res.success) {
        setIncomingRequests(res.requests || []);
      }
    } catch {
      // Ignore background network blips
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 4000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user?.id, user?._id]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAccept = async (requestId, requesterName) => {
    setActionLoading(requestId);
    try {
      const res = await matchingService.acceptRequest(requestId);
      if (res.success) {
        setAcceptedSuccess(requesterName);
        fetchRequests();
        setTimeout(() => setAcceptedSuccess(null), 6000);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (requestId) => {
    setActionLoading(requestId);
    try {
      const res = await matchingService.declineRequest(requestId);
      if (res.success) {
        fetchRequests();
      }
    } finally {
      setActionLoading(null);
    }
  };

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
              
              {/* Notification Bell with Badge */}
              <div style={{ position: 'relative' }} ref={notifRef}>
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  style={{
                    position: 'relative',
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: isNotifOpen ? 'var(--primary-light)' : '#ffffff',
                    color: isNotifOpen ? 'var(--primary)' : 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  title="Connection Requests"
                >
                  <Bell size={18} />
                  {incomingRequests.length > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: -3,
                        right: -3,
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #ffffff',
                        boxShadow: '0 2px 5px rgba(239, 68, 68, 0.4)',
                        animation: 'pulse 2s infinite',
                      }}
                    >
                      {incomingRequests.length}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown Menu */}
                {isNotifOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      right: 0,
                      width: 360,
                      backgroundColor: '#ffffff',
                      borderRadius: '1rem',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                      border: '1px solid var(--border-subtle)',
                      padding: '1rem',
                      zIndex: 100,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                        Connection Requests
                      </span>
                      {incomingRequests.length > 0 && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '2px 8px', borderRadius: '10px' }}>
                          {incomingRequests.length} New
                        </span>
                      )}
                    </div>

                    {/* Feedback Toast Banner */}
                    {acceptedSuccess && (
                      <div
                        style={{
                          backgroundColor: '#ecfdf5',
                          border: '1px solid #a7f3d0',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          marginBottom: '0.75rem',
                          fontSize: '0.825rem',
                          color: '#065f46',
                        }}
                      >
                        <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
                          Connected with {acceptedSuccess}! 🎉
                        </div>
                        <button
                          onClick={() => {
                            setIsNotifOpen(false);
                            navigate('/video-call/test-room');
                          }}
                          style={{
                            backgroundColor: '#059669',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '0.3rem 0.6rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            marginTop: '0.25rem',
                          }}
                        >
                          <Video size={13} />
                          Join Study Call Now
                        </button>
                      </div>
                    )}

                    {incomingRequests.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>📭</div>
                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 500 }}>
                          No pending requests right now.
                        </p>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                          When another student requests to connect, you'll see options to accept or decline here.
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {incomingRequests.map((req) => (
                          <div
                            key={req.id}
                            style={{
                              border: '1.5px solid var(--border-subtle)',
                              borderRadius: '12px',
                              padding: '0.85rem',
                              backgroundColor: '#f8fafc',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                              <Avatar
                                src={req.requester.avatar}
                                alt={req.requester.name}
                                size="md"
                                flag={req.requester.flag}
                              />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                  {req.requester.name}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  {req.requester.country} • {req.requester.institution}
                                </div>
                              </div>
                              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>
                                ⚡ {req.compatibilityScore}%
                              </span>
                            </div>

                            {req.requester.bio && (
                              <p style={{ fontSize: '0.78rem', color: 'var(--text-body)', margin: '0 0 0.65rem', lineHeight: 1.35 }}>
                                "{req.requester.bio.slice(0, 85)}..."
                              </p>
                            )}

                            {/* Accept / Decline Action Buttons */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                              <button
                                onClick={() => handleAccept(req.id, req.requester.name)}
                                disabled={actionLoading === req.id}
                                style={{
                                  backgroundColor: '#10b981',
                                  color: '#ffffff',
                                  border: 'none',
                                  padding: '0.45rem',
                                  borderRadius: '6px',
                                  fontWeight: 700,
                                  fontSize: '0.8rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.35rem',
                                }}
                              >
                                <Check size={15} />
                                {actionLoading === req.id ? 'Accepting...' : 'Accept'}
                              </button>

                              <button
                                onClick={() => handleDecline(req.id)}
                                disabled={actionLoading === req.id}
                                style={{
                                  backgroundColor: '#ffffff',
                                  color: '#64748b',
                                  border: '1px solid #cbd5e1',
                                  padding: '0.45rem',
                                  borderRadius: '6px',
                                  fontWeight: 600,
                                  fontSize: '0.8rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.35rem',
                                }}
                              >
                                <X size={15} />
                                Decline
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Pill */}
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
