import React from 'react';
import { CheckCircle2, ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Avatar from '../common/Avatar';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

export function ProfileReviewStep({ profileData, onBack, onComplete, loading }) {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            backgroundColor: 'var(--emerald-light)',
            color: 'var(--emerald)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem',
          }}
        >
          <CheckCircle2 size={32} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
          You're all set!
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Review your student profile card before finding your matches.
        </p>
      </div>

      {/* Summary Card */}
      <Card style={{ marginBottom: '2rem', padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <Avatar
            src={profileData.avatar}
            alt={profileData.name}
            size="lg"
            flag={profileData.flag}
            isOnline={true}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                {profileData.name || 'Ruthvik Reddy'}
              </h4>
              <Badge variant="primary">
                <ShieldCheck size={14} />
                Verified Student
              </Badge>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {profileData.country} • {profileData.age} years • {profileData.educationLevel}
            </p>
            {profileData.institution && (
              <p style={{ fontSize: '0.825rem', color: 'var(--text-light)', marginTop: '0.1rem' }}>
                🎓 {profileData.institution}
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        {profileData.bio && (
          <div style={{ marginBottom: '1.5rem', backgroundColor: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
              "{profileData.bio}"
            </p>
          </div>
        )}

        {/* Interests */}
        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
            YOUR TOP INTERESTS
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {profileData.interests?.map((item) => (
              <Badge key={item} variant="tag">
                <Sparkles size={12} style={{ color: 'var(--primary)' }} />
                {item}
              </Badge>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div>
          <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
            SPOKEN LANGUAGES
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {profileData.languages?.map((lang) => (
              <Badge key={lang} variant="primary">
                🗣️ {lang}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="secondary" onClick={onBack} icon={ArrowLeft}>
          Edit Info
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={onComplete}
          loading={loading}
          iconRight={ArrowRight}
        >
          Complete & Explore Matches
        </Button>
      </div>
    </div>
  );
}

export default ProfileReviewStep;
