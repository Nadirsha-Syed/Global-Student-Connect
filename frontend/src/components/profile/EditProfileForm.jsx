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

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
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
              src={formData.avatar}
              alt={formData.name}
              size="xl"
              flag={formData.flag}
              isOnline={true}
            />
            <button
              type="button"
              onClick={() => {
                // Cycle avatar for easy interactive preview
                const currentIdx = sampleAvatars.indexOf(formData.avatar);
                const nextAvatar = sampleAvatars[(currentIdx + 1) % sampleAvatars.length];
                handleChange({ avatar: nextAvatar });
              }}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                border: '2px solid #ffffff',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
              }}
              title="Click to cycle sample student photo"
            >
              <Camera size={16} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              const currentIdx = sampleAvatars.indexOf(formData.avatar);
              const nextAvatar = sampleAvatars[(currentIdx + 1) % sampleAvatars.length];
              handleChange({ avatar: nextAvatar });
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Change Photo
          </button>
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
