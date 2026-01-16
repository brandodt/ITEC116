import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getCurrentUser, logout as apiLogout } from '../../shared/services/authService';
import { getStoredUser, setStoredUser, clearAuth, setAuthContext } from '../../shared/services/api';
import api from '../../shared/services/api';

/**
 * Attendee Auth Context
 * Provides authentication state for attendee users
 * Connected to NestJS backend
 */

const AttendeeAuthContext = createContext(null);

export const useAttendeeAuth = () => {
  const context = useContext(AttendeeAuthContext);
  if (!context) {
    throw new Error('useAttendeeAuth must be used within AttendeeAuthProvider');
  }
  return context;
};

export const AttendeeAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      setAuthContext('attendee'); // Use attendee-specific storage
      try {
        const storedUser = getStoredUser();
        if (storedUser) {
          // Try to verify token is still valid
          try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
            setStoredUser(currentUser);
            setIsAuthenticated(true);
          } catch (error) {
            // Token might be expired, but we still have stored user data
            // Check if it's an auth error (401) or network error
            if (error.message?.includes('Session expired') || error.message?.includes('401')) {
              // Token is invalid, clear everything
              clearAuth();
              setUser(null);
              setIsAuthenticated(false);
            } else {
              // Network error or other issue, use stored user for now
              console.warn('Could not verify auth, using stored user:', error);
              setUser(storedUser);
              setIsAuthenticated(true);
            }
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setAuthContext('attendee'); // Use attendee-specific storage
    const response = await apiLogin(email, password);
    setUser(response.user);
    setIsAuthenticated(true);
    return response.user;
  };

  const register = async (userData) => {
    setAuthContext('attendee'); // Use attendee-specific storage
    const response = await apiRegister({
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      role: 'attendee',
    });
    setUser(response.user);
    setIsAuthenticated(true);
    return response.user;
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    setIsAuthenticated(false);
    window.location.hash = 'discover';
  };

  const updateProfile = async (updates) => {
    // Update profile via API (you may need to add this endpoint)
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    setStoredUser(updatedUser);
    return updatedUser;
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    updateProfile,
  };

  return (
    <AttendeeAuthContext.Provider value={value}>
      {children}
    </AttendeeAuthContext.Provider>
  );
};

export default AttendeeAuthContext;
