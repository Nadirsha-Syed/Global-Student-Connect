import React from 'react';
import {
  Laptop,
  FlaskConical,
  Trophy,
  Palette,
  Plane,
  BookOpen,
  Globe,
  GraduationCap,
  Leaf,
  Utensils,
  Camera,
  Music,
  Gamepad2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Check,
} from 'lucide-react';
import Button from '../common/Button';
import { ALL_INTERESTS_LIST } from '../../services/mockData';

const ICON_MAP = {
  Laptop,
  FlaskConical,
  Trophy,
  Palette,
  Plane,
  BookOpen,
  Globe,
  GraduationCap,
  Leaf,
  Utensils,
  Camera,
  Music,
  Gamepad2,
  Sparkles,
};

export function InterestsStep({ selectedInterests = [], onChange, onBack, onNext }) {
  const toggleInterest = (name) => {
    if (selectedInterests.includes(name)) {
      onChange(selectedInterests.filter((i) => i !== name));
    } else {
      onChange([...selectedInterests, name]);
    }
  };

  const handleNext = () => {
    if (selectedInterests.length < 3) {
      alert('Please select at least 3 interests to ensure high quality match recommendations!');
      return;
    }
    onNext();
  };

  return (
    <div style={{ maxWidth: 740, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
          What are your interests?
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          Select at least 3 topics you love talking about to help our smart matching engine connect you.
        </p>

        {/* Selected count badge */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.85rem',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: selectedInterests.length >= 3 ? 'var(--emerald-light)' : 'var(--primary-light)',
            color: selectedInterests.length >= 3 ? 'var(--emerald)' : 'var(--primary)',
            fontSize: '0.85rem',
            fontWeight: 700,
          }}
        >
          {selectedInterests.length >= 3 ? (
            <>
              <Check size={16} />
              <span>{selectedInterests.length} topics selected (Target reached)</span>
            </>
          ) : (
            <span>{selectedInterests.length} / 3 selected (Pick {3 - selectedInterests.length} more)</span>
          )}
        </span>
      </div>

      {/* Grid of Interests */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '0.85rem',
          marginBottom: '2.5rem',
        }}
      >
        {ALL_INTERESTS_LIST.map((item) => {
          const isSelected = selectedInterests.includes(item.name);
          const Icon = ICON_MAP[item.icon] || Sparkles;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleInterest(item.name)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.25rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isSelected ? 'var(--primary-light)' : '#ffffff',
                border: isSelected ? '2px solid var(--primary)' : '1.5px solid var(--border-subtle)',
                color: isSelected ? 'var(--primary)' : 'var(--text-body)',
                boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.15)' : 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
            >
              {isSelected && (
                <span
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={12} strokeWidth={3} />
                </span>
              )}

              <Icon size={28} style={{ marginBottom: '0.6rem', color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{item.name}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="secondary" onClick={onBack} icon={ArrowLeft}>
          Back
        </Button>
        <Button variant="primary" size="lg" onClick={handleNext} iconRight={ArrowRight}>
          Next: Languages
        </Button>
      </div>
    </div>
  );
}

export default InterestsStep;
