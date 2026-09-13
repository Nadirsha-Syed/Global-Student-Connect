import React from 'react';
import { Mail, ArrowLeft, RefreshCw, ExternalLink } from 'lucide-react';
import Button from '../common/Button';
import Modal from '../common/Modal';

export function EmailVerificationModal({ isOpen, onClose, email = 'ruthvik@example.com', onVerified }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Verify Your Student Email" maxWidth={480}>
      <div style={{ textAlign: 'center', padding: '1rem 0.5rem' }}>
        {/* Blue mail envelope icon */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
          }}
        >
          <Mail size={36} />
        </div>

        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Check Your Email
        </h3>

        <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          We've sent an educational verification link to:
          <br />
          <strong style={{ color: 'var(--text-main)' }}>{email}</strong>
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon={ExternalLink}
            onClick={onVerified}
          >
            Open Email & Verify
          </Button>

          <Button
            variant="ghost"
            size="sm"
            icon={RefreshCw}
            onClick={() => alert('Verification email resent!')}
          >
            Resend Email
          </Button>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to login</span>
        </button>
      </div>
    </Modal>
  );
}

export default EmailVerificationModal;
