import React, { Component, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Matching from './pages/Matching';
import Meetings from './pages/Meetings';
import Reflections from './pages/Reflections';
import VideoCall from './pages/VideoCall';
import ReflectionPage from './pages/ReflectionPage';
import ReflectionSuccessPage from './pages/ReflectionSuccessPage';

// Error Boundary to prevent blank white screens if any subcomponent throws
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Global Student Connect ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            fontFamily: 'var(--font-sans, system-ui, sans-serif)',
            textAlign: 'center',
            backgroundColor: '#F8FAFC',
          }}
        >
          <div
            style={{
              maxWidth: 480,
              backgroundColor: '#FFFFFF',
              padding: '2.5rem',
              borderRadius: '1rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.75rem' }}>
              Something unexpected happened
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {this.state.error?.message || 'An error occurred while displaying this page.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/dashboard';
              }}
              style={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Return to Student Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Live WebRTC Video Call Route with Student Context & Post-call Navigation
function VideoCallRoute() {
  const { roomId: urlRoomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const roomId = urlRoomId || 'room-global-study-101';
  const sessionTopic = 'Global Student Exchange & Cultural Dialogue';

  // Fallback student profiles for testing when not logged in
  const currentUser = user ? {
    id: user.id || user._id,
    name: user.name,
    country: user.country,
    interests: user.interests || ['Global Studies', 'Culture'],
    languages: user.languages || ['English'],
  } : {
    id: 'student-alice',
    name: 'Alice Smith',
    country: 'Germany',
    interests: ['React', 'AI', 'Global Studies'],
    languages: ['German', 'English'],
  };

  const peerUser = {
    id: 'student-kenji',
    name: 'Kenji Sato',
    country: 'Japan',
    interests: ['System Design', 'Culture', 'Robotics'],
    languages: ['Japanese', 'English'],
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc' }}>
      <header
        style={{
          borderBottom: '1px solid #1e293b',
          padding: '0.875rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#0f172a',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '0.45rem 0.9rem',
              backgroundColor: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #334155',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            ← Dashboard
          </button>
          <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
            Active Profile: <strong style={{ color: '#38bdf8' }}>{currentUser.name} ({currentUser.country})</strong>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Room: {roomId}</span>
          <button
            onClick={() => navigate('/reflections')}
            style={{
              padding: '0.45rem 0.9rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            Reflections
          </button>
        </div>
      </header>

      <main style={{ padding: '1rem' }}>
        <VideoCall
          roomId={roomId}
          currentUser={currentUser}
          peerUser={peerUser}
          sessionTopic={sessionTopic}
          onLeave={() => navigate('/reflection')}
        />
      </main>
    </div>
  );
}

// Post-call Reflection Route
function ReflectionRoute() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <ReflectionSuccessPage
        onNavigate={(path) => navigate(path === '/' ? '/dashboard' : '/reflections')}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app, #f8fafc)' }}>
      <header
        style={{
          borderBottom: '1px solid var(--border-subtle, #e2e8f0)',
          padding: '1rem 2rem',
          backgroundColor: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-main, #0f172a)' }}>
          Global Student Connect
        </h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-outline-neutral btn-sm"
        >
          Skip to Dashboard
        </button>
      </header>
      <ReflectionPage
        onNavigate={(action) => {
          if (action === 'reflection-success') {
            setSubmitted(true);
          } else {
            navigate('/dashboard');
          }
        }}
      />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Student UI Module Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/matching" element={<Matching />} />
            <Route path="/matching/:id" element={<Matching />} />
            <Route path="/settings" element={<Profile initialTab="settings" />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/reflections" element={<Reflections />} />

            {/* Video Call & AI Co-Pilot Routes */}
            <Route path="/video-call" element={<VideoCallRoute />} />
            <Route path="/video-call/:roomId" element={<VideoCallRoute />} />

            {/* Post-Call Reflection Form Routes */}
            <Route path="/reflection" element={<ReflectionRoute />} />
            <Route path="/reflection/:sessionId" element={<ReflectionRoute />} />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
