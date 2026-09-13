import { apiRequest } from './api';
import { INITIAL_STUDENT_PROFILE } from './mockData';

const USER_KEY = 'gsc_student_user';

export const profileService = {
  /**
   * Fetch student profile from API or local cache
   */
  async getProfile() {
    const res = await apiRequest('/auth/profile', {
      method: 'GET',
    });

    if (res.success && res.data) {
      return { success: true, profile: res.data };
    }

    // Local cached profile fallback
    const cached = localStorage.getItem(USER_KEY);
    const profile = cached ? JSON.parse(cached) : INITIAL_STUDENT_PROFILE;
    return { success: true, profile, isLocal: true };
  },

  /**
   * Update student profile
   */
  async updateProfile(updatedData) {
    const res = await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updatedData),
    });

    // Update local state regardless
    const cached = localStorage.getItem(USER_KEY);
    const current = cached ? JSON.parse(cached) : INITIAL_STUDENT_PROFILE;
    const merged = {
      ...current,
      ...updatedData,
      completionPercentage: profileService.calculateCompletion(updatedData, current),
    };
    localStorage.setItem(USER_KEY, JSON.stringify(merged));

    if (res.success && res.data) {
      return { success: true, profile: res.data };
    }

    return { success: true, profile: merged, isLocal: true };
  },

  /**
   * Calculate profile completion score (0 - 100)
   */
  calculateCompletion(data, existing = {}) {
    const fields = ['name', 'country', 'age', 'bio', 'interests', 'languages', 'institution'];
    let filled = 0;
    const combined = { ...existing, ...data };

    fields.forEach((f) => {
      const val = combined[f];
      if (Array.isArray(val) && val.length > 0) filled++;
      else if (val && String(val).trim().length > 0) filled++;
    });

    return Math.min(100, Math.round((filled / fields.length) * 100));
  }
};
