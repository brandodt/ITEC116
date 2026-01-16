import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { mockOrganizers } from '../../shared/data/mockData';

/**
 * Authentication Context for Organizer Module
 * Provides user authentication state and permission checks
 * Each organizer can only manage their own events
 */

const AuthContext = createContext(null);

export const ROLES = {
  ADMIN: 'ADMIN',
  ORGANIZER: 'ORGANIZER',
  ATTENDEE: 'ATTENDEE',
};

// Storage key for session persistence
const STORAGE_KEY = 'organizer_session';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      try {
        const storedSession = localStorage.getItem(STORAGE_KEY);
        if (storedSession) {
          const sessionData = JSON.parse(storedSession);
          // Validate session (check if user still exists)
          const organizer = mockOrganizers.find(o => o.id === sessionData.id);
          if (organizer) {
            const { password, ...userWithoutPassword } = organizer;
            setUser(userWithoutPassword);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const hasRole = useCallback((role) => {
    if (!user) return false;
    return user.role === role;
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

  // Check if organizer owns a specific event
  const ownsEvent = useCallback((eventId) => {
    if (!user || !user.eventsOwned) return false;
    return user.eventsOwned.includes(eventId);
  }, [user]);

  const login = useCallback(async (email, password) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find matching organizer
    const organizer = mockOrganizers.find(
      o => o.email.toLowerCase() === email.toLowerCase() && o.password === password
    );
    
    if (!organizer) {
      throw new Error('Invalid email or password');
    }
    
    // Remove password from user object
    const { password: _, ...userWithoutPassword } = organizer;
    
    // Store session
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: organizer.id }));
    
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    
    return userWithoutPassword;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setIsAuthenticated(false);
    // Redirect to login
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
