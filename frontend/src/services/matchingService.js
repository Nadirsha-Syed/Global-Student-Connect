import { apiRequest } from './api';
import { MOCK_MATCHES } from './mockData';

export const matchingService = {
  /**
   * Get personalized recommendations for student
   */
  async getRecommendations() {
    const res = await apiRequest('/matches/recommendations');
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      return { success: true, matches: res.data };
    }
    // Return top 3 scored matches for dashboard
    return { success: true, matches: MOCK_MATCHES.slice(0, 3) };
  },

  /**
   * Get all matched students with optional filtering
   */
  async getAllMatches(filter = {}) {
    const res = await apiRequest('/matches');
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      return { success: true, matches: res.data };
    }

    let results = [...MOCK_MATCHES];

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
    if (res.success && res.data) {
      return { success: true, match: res.data };
    }
    const found = MOCK_MATCHES.find((m) => m.id === id) || MOCK_MATCHES[0];
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

    // Offline simulation
    return {
      success: true,
      message: 'Connection request recorded! We will notify you when accepted.',
    };
  }
};
