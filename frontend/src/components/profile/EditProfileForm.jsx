import React, { useState } from 'react';
import { Camera, CheckCircle, Save } from 'lucide-react';
import Avatar from '../common/Avatar';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { POPULAR_COUNTRIES } from './BasicInfoStep';

export function EditProfileForm({ profile, onSave, loading }) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    country: profile?.country || 'India',
    countryCode: profile?.countryCode || 'IN',
    flag: profile?.flag || '🇮🇳',
    age: profile?.age || 19,
    educationLevel: profile?.educationLevel || 'College / University',
    institution: profile?.institution || '',
    bio: profile?.bio || '',
    avatar: profile?.avatar || '',
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    setSavedSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await onSave(formData);
    if (res?.success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    }
  };

  const studentEmojiOptions = [
    { emoji: '🧑‍💻', label: 'Tech / Coding' },
    { emoji: '👩‍🎓', label: 'Scholar' },
    { emoji: '👨‍🎨', label: 'Art & Design' },
    { emoji: '👩‍🔬', label: 'Science' },
    { emoji: '🧑‍🌾', label: 'Ecology' },
    { emoji: '🧑‍🚀', label: 'Engineering' },
    { emoji: '👩‍💻', label: 'Developer' },
    { emoji: '👨‍🎓', label: 'Graduate' },
    { emoji: '🧕', label: 'Culture' },
    { emoji: '👱‍♂️', label: 'Sports' },
    { emoji: '👩‍🎨', label: 'Music' },
    { emoji: '👨‍💻', label: 'Robotics' },
  ];

  return (
    <Card style={{ maxWidth: 720, margin: '0 auto', padding: '2rem' }}>
      {savedSuccess && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.85rem 1rem',
            backgroundColor: 'var(--emerald-light)',
            border: '1px solid var(--emerald-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--emerald)',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
          }}
        >
          <CheckCircle size={20} />
          <span>Your profile changes have been saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Avatar section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '2rem',
            textAlign: 'center',
          }}
        >
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.75rem' }}>
            <Avatar
              emoji={formData.avatar}
              name={formData.name}
              size="xl"
              flag={formData.flag}
              isOnline={true}
            />
          </div>
          
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Choose Your Student Emoji Character
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.5rem',
              maxWidth: 420,
              margin: '0 auto',
            }}
          >
            {studentEmojiOptions.map((opt) => {
              const isSelected = formData.avatar === opt.emoji;
              return (
                <button
                  key={opt.emoji}
                  type="button"
                  onClick={() => handleChange({ avatar: opt.emoji })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    backgroundColor: isSelected ? 'var(--primary-subtle)' : '#FFFFFF',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? 700 : 500,
                    transition: 'all 0.15s ease',
                  }}
                  title={opt.label}
                >
                  <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{opt.emoji}</span>
                  <span style={{ color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => handleChange({ name: e.target.value })}
            required
          />

          <Input
            label="Country"
            as="select"
            value={formData.country}
            onChange={(e) => {
              const selected = POPULAR_COUNTRIES.find((c) => c.name === e.target.value);
              handleChange({
                country: e.target.value,
                countryCode: selected?.code || 'UN',
                flag: selected?.flag || '🌐',
              });
            }}
            required
          >
            {POPULAR_COUNTRIES.map((c) => (
              <option key={c.code} value={c.name}>
                {c.flag} {c.name}
              </option>
            ))}
          </Input>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <Input
            label="Age"
            type="number"
            min="13"
            max="35"
            value={formData.age}
            onChange={(e) => handleChange({ age: parseInt(e.target.value, 10) || '' })}
            required
          />

          <Input
            label="Education"
            as="select"
            value={formData.educationLevel}
            onChange={(e) => handleChange({ educationLevel: e.target.value })}
          >
            <option value="Middle School">Middle School</option>
            <option value="High School">High School</option>
            <option value="College / University">College / University</option>
            <option value="Graduate / Master">Graduate / Master</option>
          </Input>
        </div>

        <Input
          label="College / School"
          value={formData.institution}
          onChange={(e) => handleChange({ institution: e.target.value })}
          placeholder="Your current institution"
        />

        <Input
          label="About You"
          as="textarea"
          rows={3}
          value={formData.bio}
          onChange={(e) => handleChange({ bio: e.target.value })}
          placeholder="Tell other students what you are excited to chat about..."
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <Button type="submit" variant="primary" size="lg" loading={loading} icon={Save}>
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default EditProfileForm;
