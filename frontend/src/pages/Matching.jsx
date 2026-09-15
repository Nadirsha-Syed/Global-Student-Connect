import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Bell, Video, UserCheck, Send } from 'lucide-react';
import { matchingService } from '../services/matchingService';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import MatchCard from '../components/matching/MatchCard';
import MatchFilterBar from '../components/matching/MatchFilterBar';
import MatchSpotlightModal from '../components/matching/MatchSpotlightModal';
import ScheduleCallModal from '../components/matching/ScheduleCallModal';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { EmptyState, LoadingSpinner } from '../components/common/EmptyState';

export function Matching() {
  const { user } = useAuth();
  const { id: routeMatchId } = useParams();
  const navigate = useNavigate();

  const [allMatches, setAllMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('for-you'); // 'for-you' | 'all' | 'requests'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All Countries');
  const [selectedInterest, setSelectedInterest] = useState('All Interests');

  const [spotlightMatch, setSpotlightMatch] = useState(null);
  const [scheduleTarget, setScheduleTarget] = useState(null);
  const [connectedMap, setConnectedMap] = useState({});
  const [connectingMap, setConnectingMap] = useState({});
  const [feedbackToast, setFeedbackToast] = useState(null);

  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);

  const loadRequests = async () => {
    try {
      const [inc, out] = await Promise.all([
        matchingService.getIncomingRequests(),
        matchingService.getOutgoingRequests(),
      ]);
      if (inc.success) setIncomingRequests(inc.requests || []);
      if (out.success) setOutgoingRequests(out.requests || []);
    } catch {
      // Ignore background network blips
    }
  };

  useEffect(() => {
    async function loadMatches() {
      setLoading(true);
      try {
        const res = await matchingService.getAllMatches();
        if (res.success) {
          const myId = (user?._id || user?.id || '').toString();
          const myEmail = (user?.email || '').toLowerCase();
          const filtered = (res.matches || []).filter((m) => {
            const mId = (m._id || m.id || '').toString();
            const mEmail = (m.email || '').toLowerCase();
            if (myId && mId === myId) return false;
            if (myEmail && mEmail === myEmail) return false;
            if (user?.name && m.name === user.name) return false;
            return true;
          });
          setAllMatches(filtered);

          if (routeMatchId) {
            const found = filtered.find((m) => m.id === routeMatchId || m._id === routeMatchId);
            if (found) setSpotlightMatch(found);
          }
        }
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
    loadRequests();

    // Auto-poll requests every 4 seconds for instant cross-tab notification
    const timer = setInterval(loadRequests, 4000);
    return () => clearInterval(timer);
  }, [routeMatchId]);

  const handleConnect = async (student) => {
    const studentId = student.id || student._id;
    setConnectingMap((prev) => ({ ...prev, [studentId]: true }));
    const res = await matchingService.requestConnection(studentId);
    setConnectingMap((prev) => ({ ...prev, [studentId]: false }));

    if (res.success) {
      setConnectedMap((prev) => ({ ...prev, [studentId]: true }));
      setFeedbackToast(`Connection request sent to ${student.name}!`);
      loadRequests();
      setTimeout(() => setFeedbackToast(null), 3500);
    }
  };

  const handleAccept = async (studentOrReq) => {
    let reqId;
    let studentName;

    if (studentOrReq.requester) {
      reqId = studentOrReq.id || studentOrReq._id;
      studentName = studentOrReq.requester.name;
    } else {
      const studentId = studentOrReq.id || studentOrReq._id;
      const found = incomingRequests.find((r) => r.requester?.id === studentId || r.requester?._id === studentId);
      reqId = found?.id || found?._id;
      studentName = studentOrReq.name;
    }

    if (!reqId) return;

    const res = await matchingService.acceptRequest(reqId);
    if (res.success) {
      setFeedbackToast(`You are now connected with ${studentName}! 🎉`);
      loadRequests();
      setTimeout(() => setFeedbackToast(null), 4000);
    }
  };

  const handleDecline = async (reqId) => {
    const res = await matchingService.declineRequest(reqId);
    if (res.success) {
      setFeedbackToast('Connection request declined.');
      loadRequests();
      setTimeout(() => setFeedbackToast(null), 3000);
    }
  };

  const getConnectionState = (match) => {
    const matchId = match.id || match._id;
    // Check if peer sent request to active student
    const isIncoming = incomingRequests.some((r) => r.requester?.id === matchId || r.requester?._id === matchId);
    if (isIncoming) return 'incoming_pending';

    // Check if active student sent request to peer
    const outgoing = outgoingRequests.find((r) => (r.receiverId?._id || r.receiverId) === matchId);
    if (outgoing) {
      return outgoing.status === 'accepted' ? 'accepted' : 'outgoing_pending';
    }

    if (connectedMap[matchId]) return 'outgoing_pending';
    return 'none';
  };

  // Filter and Sort Logic
  const filteredMatches = allMatches.filter((match) => {
    if (selectedCountry && selectedCountry !== 'All Countries') {
      if (match.country.toLowerCase() !== selectedCountry.toLowerCase()) return false;
    }

    if (selectedInterest && selectedInterest !== 'All Interests') {
      const matchLower = selectedInterest.toLowerCase();
      const hasInterest = match.interests.some((i) => i.toLowerCase().includes(matchLower));
      if (!hasInterest) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        match.name.toLowerCase().includes(q) ||
        match.country.toLowerCase().includes(q) ||
        match.interests.some((i) => i.toLowerCase().includes(q)) ||
        match.languages.some((l) => l.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    return true;
  });

  const sortedMatches = [...filteredMatches].sort((a, b) => {
    if (activeTab === 'for-you') {
      return b.matchScore - a.matchScore;
    }
    return a.name.localeCompare(b.name);
  });

  const handleClearFilters = () => {
    setSelectedCountry('All Countries');
    setSelectedInterest('All Interests');
    setSearchQuery('');
  };

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

          {/* Header Title */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Find Your Global Match
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Discover authentic international students who share your exact interests and curiosity.
            </p>
          </div>

          {/* Prominent Incoming Request Banner if pending */}
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
                    <Badge variant="primary">⚡ {incomingRequests[0].compatibilityScore}% Compatibility</Badge>
                  </div>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#475569' }}>
                    {incomingRequests[0].requester.country} • {incomingRequests[0].requester.institution}
                  </p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                    Shared interests: {incomingRequests[0].requester.interests.slice(0, 3).join(', ')}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleAccept(incomingRequests[0])}
                  style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                >
                  Accept Request ✓
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => handleDecline(incomingRequests[0].id)}
                >
                  Decline
                </Button>
              </div>
            </div>
          )}

          {/* Filter Bar with Tabs, Search, and Category Selectors */}
          <MatchFilterBar
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
            searchQuery={searchQuery}
            onSearchChange={(val) => setSearchQuery(val)}
            selectedCountry={selectedCountry}
            onCountryChange={(val) => setSelectedCountry(val)}
            selectedInterest={selectedInterest}
            onInterestChange={(val) => setSelectedInterest(val)}
            onClearFilters={handleClearFilters}
            totalResults={sortedMatches.length}
          />

          {/* Matches Grid */}
          {loading ? (
            <LoadingSpinner text="Searching for global student matches..." />
          ) : sortedMatches.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem',
              }}
            >
              {sortedMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  compact={false}
                  connectionState={getConnectionState(match)}
                  onViewProfile={(m) => setSpotlightMatch(m)}
                  onConnect={(m) => handleConnect(m)}
                  onAccept={(m) => handleAccept(m)}
                  isConnecting={connectingMap[match.id]}
                  hasConnected={connectedMap[match.id]}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No student matches found"
              description="No international students matched your filter criteria. Try choosing a different country or topic."
              actionLabel="Reset All Filters"
              onAction={handleClearFilters}
            />
          )}
        </main>
      </div>

      {/* Match Spotlight Modal */}
      <MatchSpotlightModal
        match={spotlightMatch}
        isOpen={!!spotlightMatch}
        onClose={() => setSpotlightMatch(null)}
        onConnect={(m) => handleConnect(m)}
        isConnecting={spotlightMatch ? connectingMap[spotlightMatch.id] : false}
        hasConnected={spotlightMatch ? connectedMap[spotlightMatch.id] : false}
        onSchedule={(m) => {
          setSpotlightMatch(null);
          setScheduleTarget(m);
        }}
      />

      {/* Schedule Call Modal */}
      <ScheduleCallModal
        match={scheduleTarget}
        isOpen={!!scheduleTarget}
        onClose={() => setScheduleTarget(null)}
      />
    </div>
  );
}

export default Matching;
