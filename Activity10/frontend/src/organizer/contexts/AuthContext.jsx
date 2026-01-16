import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { login as apiLogin, getCurrentUser, logout as apiLogout } from '../../shared/services/authService';
import { getStoredUser, setStoredUser, clearAuth, setAuthContext } from '../../shared/services/api';

/**
 * Authentication Context for Organizer Module
 * Provides user authentication state and permission checks
 * Connected to NestJS backend
 */

const AuthContext = createContext(null);

export const ROLES = {
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
  ATTENDEE: 'attendee',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      setAuthContext('organizer'); // Use organizer-specific storage
      try {
        const storedUser = getStoredUser();
        if (storedUser && (storedUser.role === ROLES.ORGANIZER || storedUser.role === ROLES.ADMIN)) {
          // Verify token is still valid
          const currentUser = await getCurrentUser();
          if (currentUser.role === ROLES.ORGANIZER || currentUser.role === ROLES.ADMIN) {
            setUser(currentUser);
            setStoredUser(currentUser);
            setIsAuthenticated(true);
          } else {
            clearAuth();
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const hasRole = useCallback((role) => {
    if (!user) return false;
    return user.role === role.toLowerCase();
  }, [user]);

  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    
    // Define role-based permissions
    const permissions = {
      [ROLES.ADMIN]: [
        'view_all_events',
        'edit_all_events',
        'delete_all_events',
        'manage_users',
        'view_reports',
        'manage_organizers',
      ],
      [ROLES.ORGANIZER]: [
        'view_own_events',
        'create_events',
        'edit_own_events',
        'delete_own_events',
        'view_attendees',
        'check_in_attendees',
        'export_attendees',
        'scan_tickets',
        'send_announcements',
      ],
      [ROLES.ATTENDEE]: [
        'view_events',
        'register_events',
        'view_own_tickets',
        'cancel_registration',
      ],
    };

    return permissions[user.role]?.includes(permission) || false;
  }, [user]);

  // Check if organizer owns a specific event (handled by backend now)
  const ownsEvent = useCallback((eventId) => {
    // Backend handles ownership validation
    return true;
  }, []);

  const login = useCallback(async (email, password) => {
    setAuthContext('organizer'); // Use organizer-specific storage
    const response = await apiLogin(email, password);
    
    if (response.user && (response.user.role === ROLES.ORGANIZER || response.user.role === ROLES.ADMIN)) {
      setUser(response.user);
      setIsAuthenticated(true);
      return response.user;
    }
    
    // Not an organizer
    clearAuth();
    throw new Error('Access denied. Organizer privileges required.');
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
    setIsAuthenticated(false);
    window.location.hash = 'organizer-login';
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    hasRole,
    hasPermission,
    ownsEvent,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
