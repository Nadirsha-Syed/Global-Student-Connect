import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Video,
  Globe2,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  BookOpen,
  CalendarPlus,
  AlertCircle,
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import ScheduleCallModal from '../components/matching/ScheduleCallModal';

export function Meetings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past'
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const upcomingMeeting = {
    id: 'meet-1',
    partner: {
      id: '1',
      name: 'Yuki Sato',
      country: 'Japan',
      countryCode: 'JP',
      flag: '🇯🇵',
      institution: 'Tokyo University',
      avatar: '👩‍🎨',
      languages: ['Japanese (Native)', 'English (Conversational)'],
      interests: ['Technology', 'Anime', 'Music', 'Robotics'],
    },
    date: 'Tomorrow, Sep 11, 2026',
    time: '4:00 PM – 4:45 PM (IST)',
    localTimePartner: '7:30 PM – 8:15 PM (JST)',
    topic: 'Student Life in Tokyo vs New Delhi: Campus clubs, favorite study spots, and tech projects',
    status: 'Confirmed',
    meetingLink: '/video-call',
    icebreakers: [
      'What is a typical weekday routine like at Tokyo University?',
      'Which seasonal festivals or foods are popular right now in Japan?',
      'What kind of robotics or coding projects is your campus club building?',
    ],
  };

  const pastMeetings = [
    {
      id: 'past-1',
      partner: {
        id: '4',
        name: 'Carlos Silva',
        country: 'Brazil',
        flag: '🇧🇷',
        institution: 'University of São Paulo',
        avatar: '🧑‍🌾',
      },
      date: 'September 7, 2026',
      duration: '45 mins',
      topic: 'Brazilian Coffee Culture & Environmental Tech in the Amazon',
      reflectionStatus: 'Reflection Completed',
      notesSnippet: 'Carlos gave amazing insights into how drone open-source projects help track reforestation in Brazil.',
    },
    {
      id: 'past-2',
      partner: {
        id: '5',
        name: 'Sofia Martinez',
        country: 'Spain',
        flag: '🇪🇸',
        institution: 'Autonomous University of Madrid',
        avatar: '👩‍🎓',
      },
      date: 'September 2, 2026',
      duration: '40 mins',
      topic: 'Madrid Architecture, Student Siestas & Modern Art Movements',
      reflectionStatus: 'Reflection Completed',
      notesSnippet: 'Learned about the history of Gaudí and modern architectural preservation across Spain.',
    },
  ];

  const handleActionToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      <Navbar />

      <div style={{ display: 'flex', flex: 1, maxWidth: 1440, width: '100%', margin: '0 auto' }}>
        <Sidebar unreadMeetingsCount={1} />

        <main style={{ flex: 1, padding: '2rem 1.5rem', minWidth: 0 }}>
          {/* Header Banner */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <Calendar size={24} color="var(--primary)" />
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                  My Meetings
                </h1>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Keep track of upcoming cultural video exchanges, review prep notes, and manage schedule times.
              </p>
            </div>

            <Link to="/matching" style={{ textDecoration: 'none' }}>
              <Button variant="primary" style={{ borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                <Sparkles size={16} style={{ marginRight: 6 }} />
                Find New Students
              </Button>
            </Link>
          </div>

          {/* Toast alert */}
          {toastMessage && (
            <div
              style={{
                marginBottom: '1.5rem',
                padding: '0.85rem 1.25rem',
                backgroundColor: '#ECFDF5',
                border: '1px solid #10B981',
                borderRadius: 'var(--radius-lg)',
                color: '#065F46',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.9rem',
                fontWeight: 500,
              }}
            >
              <CheckCircle2 size={18} color="#10B981" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              borderBottom: '1px solid var(--border-color)',
              marginBottom: '2rem',
            }}
          >
            <button
              onClick={() => setActiveTab('upcoming')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                fontWeight: 600,
                fontSize: '0.95rem',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === 'upcoming' ? '2px solid var(--primary)' : '2px solid transparent',
                color: activeTab === 'upcoming' ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <Clock size={16} />
              <span>Upcoming</span>
              <span
                style={{
                  backgroundColor: 'var(--primary-subtle)',
                  color: 'var(--primary)',
                  fontSize: '0.75rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                1
              </span>
            </button>

            <button
              onClick={() => setActiveTab('past')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                fontWeight: 600,
                fontSize: '0.95rem',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === 'past' ? '2px solid var(--primary)' : '2px solid transparent',
                color: activeTab === 'past' ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <CheckCircle2 size={16} />
              <span>Completed & Past</span>
              <span
                style={{
                  backgroundColor: '#F3F4F6',
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                2
              </span>
            </button>
          </div>

          {/* Tab 1: UPCOMING MEETINGS */}
          {activeTab === 'upcoming' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Spotlight Meeting Card */}
              <Card
                style={{
                  padding: '2rem',
                  borderRadius: 'var(--radius-2xl)',
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.08)',
                  border: '1px solid rgba(37, 99, 235, 0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Top highlight bar */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(90deg, var(--primary) 0%, #06B6D4 100%)',
                  }}
                />

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    <Avatar
                      src={upcomingMeeting.partner.avatar}
                      name={upcomingMeeting.partner.name}
                      flag={upcomingMeeting.partner.flag}
                      isOnline={true}
                      size="xl"
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {upcomingMeeting.partner.name}
                        </h2>
                        <span style={{ fontSize: '1.2rem' }}>{upcomingMeeting.partner.flag}</span>
                        <Badge variant="success" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10B981' }} />
                          {upcomingMeeting.status}
                        </Badge>
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        {upcomingMeeting.partner.institution} • {upcomingMeeting.partner.country}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {upcomingMeeting.partner.interests.map((it, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '0.75rem',
                              backgroundColor: 'var(--primary-subtle)',
                              color: 'var(--primary)',
                              padding: '0.2rem 0.55rem',
                              borderRadius: 'var(--radius-full)',
                              fontWeight: 600,
                            }}
                          >
                            #{it}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Primary actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: 200 }}>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => navigate('/video-call')}
                      style={{
                        borderRadius: 'var(--radius-full)',
                        padding: '0.85rem 1.5rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                      }}
                    >
                      <Video size={18} />
                      Join Video Call
                    </Button>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setRescheduleModalOpen(true)}
                        style={{ flex: 1, borderRadius: 'var(--radius-full)' }}
                      >
                        Reschedule
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleActionToast('Meeting added to your calendar!')}
                        title="Add to Calendar"
                        style={{ borderRadius: 'var(--radius-full)' }}
                      >
                        <CalendarPlus size={16} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Meeting details schedule grid */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.25rem 1.5rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.25rem',
                    marginBottom: '1.5rem',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Date & Local Time (You)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      <Clock size={16} color="var(--primary)" />
                      <span>{upcomingMeeting.date}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{upcomingMeeting.time}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Partner Local Time (Tokyo)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      <Globe2 size={16} color="#0EA5E9" />
                      <span>{upcomingMeeting.localTimePartner}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>UTC+9 JST</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Conversation Topic
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--primary-dark)', fontSize: '0.9rem', lineHeight: 1.4 }}>
                      {upcomingMeeting.topic}
                    </div>
                  </div>
                </div>

                {/* Icebreaker Suggestions */}
                <div
                  style={{
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                    <Sparkles size={16} color="var(--primary)" />
                    <span>Suggested Icebreakers & Discussion Prompts</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                    {upcomingMeeting.icebreakers.map((prompt, pIdx) => (
                      <div
                        key={pIdx}
                        style={{
                          backgroundColor: '#FFFFFF',
                          padding: '0.85rem 1rem',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid var(--border-color)',
                          fontSize: '0.85rem',
                          color: 'var(--text-main)',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.5rem',
                        }}
                      >
                        <span style={{ fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>{pIdx + 1}.</span>
                        <span style={{ lineHeight: 1.4 }}>{prompt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Cultural Exchange Tips banner */}
              <div
                style={{
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                }}
              >
                <AlertCircle size={22} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1E40AF', marginBottom: '0.25rem' }}>
                    Intercultural Exchange Best Practices
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: '#1E3A8A', lineHeight: 1.5, margin: 0 }}>
                    Speak at a relaxed pace, be curious about daily lifestyle differences, listen with empathy, and embrace moments when language practice feels new. You can both take short reflection notes after the call!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: PAST / COMPLETED MEETINGS */}
          {activeTab === 'past' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {pastMeetings.map((pm) => (
                <Card
                  key={pm.id}
                  style={{
                    padding: '1.75rem',
                    borderRadius: 'var(--radius-xl)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <Avatar src={pm.partner.avatar} name={pm.partner.name} flag={pm.partner.flag} size="lg" />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>{pm.partner.name}</h3>
                        <span style={{ fontSize: '1.1rem' }}>{pm.partner.flag}</span>
                        <Badge variant="neutral" style={{ fontSize: '0.75rem' }}>
                          {pm.duration}
                        </Badge>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        {pm.partner.institution} • {pm.partner.country} — Held on {pm.date}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.35rem' }}>
                        Topic: {pm.topic}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', maxWidth: 500 }}>
                        "{pm.notesSnippet}"
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <Link to="/reflections" style={{ textDecoration: 'none' }}>
                      <Button variant="secondary" size="sm" style={{ borderRadius: 'var(--radius-full)' }}>
                        <BookOpen size={15} style={{ marginRight: 5 }} />
                        View Reflection
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleActionToast(`Opening chat with ${pm.partner.name} (Developer 2 module)`)}
                      style={{ borderRadius: 'var(--radius-full)' }}
                    >
                      <MessageSquare size={15} style={{ marginRight: 5 }} />
                      Chat
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Reschedule Modal */}
      <ScheduleCallModal
        isOpen={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        match={upcomingMeeting.partner}
        onConfirm={(rescheduleData) => {
          setRescheduleModalOpen(false);
          handleActionToast(`Meeting rescheduled with Yuki for ${rescheduleData.date} at ${rescheduleData.time}!`);
        }}
      />
    </div>
  );
}

export default Meetings;
