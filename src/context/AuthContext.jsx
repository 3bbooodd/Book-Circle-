import { createContext, useContext, useState, useEffect } from 'react';
import { setTokens, clearTokens, getAccessToken, getRefreshToken } from '../services/apiClient';
import { logout as logoutApi } from '../services/authService';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5213/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore auth state on app load
  useEffect(() => {
    const restoreAuth = async () => {
      const storedUser = localStorage.getItem('currentUser');
      const refreshToken = localStorage.getItem('refreshToken');

      if (storedUser && refreshToken) {
        try {
          // Try to refresh the access token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            RefreshToken: refreshToken,
          });

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
          setTokens(newAccessToken, newRefreshToken);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to refresh token:', error);
          // Refresh failed, clear everything
          clearTokens();
          localStorage.removeItem('currentUser');
        }
      } else if (storedUser) {
        // No refresh token but user data exists (old session)
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          localStorage.removeItem('currentUser');
        }
      }
      setLoading(false);
    };

    restoreAuth();

    // Handle auth events from apiClient
    const handleLogout = () => {
      setUser(null);
      clearTokens();
      localStorage.removeItem('currentUser');
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Store JWT tokens
    if (userData.accessToken && userData.refreshToken) {
      setTokens(userData.accessToken, userData.refreshToken);
    }
  };

  const logout = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      const refreshToken = storedUser?.refreshToken;
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      clearTokens();
      localStorage.removeItem('currentUser');
    }
  };

  const hasRole = (roles) => {
    if (!user || !roles) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const isAdmin = () => user?.role === 'Admin';
  const isBookOwner = () => user?.role === 'BookOwner';
  const isReader = () => user?.role === 'Reader';
  const isAuthenticated = () => !!user;

  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
    isAdmin,
    isBookOwner,
    isReader,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
