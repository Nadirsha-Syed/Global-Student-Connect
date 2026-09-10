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
import Avatar from '../common/Avatar';

export function MatchSpotlightModal({
  match,
  isOpen,
  onClose,
  onConnect,
  onSchedule,
  isConnecting = false,
  hasConnected = false,
}) {
  if (!match) return null;

  const gallery = match.gallery || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Student Profile" maxWidth={620}>
      <div>
        {/* Student Emoji Character Spotlight Card */}
        <div
          style={{
            marginBottom: '1.5rem',
            textAlign: 'center',
            padding: '1.75rem 1rem',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
            border: '1px solid rgba(37, 99, 235, 0.15)',
          }}
        >
          <Avatar
            emoji={match.avatar}
            name={match.name}
            flag={match.flag}
            size="xl"
            isOnline={true}
            style={{ marginBottom: '0.85rem' }}
          />
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            {match.name} {match.flag}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            {match.institution} • {match.country}
          </div>

          {/* Cultural interests & passions pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
            {gallery.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: 'var(--primary-dark)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--border-color)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
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
