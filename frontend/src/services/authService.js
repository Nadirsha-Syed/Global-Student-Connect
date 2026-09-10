import { apiRequest } from './api';
import { INITIAL_STUDENT_PROFILE } from './mockData';

const TOKEN_KEY = 'gsc_student_token';
const USER_KEY = 'gsc_student_user';

export const authService = {
  /**
   * Log in student with email and password
   */
  async login(email, password) {
    // Try live API first
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.success && res.data.token) {
      localStorage.setItem(TOKEN_KEY, res.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.data.user || res.data));
      return { success: true, user: res.data.user || res.data };
    }

    // Graceful demo/offline fallback
    if (res.isOffline || !res.success) {
      const mockUser = {
        ...INITIAL_STUDENT_PROFILE,
        email: email || INITIAL_STUDENT_PROFILE.email,
      };
      localStorage.setItem(TOKEN_KEY, 'demo-jwt-student-token-01');
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
      return { success: true, user: mockUser, isDemo: true };
    }

    return { success: false, error: res.error || 'Invalid credentials' };
  },

  /**
   * Register a new student account
   */
  async register(studentData) {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });

    if (res.success && res.data.token) {
      localStorage.setItem(TOKEN_KEY, res.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.data.user || res.data));
      return { success: true, user: res.data.user || res.data };
    }

    // Graceful demo/offline fallback
    const newUser = {
      ...INITIAL_STUDENT_PROFILE,
      name: studentData.name || 'New Student',
      email: studentData.email,
      completionPercentage: 35,
      isProfileComplete: false,
    };
    localStorage.setItem(TOKEN_KEY, 'demo-jwt-student-token-01');
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    return { success: true, user: newUser, isDemo: true };
  },

  /**
   * Get active logged in user from localStorage
   */
  getCurrentUser() {
    const saved = localStorage.getItem(USER_KEY);
    if (!saved) return INITIAL_STUDENT_PROFILE; // Default to Ruthvik for rich preview
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.avatar && (parsed.avatar.startsWith('http') || parsed.avatar.startsWith('/'))) {
        parsed.avatar = INITIAL_STUDENT_PROFILE.avatar;
      }
      return parsed;
    } catch {
      return INITIAL_STUDENT_PROFILE;
    }
  },

  /**
   * Log out active student
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return { success: true };
  },

  /**
   * Check if token exists
   */
  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  }
};
