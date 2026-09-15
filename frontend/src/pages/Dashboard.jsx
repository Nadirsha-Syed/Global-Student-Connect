import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Users,
  Calendar,
  BookOpen,
  Globe,
  ArrowRight,
  Video,
  CheckCircle,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { matchingService } from '../services/matchingService';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import { LoadingSpinner } from '../components/common/EmptyState';
import MatchCard from '../components/matching/MatchCard';
import MatchSpotlightModal from '../components/matching/MatchSpotlightModal';

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [connectedMap, setConnectedMap] = useState({});
  const [connectingMap, setConnectingMap] = useState({});
  const [feedbackToast, setFeedbackToast] = useState(null);

  const [incomingRequests, setIncomingRequests] = useState([]);

  const loadDashboardData = async () => {
    setLoadingMatches(true);
    try {
      const [recsRes, incRes] = await Promise.all([
        matchingService.getRecommendations(),
        matchingService.getIncomingRequests(),
      ]);
      if (recsRes.success) {
        const myId = (user?._id || user?.id || '').toString();
        const myEmail = (user?.email || '').toLowerCase();
        const filtered = (recsRes.matches || []).filter((m) => {
          const mId = (m._id || m.id || '').toString();
          const mEmail = (m.email || '').toLowerCase();
          if (myId && mId === myId) return false;
          if (myEmail && mEmail === myEmail) return false;
          if (user?.name && m.name === user.name) return false;
          return true;
        });
        setRecommendations(filtered);
      }
      if (incRes.success) {
        setIncomingRequests(incRes.requests || []);
      }
    } finally {
      setLoadingMatches(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(async () => {
      const incRes = await matchingService.getIncomingRequests();
      if (incRes.success) setIncomingRequests(incRes.requests || []);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleConnect = async (student) => {
    setConnectingMap((prev) => ({ ...prev, [student.id]: true }));
    const res = await matchingService.requestConnection(student.id);
    setConnectingMap((prev) => ({ ...prev, [student.id]: false }));
    if (res.success) {
      setConnectedMap((prev) => ({ ...prev, [student.id]: true }));
      setFeedbackToast(`Connection request sent to ${student.name}!`);
      setTimeout(() => setFeedbackToast(null), 3500);
    }
  };

  const handleAcceptRequest = async (req) => {
    const res = await matchingService.acceptRequest(req.id);
    if (res.success) {
      setFeedbackToast(`Connected with ${req.requester.name}! 🎉`);
      setIncomingRequests((prev) => prev.filter((r) => r.id !== req.id));
      setTimeout(() => setFeedbackToast(null), 4000);
    }
  };

  const handleDeclineRequest = async (reqId) => {
    const res = await matchingService.declineRequest(reqId);
    if (res.success) {
      setIncomingRequests((prev) => prev.filter((r) => r.id !== reqId));
    }
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const studentName = user?.name?.split(' ')[0] || 'Elena';
  const completion = user?.completionPercentage || 100;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content-wrapper">
        <Navbar />

        <main className="page-container">
          {/* Toast Notification */}
          {feedbackToast && (
            <div
              style={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 100,
                backgroundColor: 'var(--emerald)',
                color: '#ffffff',
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-pill)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: 'var(--shadow-lg)',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              <CheckCircle size={18} />
              <span>{feedbackToast}</span>
            </div>
          )}

          {/* 1. Greeting & Hero Header */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
              {getTimeGreeting()}, {studentName}! 👋
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.975rem' }}>
              Ready to connect with global students and explore new cultures today?
            </p>
          </div>

          {/* Incoming Connection Requests Banner */}
          {incomingRequests.length > 0 && (
            <div
              style={{
                backgroundColor: '#eff6ff',
                border: '1.5px solid #3b82f6',
                borderRadius: '1rem',
                padding: '1.25rem 1.5rem',
                marginBottom: '2rem',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.25rem',
                boxShadow: '0 4px 15px rgba(37,99,235,0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Avatar
                  src={incomingRequests[0].requester.avatar}
                  name={incomingRequests[0].requester.name}
                  flag={incomingRequests[0].requester.flag}
                  size="lg"
                  isOnline={true}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '1.1rem', color: '#1e3a8a' }}>
                      {incomingRequests[0].requester.name} sent you a connection request!
                    </strong>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: '#dbeafe',
                        color: '#1d4ed8',
                        padding: '2px 8px',
                        borderRadius: '10px',
                      }}
                    >
                      ⚡ {incomingRequests[0].compatibilityScore}% Compatibility
                    </span>
                  </div>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#475569' }}>
                    {incomingRequests[0].requester.country} • {incomingRequests[0].requester.institution}
                  </p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                    Interests: {incomingRequests[0].requester.interests.slice(0, 3).join(', ')}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button
                  onClick={() => handleAcceptRequest(incomingRequests[0])}
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.6rem 1.25rem',
                    borderRadius: 'var(--radius-pill)',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
                  }}
                >
                  Accept Request ✓
                </button>
                <button
                  onClick={() => handleDeclineRequest(incomingRequests[0].id)}
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#64748b',
                    border: '1px solid #cbd5e1',
                    padding: '0.6rem 1.25rem',
                    borderRadius: 'var(--radius-pill)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  Decline
                </button>
              </div>
            </div>
          )}

          {/* 2. Profile Completion Banner Card (Matching Section 2.3) */}
          <Card
            style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)',
              border: '1.5px solid var(--emerald-border)',
              padding: '1.5rem',
              marginBottom: '2rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.25rem',
            }}
          >
            <div style={{ flex: '1 1 340px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={20} color="var(--primary)" />
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>
                    Profile Completion: {completion}%
                  </strong>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--emerald)' }}>
                  {completion === 100 ? 'Verified & Complete' : 'Boost your match accuracy!'}
                </span>
              </div>

              {/* Progress track */}
              <div
                style={{
                  height: 10,
                  width: '100%',
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  borderRadius: 5,
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${completion}%`,
                    background: 'linear-gradient(90deg, #2563eb, #10b981)',
                    borderRadius: 5,
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>

              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Add more interests or spoken languages to unlock personalized cultural matches.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/profile')}
              iconRight={ArrowRight}
            >
              Complete Profile
            </Button>
          </Card>

          {/* 3. Quick Stats Row (4 cards matching section 2.3) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2.5rem',
            }}
          >
            {/* Total Matches */}
            <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '14px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Users size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>
                  TOTAL MATCHES
                </span>
                <strong style={{ fontSize: '1.6rem', color: 'var(--text-main)', fontWeight: 800 }}>
                  {user?.stats?.totalMatches ?? 1}
                </strong>
              </div>
            </Card>

            {/* Upcoming Call */}
            <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '14px',
                  backgroundColor: 'var(--emerald-light)',
                  color: 'var(--emerald)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Calendar size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>
                  UPCOMING CALL
                </span>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 800, display: 'block' }}>
                  {user?.upcomingCall?.date || 'Tomorrow 4:00 PM'}
                </strong>
              </div>
            </Card>

            {/* Reflections */}
            <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '14px',
                  backgroundColor: '#faf5ff',
                  color: 'var(--purple)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BookOpen size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>
                  REFLECTIONS
                </span>
                <strong style={{ fontSize: '1.6rem', color: 'var(--text-main)', fontWeight: 800 }}>
                  {user?.stats?.reflections ?? 1}
                </strong>
              </div>
            </Card>

            {/* Countries Connected */}
            <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '14px',
                  backgroundColor: '#f0fdfa',
                  color: 'var(--teal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Globe size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>
                  COUNTRIES
                </span>
                <strong style={{ fontSize: '1.6rem', color: 'var(--text-main)', fontWeight: 800 }}>
                  {user?.stats?.countriesConnected ?? 2}
                </strong>
              </div>
            </Card>
          </div>

          {/* 4. Upcoming Call Highlight Spotlight Card */}
          {user?.upcomingCall && (
            <Card
              style={{
                marginBottom: '2.5rem',
                borderLeft: '4px solid var(--primary)',
                padding: '1.5rem',
                backgroundColor: '#ffffff',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Avatar
                    src={user.upcomingCall.partnerAvatar}
                    alt={user.upcomingCall.partnerName}
                    size="lg"
                    flag={user.upcomingCall.partnerFlag}
                  />
                  <div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--primary)',
                        backgroundColor: 'var(--primary-light)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-pill)',
                        textTransform: 'uppercase',
                      }}
                    >
                      Next Scheduled Conversation
                    </span>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: '0.3rem 0 0.15rem' }}>
                      Call with {user.upcomingCall.partnerName} ({user.upcomingCall.partnerCountry})
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                      🗓️ <strong>{user.upcomingCall.date}</strong> • Topic: "
                      {user.upcomingCall.topic}"
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to="/video-call" className="btn btn-primary btn-sm">
                    <Video size={16} />
                    <span>Join Video Room</span>
                  </Link>
                </div>
              </div>
            </Card>
          )}

          {/* 5. "Recommended for you" Section (Matching Section 2.3) */}
          <section style={{ marginBottom: '3rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Recommended for you
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Students sharing your passions in technology, science, and languages.
                </p>
              </div>

              <Link
                to="/matching"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                }}
              >
                <span>Explore All Matches</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {loadingMatches ? (
              <LoadingSpinner text="Finding top matches for you..." />
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {recommendations.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    compact={true}
                    onViewProfile={() => setSelectedMatch(match)}
                    onConnect={handleConnect}
                    isConnecting={connectingMap[match.id]}
                    hasConnected={connectedMap[match.id]}
                  />
                ))}
              </div>
            )}
          </section>

          {/* 6. What Can I Do Next? Guide */}
          <section>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
              Quick Actions
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div
                onClick={() => navigate('/matching')}
                style={{
                  padding: '1.25rem',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: 'var(--shadow-sm)',
                }}
                className="card-hover"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <Users size={20} color="var(--primary)" />
                  <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Find New Students</strong>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                  Search by country, languages, and shared passions.
                </p>
              </div>

              <div
                onClick={() => navigate('/profile')}
                style={{
                  padding: '1.25rem',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: 'var(--shadow-sm)',
                }}
                className="card-hover"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <Sparkles size={20} color="var(--emerald)" />
                  <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Update Interests</strong>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                  Refine your topics to get even closer compatibility scores.
                </p>
              </div>

              <div
                onClick={() => navigate('/settings')}
                style={{
                  padding: '1.25rem',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: 'var(--shadow-sm)',
                }}
                className="card-hover"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <ShieldCheck size={20} color="var(--purple)" />
                  <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Privacy & Safety</strong>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                  Configure your profile visibility and meeting notifications.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Match Spotlight Modal */}
      <MatchSpotlightModal
        match={selectedMatch}
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        onConnect={handleConnect}
        isConnecting={selectedMatch ? connectingMap[selectedMatch.id] : false}
        hasConnected={selectedMatch ? connectedMap[selectedMatch.id] : false}
        onSchedule={() => {
          setSelectedMatch(null);
          alert('Meeting scheduling request initialized. This connects with Member 4 scheduling API!');
        }}
      />
    </div>
  );
}

export default Dashboard;
