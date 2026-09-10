import { createContext, useContext, useState } from 'react';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';
import { INITIAL_STUDENT_PROFILE } from '../services/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      if (res.success) {
        setUser(res.user);
        return { success: true };
      }
      return { success: false, error: res.error };
    } finally {
      setLoading(false);
    }
  };

  const register = async (studentData) => {
    setLoading(true);
    try {
      const res = await authService.register(studentData);
      if (res.success) {
        setUser(res.user);
        return { success: true };
      }
      return { success: false, error: res.error };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(INITIAL_STUDENT_PROFILE);
  };

  const updateProfile = async (updates) => {
    setLoading(true);
    try {
      const res = await profileService.updateProfile(updates);
      if (res.success) {
        setUser(res.profile);
        return { success: true, profile: res.profile };
      }
      return { success: false, error: res.error };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
