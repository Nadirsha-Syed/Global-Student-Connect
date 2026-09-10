import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { matchingService } from '../services/matchingService';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import MatchCard from '../components/matching/MatchCard';
import MatchFilterBar from '../components/matching/MatchFilterBar';
import MatchSpotlightModal from '../components/matching/MatchSpotlightModal';
import ScheduleCallModal from '../components/matching/ScheduleCallModal';
import { EmptyState, LoadingSpinner } from '../components/common/EmptyState';

export function Matching() {
  const { id: routeMatchId } = useParams();

  const [allMatches, setAllMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('for-you'); // 'for-you' | 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All Countries');
  const [selectedInterest, setSelectedInterest] = useState('All Interests');

  const [spotlightMatch, setSpotlightMatch] = useState(null);
  const [scheduleTarget, setScheduleTarget] = useState(null);
  const [connectedMap, setConnectedMap] = useState({});
  const [connectingMap, setConnectingMap] = useState({});
  const [feedbackToast, setFeedbackToast] = useState(null);

  useEffect(() => {
    async function loadMatches() {
      setLoading(true);
      try {
        const res = await matchingService.getAllMatches();
        if (res.success) {
          setAllMatches(res.matches);

          // If URL has a specific match ID, open its spotlight directly
          if (routeMatchId) {
            const found = res.matches.find((m) => m.id === routeMatchId);
            if (found) setSpotlightMatch(found);
          }
        }
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, [routeMatchId]);

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
      return b.matchScore - a.matchScore; // Highest score first
    }
    return a.name.localeCompare(b.name); // Alphabetical for "All"
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

          {/* Header Title (Matching Section 3.1) */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Find Your Global Match
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Discover students from around the world who share your exact interests and curiosity.
            </p>
          </div>

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

          {/* Matches Grid (3-columns across, matching section 3.1) */}
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
                  onViewProfile={(m) => setSpotlightMatch(m)}
                  onConnect={(m) => handleConnect(m)}
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

      {/* Match Spotlight Modal (Section 3.2) */}
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

      {/* Schedule Call Modal (Sections 3.3 & 3.4) */}
      <ScheduleCallModal
        match={scheduleTarget}
        isOpen={!!scheduleTarget}
        onClose={() => setScheduleTarget(null)}
      />
    </div>
  );
}

export default Matching;
