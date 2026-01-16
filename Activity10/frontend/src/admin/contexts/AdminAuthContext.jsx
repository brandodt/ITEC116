import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { login as apiLogin, getCurrentUser, logout as apiLogout } from '../../shared/services/authService';
import { getStoredUser, setStoredUser, setAuthToken, clearAuth, setAuthContext } from '../../shared/services/api';

/**
 * Admin Authentication Context
 * Manages admin authentication state and role-based access
 * Connected to NestJS backend
 */

// Set auth context to admin
setAuthContext('admin');

// Role definitions
export const ROLES = {
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
  STAFF: 'staff',
  ATTENDEE: 'attendee',
};

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      setAuthContext('admin'); // Ensure we're using admin storage
      try {
        const storedUser = getStoredUser();
        if (storedUser && storedUser.role === ROLES.ADMIN) {
          // Verify token is still valid
          const currentUser = await getCurrentUser();
          if (currentUser.role === ROLES.ADMIN) {
            setUser(currentUser);
            setStoredUser(currentUser);
            setIsAuthenticated(true);
          } else {
            clearAuth();
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

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    if (!user) return false;
    if (user.role === ROLES.ADMIN) return true; // Admin has all roles
    return user.role === role;
  }, [user]);

  // Check if user has specific permission
  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    if (user.role === ROLES.ADMIN) return true; // Admin has all permissions
    return user.permissions?.includes(permission) || false;
  }, [user]);

  // Login function
  const login = useCallback(async (email, password) => {
    setAuthContext('admin'); // Ensure we're using admin storage
    setIsLoading(true);
    try {
      const response = await apiLogin(email, password);
      
      if (response.user && response.user.role === ROLES.ADMIN) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      
      // Not an admin
      clearAuth();
      throw new Error('Access denied. Admin privileges required.');
    } catch (error) {
      clearAuth();
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setAuthContext('admin');
    apiLogout();
    setUser(null);
    setIsAuthenticated(false);
    window.location.hash = 'admin-login';
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    hasRole,
    hasPermission,
    login,
    logout,
    ROLES,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export default AdminAuthContext;
