import React, { useState } from 'react';
import { Plus, X, Globe2, ArrowLeft, ArrowRight } from 'lucide-react';
import Button from '../common/Button';

const SUGGESTED_LANGUAGES = [
  'English',
  'Spanish',
  'Hindi',
  'Japanese',
  'French',
  'German',
  'Mandarin',
  'Portuguese',
  'Arabic',
  'Italian',
  'Korean',
  'Russian',
];

export function LanguagesStep({ languages = [], onChange, onBack, onNext }) {
  const [customLanguage, setCustomLanguage] = useState('');

  const addLanguage = (lang) => {
    const trimmed = lang.trim();
    if (!trimmed) return;
    if (!languages.some((l) => l.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...languages, trimmed]);
    }
    setCustomLanguage('');
  };

  const removeLanguage = (lang) => {
    onChange(languages.filter((l) => l !== lang));
  };

  const handleNext = () => {
    if (languages.length === 0) {
      alert('Please add at least one language you can communicate in!');
      return;
    }
    onNext();
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
          Languages you speak
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Help us connect you with students who share conversational languages or language exchange goals.
        </p>
      </div>

      {/* Active Selected Language Tags */}
      <div
        style={{
          padding: '1.25rem',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid var(--border-subtle)',
          minHeight: 110,
          marginBottom: '1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.65rem',
        }}
      >
        {languages.map((lang) => (
          <span
            key={lang}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: '1px solid var(--primary-subtle)',
            }}
          >
            <Globe2 size={15} />
            <span>{lang}</span>
            <button
              type="button"
              onClick={() => removeLanguage(lang)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: 1,
              }}
              aria-label={`Remove ${lang}`}
            >
              <X size={15} />
            </button>
          </span>
        ))}

        {/* Inline input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flex: 1, minWidth: 160 }}>
          <input
            type="text"
            placeholder="+ Add another language..."
            value={customLanguage}
            onChange={(e) => setCustomLanguage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addLanguage(customLanguage);
              }
            }}
            style={{
              border: 'none',
              outline: 'none',
              padding: '0.4rem 0.6rem',
              fontSize: '0.9rem',
              width: '100%',
              backgroundColor: 'transparent',
            }}
          />
          {customLanguage.trim() && (
            <button
              type="button"
              onClick={() => addLanguage(customLanguage)}
              className="btn btn-primary btn-sm"
              style={{ padding: '0.35rem 0.75rem' }}
            >
              <Plus size={14} />
              Add
            </button>
          )}
        </div>
      </div>

      {/* Suggested Languages Pill List */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          Popular suggestions:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {SUGGESTED_LANGUAGES.map((item) => {
            const isAdded = languages.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => (isAdded ? removeLanguage(item) : addLanguage(item))}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: isAdded ? 'var(--bg-subtle)' : '#ffffff',
                  border: isAdded ? '1px solid var(--border-subtle)' : '1px solid var(--border-subtle)',
                  color: isAdded ? 'var(--text-light)' : 'var(--text-body)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: isAdded ? 'default' : 'pointer',
                  transition: 'all 0.1s ease',
                }}
                disabled={isAdded}
              >
                {!isAdded && <Plus size={13} />}
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="secondary" onClick={onBack} icon={ArrowLeft}>
          Back
        </Button>
        <Button variant="primary" size="lg" onClick={handleNext} iconRight={ArrowRight}>
          Next: Review & Finish
        </Button>
      </div>
    </div>
  );
}

export default LanguagesStep;
