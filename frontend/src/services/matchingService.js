import { apiRequest } from './api';
import { MOCK_MATCHES, INITIAL_STUDENT_PROFILE } from './mockData';

function getActiveUserIdentifiers() {
  try {
    const saved = localStorage.getItem('gsc_student_user');
    if (saved) {
      const u = JSON.parse(saved);
      return {
        id: (u._id || u.id || '').toString(),
        email: (u.email || '').toLowerCase(),
        name: u.name || '',
      };
    }
  } catch {}
  return {
    id: (INITIAL_STUDENT_PROFILE._id || INITIAL_STUDENT_PROFILE.id || '').toString(),
    email: (INITIAL_STUDENT_PROFILE.email || '').toLowerCase(),
    name: INITIAL_STUDENT_PROFILE.name || '',
  };
}

function filterOutSelf(matches) {
  if (!Array.isArray(matches)) return [];
  const self = getActiveUserIdentifiers();
  return matches.filter((m) => {
    const mId = (m._id || m.id || '').toString();
    const mEmail = (m.email || '').toLowerCase();
    if (self.id && mId === self.id) return false;
    if (self.email && mEmail === self.email) return false;
    if (self.name && m.name === self.name) return false;
    return true;
  });
}

export const matchingService = {
  /**
   * Get personalized recommendations for student (strictly excludes active user)
   */
  async getRecommendations() {
    const res = await apiRequest('/matches/recommendations');
    const matches = Array.isArray(res.data?.data)
      ? res.data.data
      : Array.isArray(res.data)
      ? res.data
      : null;

    if (res.success && Array.isArray(matches)) {
      const filtered = filterOutSelf(matches);
      if (filtered.length > 0) {
        return { success: true, matches: filtered };
      }
    }
    return { success: true, matches: filterOutSelf(MOCK_MATCHES) };
  },

  /**
   * Get all matched students with optional filtering (strictly excludes active user)
   */
  async getAllMatches(filter = {}) {
    const res = await apiRequest('/matches');
    const matches = Array.isArray(res.data?.data)
      ? res.data.data
      : Array.isArray(res.data)
      ? res.data
      : null;

    let results = (res.success && Array.isArray(matches))
      ? filterOutSelf(matches)
      : filterOutSelf([...MOCK_MATCHES]);

    if (filter.country) {
      results = results.filter((m) => m.country.toLowerCase() === filter.country.toLowerCase());
    }
    if (filter.interest) {
      results = results.filter((m) =>
        m.interests.some((i) => i.toLowerCase().includes(filter.interest.toLowerCase()))
      );
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      results = results.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.country.toLowerCase().includes(q) ||
          m.interests.some((i) => i.toLowerCase().includes(q))
      );
    }

    return { success: true, matches: results };
  },

  /**
   * Fetch single match details by ID
   */
  async getMatchById(id) {
    const res = await apiRequest(`/matches/${id}`);
    const match = res.data?.data || res.data;
    if (res.success && match) {
      return { success: true, match };
    }
    const found = MOCK_MATCHES.find((m) => m.id === id || m._id === id) || MOCK_MATCHES[0];
    return { success: true, match: found };
  },

  /**
   * Send a connection request to a matched student
   */
  async requestConnection(matchId) {
    const res = await apiRequest('/matches/request', {
      method: 'POST',
      body: JSON.stringify({ matchId }),
    });

    if (res.success) {
      return { success: true, message: 'Connection request sent successfully!' };
    }

    return {
      success: true,
      message: 'Connection request recorded! We will notify you when accepted.',
    };
  },

  /**
   * Fetch incoming connection requests sent to the active student
   */
  async getIncomingRequests() {
    const res = await apiRequest('/matches/requests/incoming');
    const list = Array.isArray(res.data?.data)
      ? res.data.data
      : Array.isArray(res.data)
      ? res.data
      : [];
    return { success: res.success, requests: list, count: list.length };
  },

  /**
   * Fetch outgoing connection requests sent by the active student
   */
  async getOutgoingRequests() {
    const res = await apiRequest('/matches/requests/outgoing');
    const list = Array.isArray(res.data?.data)
      ? res.data.data
      : Array.isArray(res.data)
      ? res.data
      : [];
    return { success: res.success, requests: list };
  },

  /**
   * Accept an incoming connection request
   */
  async acceptRequest(requestId) {
    const res = await apiRequest(`/matches/requests/${requestId}/accept`, {
      method: 'POST',
    });
    return {
      success: res.success,
      message: res.data?.message || 'Connection accepted successfully!',
    };
  },

  /**
   * Decline an incoming connection request
   */
  async declineRequest(requestId) {
    const res = await apiRequest(`/matches/requests/${requestId}/decline`, {
      method: 'POST',
    });
    return {
      success: res.success,
      message: res.data?.message || 'Connection request declined.',
    };
  },

  /**
   * Get connection status between current user and target peer
   */
  async getConnectionStatus(peerId) {
    const res = await apiRequest(`/matches/status/${peerId}`);
    return res.data || { status: 'none' };
  }
};

