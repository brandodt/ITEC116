import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockAdmins } from '../../shared/data/mockData';

/**
 * Admin Authentication Context
 * Manages admin authentication state and role-based access
 */

// Role definitions
export const ROLES = {
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
  STAFF: 'staff',
  ATTENDEE: 'attendee',
};

// Get mock admin user from shared data
const mockAdminUser = mockAdmins[0] ? {
  id: mockAdmins[0].id,
  name: mockAdmins[0].name,
  email: mockAdmins[0].email,
  role: mockAdmins[0].role,
  avatar: mockAdmins[0].avatar,
  permissions: mockAdmins[0].permissions,
} : {
  id: 'admin-001',
  name: 'System Admin',
  email: 'admin@eventhub.com',
  role: ROLES.ADMIN,
  avatar: null,
  permissions: ['manage_users', 'manage_events', 'view_reports', 'export_data', 'system_settings'],
};

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  // Auto-login for development
  const [user, setUser] = useState(mockAdminUser);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For development, accept any credentials
      if (email && password) {
        setUser(mockAdminUser);
        setIsAuthenticated(true);
        return { success: true };
      }
      
      throw new Error('Invalid credentials');
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    // Redirect to login or home
    window.location.hash = 'discover';
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
