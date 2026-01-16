import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockAttendeeUsers } from '../../shared/data/mockData';

/**
 * Attendee Auth Context
 * Provides authentication state for attendee users
 */

// Default mock user (first attendee from shared data)
const defaultMockUser = mockAttendeeUsers[0] || {
  id: 'user-001',
  firstName: 'Juan',
  lastName: 'Dela Cruz',
  email: 'juan@email.com',
  avatar: 'https://ui-avatars.com/api/?name=Juan+DC&background=0ea5e9&color=fff',
  role: 'attendee',
  phone: '+63 912 345 6789',
  createdAt: '2025-06-15T00:00:00Z',
};

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
    const checkAuth = () => {
      const savedUser = localStorage.getItem('attendee_user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (e) {
          localStorage.removeItem('attendee_user');
        }
      }
      setIsLoading(false);
    };

    // Simulate async check
    setTimeout(checkAuth, 300);
  }, []);

  const login = async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check against mock attendee users
    const foundUser = mockAttendeeUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );
    
    if (foundUser && password) {
      const userData = { ...foundUser };
      delete userData.password;
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('attendee_user', JSON.stringify(userData));
      return userData;
    }
    
    // Fallback for demo (accept any valid email/password)
    if (email && password) {
      const userData = { ...defaultMockUser, email };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('attendee_user', JSON.stringify(userData));
      return userData;
    }
    
    throw new Error('Invalid credentials');
  };

  const register = async (userData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      role: 'attendee',
      createdAt: new Date().toISOString(),
    };
    
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('attendee_user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('attendee_user');
    window.location.hash = 'discover';
  };

  const updateProfile = async (updates) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('attendee_user', JSON.stringify(updatedUser));
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
