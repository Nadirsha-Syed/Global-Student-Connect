import React from 'react';
import { Check } from 'lucide-react';

export function ProfileStepper({ steps, currentStep, onStepClick }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          maxWidth: 680,
          margin: '0 auto',
        }}
      >
        {/* Background Connecting Line */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 30,
            right: 30,
            height: 3,
            backgroundColor: 'var(--border-subtle)',
            zIndex: 0,
            transform: 'translateY(-50%)',
          }}
        />

        {/* Active Progress Line */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 30,
            width: `${((currentStep - 1) / (steps.length - 1)) * 90}%`,
            height: 3,
            backgroundColor: 'var(--primary)',
            zIndex: 0,
            transform: 'translateY(-50%)',
            transition: 'width 0.3s ease',
          }}
        />

        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div
              key={step.id || idx}
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: isCompleted ? 'pointer' : 'default',
              }}
              onClick={() => isCompleted && onStepClick?.(stepNum)}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: isCompleted
                    ? 'var(--primary)'
                    : isCurrent
                    ? '#ffffff'
                    : 'var(--bg-subtle)',
                  border: isCurrent
                    ? '3px solid var(--primary)'
                    : isCompleted
                    ? '2px solid var(--primary)'
                    : '2px solid var(--border-subtle)',
                  color: isCompleted ? '#ffffff' : isCurrent ? 'var(--primary)' : 'var(--text-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  boxShadow: isCurrent ? '0 0 0 4px var(--primary-light)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {isCompleted ? <Check size={18} /> : stepNum}
              </div>

              <span
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.8rem',
                  fontWeight: isCurrent ? 700 : 500,
                  color: isCurrent ? 'var(--primary)' : isCompleted ? 'var(--text-main)' : 'var(--text-light)',
                  whiteSpace: 'nowrap',
                }}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProfileStepper;
