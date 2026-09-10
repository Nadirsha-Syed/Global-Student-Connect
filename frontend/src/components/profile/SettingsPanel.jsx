import React, { useState } from 'react';
import {
  Lock,
  Shield,
  Bell,
  HelpCircle,
  Check,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

export function SettingsPanel() {
  const [activeTab, setActiveTab] = useState('privacy');
  const [profileVisibility, setProfileVisibility] = useState('matched'); // 'all' | 'matched'
  const [meetingReminders, setMeetingReminders] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div style={{ maxWidth: 840, margin: '0 auto' }}>
      {saveToast && (
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--emerald-light)',
            color: 'var(--emerald)',
            border: '1px solid var(--emerald-border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            fontWeight: 600,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Check size={18} />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem' }}>
        {/* Settings Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {[
            { id: 'privacy', label: 'Privacy & Safety', icon: Shield },
            { id: 'account', label: 'Account', icon: Lock },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'support', label: 'Help & Support', icon: HelpCircle },
          ].map((item) => {
            const Icon = item.icon;
            const isCurrent = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isCurrent ? 'var(--primary-light)' : '#ffffff',
                  color: isCurrent ? 'var(--primary)' : 'var(--text-body)',
                  fontWeight: isCurrent ? 700 : 500,
                  fontSize: '0.9rem',
                  border: isCurrent ? '1px solid var(--primary-subtle)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <Card style={{ padding: '1.75rem' }}>
          {activeTab === 'privacy' && (
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                Privacy & Student Safety
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Manage how your profile and activity are viewed across our global network.
              </p>

              <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: profileVisibility === 'matched' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: profileVisibility === 'matched' ? 'var(--primary-light)' : '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="visibility"
                    checked={profileVisibility === 'matched'}
                    onChange={() => setProfileVisibility('matched')}
                    style={{ marginTop: 3, accentColor: 'var(--primary)' }}
                  />
                  <div>
                    <strong style={{ fontSize: '0.925rem', color: 'var(--text-main)', display: 'block' }}>
                      Recommended: Matched Students Only
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Only students who match with you can view your detailed introduction and request calls.
                    </span>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: profileVisibility === 'all' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: profileVisibility === 'all' ? 'var(--primary-light)' : '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="visibility"
                    checked={profileVisibility === 'all'}
                    onChange={() => setProfileVisibility('all')}
                    style={{ marginTop: 3, accentColor: 'var(--primary)' }}
                  />
                  <div>
                    <strong style={{ fontSize: '0.925rem', color: 'var(--text-main)', display: 'block' }}>
                      Public to Community
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Visible in student directory search for students from all participating universities.
                    </span>
                  </div>
                </label>
              </div>

              <div
                style={{
                  padding: '0.9rem',
                  backgroundColor: '#fffbeb',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #fef3c7',
                  color: '#92400e',
                  fontSize: '0.825rem',
                  display: 'flex',
                  gap: '0.6rem',
                  marginBottom: '1.5rem',
                }}
              >
                <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                <span>
                  Our platform strictly prevents sharing personal phone numbers, physical addresses, or financial information. All meetings are held inside our secure in-browser video room.
                </span>
              </div>

              <Button variant="primary" size="md" onClick={handleSave}>
                Save Privacy Settings
              </Button>
            </div>
          )}

          {activeTab === 'account' && (
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                Account Settings
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Manage login credentials and authentication preferences.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                    Registered Student Email
                  </label>
                  <input
                    type="text"
                    disabled
                    value="ruthvik@example.com"
                    className="input-field"
                    style={{ backgroundColor: 'var(--bg-subtle)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                    Current Password
                  </label>
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                    New Password
                  </label>
                  <input type="password" placeholder="Enter at least 8 characters" className="input-field" />
                </div>
              </div>

              <Button variant="primary" size="md" onClick={handleSave}>
                Update Password
              </Button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                Notification Preferences
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Choose what alerts and reminders you receive.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'block' }}>
                      Email Notifications
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Receive email when a student accepts your connection request.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: 'var(--primary)' }}
                  />
                </label>

                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'block' }}>
                      Meeting Reminders
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Receive reminders 1 hour before scheduled video sessions.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={meetingReminders}
                    onChange={(e) => setMeetingReminders(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: 'var(--primary)' }}
                  />
                </label>
              </div>

              <Button variant="primary" size="md" onClick={handleSave}>
                Save Preferences
              </Button>
            </div>
          )}

          {activeTab === 'support' && (
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                Help & Community Support
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Get help with your student account or report an issue.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ padding: '1rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                    Frequently Asked Questions
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Learn how matching works, how calls are scheduled, and video call tips.
                  </p>
                  <Button variant="outline" size="sm" iconRight={ExternalLink}>
                    View FAQ
                  </Button>
                </div>

                <div style={{ padding: '1rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                    Contact Support Team
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Need assistance or encountering a technical bug? Our student moderation team is here.
                  </p>
                  <Button variant="secondary" size="sm">
                    Open Support Ticket
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default SettingsPanel;
