import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Matching from './pages/Matching';
import Meetings from './pages/Meetings';
import Reflections from './pages/Reflections';

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
    console.error('Student UI ErrorBoundary caught:', error, errorInfo);
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

// Reserved placeholder component for Frontend Developer 2's future screens
function ReservedFeaturePlaceholder({ featureName, developerRole }) {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '4rem 1.5rem',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: 'var(--primary-subtle, #EFF6FF)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          marginBottom: '1rem',
        }}
      >
        🚀
      </div>
      <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 700 }}>
        {featureName}
      </h2>
      <p style={{ color: 'var(--text-muted)', maxWidth: 460, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
        This module is reserved for <strong>{developerRole}</strong> (Video Call UI, Chat UI, Topic/Question Interface).
      </p>
      <a href="/dashboard" className="btn btn-primary btn-sm" style={{ borderRadius: '9999px', textDecoration: 'none' }}>
        Return to Student Dashboard
      </a>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* ==================================================== */}
            {/* FRONTEND DEVELOPER 1 — STUDENT UI ROUTES             */}
            {/* ==================================================== */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/matching" element={<Matching />} />
            <Route path="/matching/:id" element={<Matching />} />
            <Route path="/settings" element={<Profile initialTab="settings" />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/reflections" element={<Reflections />} />

            {/* ==================================================== */}
            {/* FRONTEND DEVELOPER 2 — RESERVED VIDEO/CHAT ROUTES    */}
            {/* (Do not remove or overwrite Developer 2 integration)  */}
            {/* ==================================================== */}
            <Route
              path="/video-call"
              element={
                <ReservedFeaturePlaceholder
                  featureName="Video Call Screen"
                  developerRole="Frontend Developer 2"
                />
              }
            />
            <Route
              path="/chat"
              element={
                <ReservedFeaturePlaceholder
                  featureName="Real-time Chat Screen"
                  developerRole="Frontend Developer 2"
                />
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
