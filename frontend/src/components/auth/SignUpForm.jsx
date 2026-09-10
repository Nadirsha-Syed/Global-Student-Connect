import React, { useState } from 'react';
import { User, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

export function SignUpForm({ onSubmit, onToggleMode, loading, error }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!name.trim()) errors.name = 'Full name is required';
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      errors.terms = 'You must agree to the Student Safety Guidelines';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ name, email, password });
    }
  };

  return (
    <div style={{ maxWidth: 440, width: '100%', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
          Create Account
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Join students from 100+ countries on Global Student Connect.
        </p>
      </div>

      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-md)',
            color: 'var(--coral)',
            fontSize: '0.875rem',
            marginBottom: '1.25rem',
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Full Name"
          type="text"
          id="signup-name"
          placeholder="e.g. Ruthvik Reddy"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: null });
          }}
          icon={User}
          error={fieldErrors.name}
          required
        />

        <Input
          label="Email"
          type="email"
          id="signup-email"
          placeholder="student@university.edu"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: null });
          }}
          icon={Mail}
          error={fieldErrors.email}
          required
        />

        <Input
          label="Password"
          type="password"
          id="signup-password"
          placeholder="Create a strong password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: null });
          }}
          icon={Lock}
          error={fieldErrors.password}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          id="signup-confirm-password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: null });
          }}
          icon={Lock}
          error={fieldErrors.confirmPassword}
          required
        />

        <div style={{ marginBottom: '1.5rem', fontSize: '0.825rem' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-body)' }}>
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              style={{ width: 16, height: 16, marginTop: 2, accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            <span>
              I agree to the <strong>Safe Community Guidelines</strong> and educational code of conduct.
            </span>
          </label>
          {fieldErrors.terms && <p className="input-error-msg">{fieldErrors.terms}</p>}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          icon={UserPlus}
          style={{ marginBottom: '1.25rem' }}
        >
          Sign Up
        </Button>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            margin: '1.25rem 0',
            color: 'var(--text-light)',
            fontSize: '0.8rem',
          }}
        >
          <span style={{ flex: 1, height: 1, backgroundColor: 'var(--border-subtle)' }} />
          <span>or continue with</span>
          <span style={{ flex: 1, height: 1, backgroundColor: 'var(--border-subtle)' }} />
        </div>

        {/* Google Continue Button */}
        <button
          type="button"
          onClick={() => onSubmit({ name: 'Ruthvik Reddy', email: 'ruthvik@example.com', password: 'password123' })}
          className="btn btn-outline-neutral btn-full"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            padding: '0.75rem',
            marginBottom: '1.5rem',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onToggleMode}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: 'inherit',
            }}
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
}

export default SignUpForm;
