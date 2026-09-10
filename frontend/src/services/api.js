// Base API configuration and resilient client

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic fetch wrapper with automatic JWT authorization header injection
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('gsc_student_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return { success: true, data };
  } catch (error) {
    // Return structured error
    return {
      success: false,
      error: error.message || 'Network connection failed',
      isOffline: error.message.includes('Failed to fetch') || error.message.includes('NetworkError'),
    };
  }
}

export { API_BASE_URL };
