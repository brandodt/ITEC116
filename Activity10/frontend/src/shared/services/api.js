/**
 * API Client Configuration
 * Centralized API client for connecting to the NestJS backend
 * Supports role-based authentication storage (admin, organizer, attendee)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Current auth context (can be 'admin', 'organizer', or 'attendee')
let currentAuthContext = 'attendee';

/**
 * Set the current auth context
 * @param {'admin' | 'organizer' | 'attendee'} context
 */
export const setAuthContext = (context) => {
  currentAuthContext = context;
};

/**
 * Get the current auth context
 */
export const getAuthContext = () => currentAuthContext;

/**
 * Get storage key based on context
 */
const getStorageKey = (base, context = currentAuthContext) => {
  return `${base}_${context}`;
};

/**
 * Get stored auth token for current context
 */
const getAuthToken = () => {
  return localStorage.getItem(getStorageKey('auth_token'));
};

/**
 * Set auth token for current context
 */
export const setAuthToken = (token) => {
  const key = getStorageKey('auth_token');
  if (token) {
    localStorage.setItem(key, token);
  } else {
    localStorage.removeItem(key);
  }
};

/**
 * Clear auth data for current context
 */
export const clearAuth = () => {
  localStorage.removeItem(getStorageKey('auth_token'));
  localStorage.removeItem(getStorageKey('auth_user'));
};

/**
 * Get stored user for current context
 */
export const getStoredUser = () => {
  const user = localStorage.getItem(getStorageKey('auth_user'));
  return user ? JSON.parse(user) : null;
};

/**
 * Set stored user for current context
 */
export const setStoredUser = (user) => {
  const key = getStorageKey('auth_user');
  if (user) {
    localStorage.setItem(key, JSON.stringify(user));
  } else {
    localStorage.removeItem(key);
  }
};

/**
 * API Request helper with authentication
 */
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // Handle 401 Unauthorized
  if (response.status === 401) {
    // Check if this is an auth endpoint (login/register) - don't redirect, just throw error
    const isAuthEndpoint = endpoint.includes('/auth/login') || endpoint.includes('/auth/register');
    
    if (!isAuthEndpoint) {
      // Session expired for authenticated routes - clear auth and redirect
      clearAuth();
      window.location.hash = 'discover';
      throw new Error('Session expired. Please login again.');
    }
    
    // For auth endpoints, let the error propagate with the backend message
    const data = await response.json().catch(() => null);
    const errorMessage = data?.message || 'Invalid credentials';
    throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = data?.message || `HTTP error! status: ${response.status}`;
    throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
  }

  return data;
};

/**
 * API methods
 */
export const api = {
  get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
  
  post: (endpoint, data) => apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  patch: (endpoint, data) => apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  put: (endpoint, data) => apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
};

export default api;
