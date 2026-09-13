import { User, Globe, School, Clock, ArrowRight } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

export const POPULAR_COUNTRIES = [
  { name: 'India', code: 'IN', flag: '🇮🇳' },
  { name: 'United States', code: 'US', flag: '🇺🇸' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪' },
  { name: 'Brazil', code: 'BR', flag: '🇧🇷' },
  { name: 'Spain', code: 'ES', flag: '🇪🇸' },
  { name: 'France', code: 'FR', flag: '🇫🇷' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺' },
  { name: 'South Korea', code: 'KR', flag: '🇰🇷' },
  { name: 'Mexico', code: 'MX', flag: '🇲🇽' },
  { name: 'Ireland', code: 'IE', flag: '🇮🇪' },
  { name: 'Other', code: 'UN', flag: '🌐' },
];

export function BasicInfoStep({ data, onChange, onNext }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.name?.trim()) {
      alert('Please enter your full name');
      return;
    }
    if (!data.country) {
      alert('Please select your country');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
          Tell us about yourself
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Basic information helps prospective global peers know who you are.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <Input
          label="Full Name"
          value={data.name || ''}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="e.g. Ruthvik Reddy"
          icon={User}
          required
        />

        <Input
          label="Country"
          as="select"
          value={data.country || 'India'}
          onChange={(e) => {
            const selected = POPULAR_COUNTRIES.find((c) => c.name === e.target.value);
            onChange({
              country: e.target.value,
              countryCode: selected?.code || 'UN',
              flag: selected?.flag || '🌐',
            });
          }}
          icon={Globe}
          required
        >
          {POPULAR_COUNTRIES.map((c) => (
            <option key={c.code} value={c.name}>
              {c.flag} {c.name}
            </option>
          ))}
        </Input>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <Input
          label="Age"
          type="number"
          min="13"
          max="35"
          value={data.age || 19}
          onChange={(e) => onChange({ age: parseInt(e.target.value, 10) || '' })}
          placeholder="19"
          required
        />

        <Input
          label="Education Level"
          as="select"
          value={data.educationLevel || 'College / University'}
          onChange={(e) => onChange({ educationLevel: e.target.value })}
        >
          <option value="Middle School">Middle School</option>
          <option value="High School">High School (Grade 9-12)</option>
          <option value="College / University">College / University</option>
          <option value="Graduate / Master">Graduate / Master</option>
        </Input>

        <Input
          label="Timezone"
          value={data.timezone || 'Asia/Kolkata (IST +5:30)'}
          onChange={(e) => onChange({ timezone: e.target.value })}
          icon={Clock}
          placeholder="e.g. UTC, EST, JST"
        />
      </div>

      <Input
        label="College / School Name"
        value={data.institution || ''}
        onChange={(e) => onChange({ institution: e.target.value })}
        placeholder="e.g. Delhi Technological University"
        icon={School}
      />

      <Input
        label="About You"
        as="textarea"
        rows={3}
        value={data.bio || ''}
        onChange={(e) => onChange({ bio: e.target.value })}
        placeholder="Share a short introduction: what do you study, what do you enjoy, and what do you hope to learn from global friends?"
        helperText="Keep it friendly and open! Never share sensitive personal details like phone numbers or home addresses."
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
        <Button type="submit" variant="primary" size="lg" iconRight={ArrowRight}>
          Next: Choose Interests
        </Button>
      </div>
    </form>
  );
}

export default BasicInfoStep;
