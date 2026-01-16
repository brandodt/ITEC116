/**
 * Authentication Service
 * Handles authentication operations with the NestJS backend
 */

import api, { setAuthToken, setStoredUser, clearAuth, getStoredUser } from './api';

/**
 * Register a new user
 */
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  
  // Store token and user
  if (response.access_token) {
    setAuthToken(response.access_token);
    setStoredUser(response.user);
  }
  
  return response;
};

/**
 * Login with email and password
 */
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  
  // Store token and user
  if (response.access_token) {
    setAuthToken(response.access_token);
    setStoredUser(response.user);
  }
  
  return response;
};

/**
 * Check if email exists in the system
 */
export const checkEmailExists = async (email) => {
  try {
    const response = await api.get(`/auth/check-email?email=${encodeURIComponent(email)}`);
    return response;
  } catch {
    return { exists: false };
  }
};

/**
 * Get current authenticated user profile
 */
export const getCurrentUser = async () => {
  return api.get('/auth/me');
};

/**
 * Logout - clear stored auth data
 */
export const logout = () => {
  clearAuth();
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getStoredUser();
};

/**
 * Get stored user without API call
 */
export const getLocalUser = () => {
  return getStoredUser();
};

export default {
  register,
  login,
  getCurrentUser,
  logout,
  isAuthenticated,
  getLocalUser,
};
