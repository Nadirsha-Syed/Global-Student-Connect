import React from 'react';
import { UserCheck, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import Button from '../common/Button';
import Modal from '../common/Modal';

export function OnboardingModal({ isOpen, onClose, onContinue }) {
  const steps = [
    {
      icon: UserCheck,
      title: 'Tell us about you',
      desc: 'Add your country, grade level, and language proficiencies.',
      color: 'var(--primary)',
      bg: 'var(--primary-light)',
    },
    {
      icon: Sparkles,
      title: 'Add your interests',
      desc: 'Pick topics you love: tech, anime, music, sports, food & culture.',
      color: 'var(--emerald)',
      bg: 'var(--emerald-light)',
    },
    {
      icon: MapPin,
      title: 'Find your match',
      desc: 'Connect with like-minded students worldwide for video discussions.',
      color: 'var(--coral)',
      bg: '#ffe4e6',
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Welcome to Global Student Connect!" maxWidth={520}>
      <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
        <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
          Let's Get Started!
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
          A few quick steps to set up your global student profile:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', textAlign: 'left' }}>
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    backgroundColor: step.bg,
                    color: step.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                    {idx + 1}. {step.title}
                  </h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          iconRight={ArrowRight}
          onClick={onContinue}
        >
          Continue to Profile Setup
        </Button>
      </div>
    </Modal>
  );
}

export default OnboardingModal;
