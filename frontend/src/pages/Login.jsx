import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthHero from '../components/auth/AuthHero';
import LoginForm from '../components/auth/LoginForm';
import SignUpForm from '../components/auth/SignUpForm';
import EmailVerificationModal from '../components/auth/EmailVerificationModal';
import OnboardingModal from '../components/auth/OnboardingModal';

export function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [authError, setAuthError] = useState(null);
  const [showVerification, setShowVerification] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const { login, register, loading } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async ({ email, password }) => {
    setAuthError(null);
    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setAuthError(res.error || 'Failed to sign in. Please check your email and password.');
    }
  };

  const handleSignUpSubmit = async (studentData) => {
    setAuthError(null);
    const res = await register(studentData);
    if (res.success) {
      setRegisteredEmail(studentData.email);
      // Open onboarding modal for a friendly new-student greeting
      setShowOnboarding(true);
    } else {
      setAuthError(res.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'stretch',
        backgroundColor: 'var(--bg-app)',
      }}
    >
      {/* Left Branding Hero Pane (hidden on small mobile screens) */}
      <div className="desktop-only" style={{ display: 'flex', flex: '1 1 50%', maxWidth: '50%' }}>
        <AuthHero mode={mode} />
      </div>

      {/* Right Form Container */}
      <div
        style={{
          flex: '1 1 50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2.5rem 1.5rem',
          backgroundColor: '#ffffff',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ width: '100%', maxWidth: 460 }}>
          {/* Top Mode Switcher Pill */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--bg-subtle)',
              padding: '4px',
              borderRadius: 'var(--radius-pill)',
              marginBottom: '2rem',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setAuthError(null);
              }}
              style={{
                flex: 1,
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.875rem',
                fontWeight: 700,
                backgroundColor: mode === 'login' ? '#ffffff' : 'transparent',
                color: mode === 'login' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: mode === 'login' ? 'var(--shadow-sm)' : 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setAuthError(null);
              }}
              style={{
                flex: 1,
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.875rem',
                fontWeight: 700,
                backgroundColor: mode === 'signup' ? '#ffffff' : 'transparent',
                color: mode === 'signup' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: mode === 'signup' ? 'var(--shadow-sm)' : 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Create Account
            </button>
          </div>

          {mode === 'login' ? (
            <LoginForm
              onSubmit={handleLoginSubmit}
              onToggleMode={() => {
                setMode('signup');
                setAuthError(null);
              }}
              onForgotPassword={() => setShowVerification(true)}
              loading={loading}
              error={authError}
            />
          ) : (
            <SignUpForm
              onSubmit={handleSignUpSubmit}
              onToggleMode={() => {
                setMode('login');
                setAuthError(null);
              }}
              loading={loading}
              error={authError}
            />
          )}
        </div>
      </div>

      {/* Modals for verification and onboarding */}
      <EmailVerificationModal
        isOpen={showVerification}
        onClose={() => setShowVerification(false)}
        email={registeredEmail || 'ruthvik@example.com'}
        onVerified={() => {
          setShowVerification(false);
          navigate('/dashboard');
        }}
      />

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => {
          setShowOnboarding(false);
          navigate('/dashboard');
        }}
        onContinue={() => {
          setShowOnboarding(false);
          navigate('/profile');
        }}
      />
    </div>
  );
}

export default Login;
