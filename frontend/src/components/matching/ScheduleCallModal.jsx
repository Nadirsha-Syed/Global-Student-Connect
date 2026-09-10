import React, { useState } from 'react';
import { Calendar, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Avatar from '../common/Avatar';

export function ScheduleCallModal({ match, isOpen, onClose }) {
  const [selectedDate, setSelectedDate] = useState('Tomorrow, Sep 11');
  const [selectedTime, setSelectedTime] = useState('4:00 PM');
  const [isBooked, setIsBooked] = useState(false);

  if (!match) return null;

  const availableDates = [
    'Tomorrow, Sep 11',
    'Friday, Sep 12',
    'Saturday, Sep 13',
    'Sunday, Sep 14',
  ];

  const availableTimes = ['10:00 AM', '2:30 PM', '4:00 PM', '6:30 PM', '8:00 PM'];

  const handleConfirm = () => {
    setIsBooked(true);
  };

  const handleReset = () => {
    setIsBooked(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={isBooked ? 'Call Confirmed!' : `Schedule a Call with ${match.name}`}
      maxWidth={520}
    >
      {!isBooked ? (
        <div>
          {/* Partner snippet */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: 'var(--bg-app)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
            }}
          >
            <Avatar src={match.avatar} alt={match.name} size="md" flag={match.flag} />
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                {match.name} ({match.country})
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                Timezone: {match.timezone || 'JST / UTC'}
              </p>
            </div>
          </div>

          {/* Select Date */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>
              Choose a Day
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {availableDates.map((date) => (
                <button
                  key={date}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  style={{
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-md)',
                    border: selectedDate === date ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: selectedDate === date ? 'var(--primary-light)' : '#ffffff',
                    color: selectedDate === date ? 'var(--primary)' : 'var(--text-body)',
                    fontWeight: selectedDate === date ? 700 : 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>

          {/* Select Time */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>
              Choose a Convenient Time Slot (Your local time)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {availableTimes.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  style={{
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-pill)',
                    border: selectedTime === time ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: selectedTime === time ? 'var(--primary-light)' : '#ffffff',
                    color: selectedTime === time ? 'var(--primary)' : 'var(--text-body)',
                    fontWeight: selectedTime === time ? 700 : 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Confirm Button */}
          <Button variant="primary" size="lg" fullWidth icon={Calendar} onClick={handleConfirm}>
            Confirm Schedule ({selectedDate} at {selectedTime})
          </Button>
        </div>
      ) : (
        /* Section 3.4 Call Scheduled Confirmation Card */
        <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: 'var(--emerald-light)',
              color: 'var(--emerald)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <CheckCircle2 size={36} />
          </div>

          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            Call Scheduled!
          </h3>

          <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            You'll meet <strong>{match.name}</strong> on:
            <br />
            <strong style={{ color: 'var(--text-main)', fontSize: '1.05rem' }}>
              {selectedDate} at {selectedTime}
            </strong>
          </p>

          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.75rem',
              fontSize: '0.85rem',
              color: 'var(--text-body)',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <Sparkles size={16} color="var(--primary)" />
              <strong>Suggested Conversation Topic:</strong>
            </div>
            <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-muted)' }}>
              "Campus life traditions, favorite local foods, and our mutual interest in {match.interests?.[0] || 'Culture'}."
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="secondary" size="md" fullWidth onClick={handleReset}>
              Back to Matches
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth
              iconRight={ArrowRight}
              onClick={() => {
                handleReset();
                window.location.href = '/dashboard';
              }}
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default ScheduleCallModal;
