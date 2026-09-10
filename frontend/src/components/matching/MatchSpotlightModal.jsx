import React, { useState } from 'react';
import {
  ShieldCheck,
  Globe,
  Sparkles,
  Calendar,
  Send,
  UserCheck,
  Clock,
} from 'lucide-react';
import Modal from '../common/Modal';
import Badge, { MatchScoreBadge } from '../common/Badge';
import Button from '../common/Button';

export function MatchSpotlightModal({
  match,
  isOpen,
  onClose,
  onConnect,
  onSchedule,
  isConnecting = false,
  hasConnected = false,
}) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!match) return null;

  const gallery = match.gallery || [match.avatar];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Student Profile" maxWidth={620}>
      <div>
        {/* Photo Gallery with thumbnails (matching section 3.2) */}
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <div
            style={{
              width: '100%',
              height: 260,
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              backgroundColor: 'var(--bg-subtle)',
              marginBottom: '0.75rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <img
              src={gallery[activePhotoIdx] || match.avatar}
              alt={match.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {gallery.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePhotoIdx(idx)}
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    border: activePhotoIdx === idx ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <img src={img} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Name, Flag, Compatibility Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                {match.name}
              </h3>
              <span style={{ fontSize: '1.4rem' }}>{match.flag}</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {match.country} • {match.age} years • {match.educationLevel || 'University Student'}
            </p>
            {match.institution && (
              <p style={{ fontSize: '0.825rem', color: 'var(--text-light)', marginTop: '0.1rem' }}>
                🎓 {match.institution}
              </p>
            )}
          </div>

          <MatchScoreBadge score={match.matchScore} />
        </div>

        {/* Bio */}
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
          }}
        >
          <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', lineHeight: 1.5, margin: 0 }}>
            "{match.bio}"
          </p>
        </div>

        {/* Shared Interests Highlights */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <Sparkles size={16} color="var(--primary)" />
            <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
              Interests & Passions
            </strong>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {match.interests?.map((item) => {
              const isShared = match.sharedInterests?.includes(item);
              return (
                <Badge
                  key={item}
                  variant={isShared ? 'primary' : 'tag'}
                  style={{ fontWeight: isShared ? 700 : 500 }}
                >
                  {isShared && '✨ '}
                  {item}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Spoken Languages */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <Globe size={16} color="var(--teal)" />
            <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
              Spoken Languages
            </strong>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {match.languages?.map((lang) => (
              <Badge key={lang} variant="tag">
                🗣️ {lang}
              </Badge>
            ))}
          </div>
        </div>

        {/* Safety & Timezone indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--emerald-light)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--emerald-border)',
            marginBottom: '1.5rem',
            fontSize: '0.8rem',
            color: 'var(--emerald)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} />
            <strong>Verified Global Student</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
            <Clock size={14} />
            <span>{match.timezone || 'UTC'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <Button
            variant={hasConnected ? 'secondary' : 'primary'}
            size="lg"
            fullWidth
            onClick={() => onConnect?.(match)}
            loading={isConnecting}
            disabled={hasConnected}
            icon={hasConnected ? UserCheck : Send}
          >
            {hasConnected ? 'Connection Sent' : 'Connect'}
          </Button>

          <Button
            variant="outline"
            size="lg"
            fullWidth
            icon={Calendar}
            onClick={() => {
              onClose();
              onSchedule?.(match);
            }}
          >
            Schedule a Call
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default MatchSpotlightModal;
