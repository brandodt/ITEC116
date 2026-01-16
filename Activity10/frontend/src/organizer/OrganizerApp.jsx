import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import EventsList from './pages/EventsList';
import EventDetails from './pages/EventDetails';
import AttendeeOverview from './pages/AttendeeOverview';
import CheckInScanner from './pages/CheckInScanner';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Announcements from './pages/Announcements';
import { Loader } from 'react-feather';

/**
 * Organizer App Component
 * Main entry point for the Organizer module with authentication and routing
 */

// Loading screen component
const LoadingScreen = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="text-center">
      <Loader className="w-10 h-10 text-emerald-500 animate-spin mx-auto mb-4" />
      <p className="text-slate-400">Loading...</p>
    </div>
  </div>
);

// Protected route wrapper
const ProtectedRoutes = () => {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash.replace('#organizer-', '') || 'dashboard';
    return hash;
  });

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#organizer-', '') || 'dashboard';
      setCurrentPage(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle successful login
  const handleLogin = async (email, password) => {
    await login(email, password);
    window.location.hash = 'organizer-dashboard';
  };

  // Show loading screen while checking auth
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show forgot password page (accessible without auth)
  if (currentPage === 'forgot-password') {
    return <ForgotPassword />;
  }

  // Show login if not authenticated
  if (!isAuthenticated || currentPage === 'login') {
    if (!isAuthenticated) {
      return <Login onLogin={handleLogin} />;
    }
  }

  // Parse event ID from hash if present
  const getEventId = () => {
    if (currentPage.startsWith('event/')) {
      return currentPage.replace('event/', '');
    }
    return null;
  };

  // Render current page based on hash
  const renderPage = () => {
    // Handle login route
    if (currentPage === 'login') {
      window.location.hash = 'organizer-dashboard';
      return <Dashboard />;
    }

    // Handle event details route
    if (currentPage.startsWith('event/')) {
      return <EventDetails eventId={getEventId()} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'events':
        return <EventsList />;
      case 'attendees':
        return <AttendeeOverview />;
      case 'scanner':
        return <CheckInScanner />;
      // case 'announcements':
        // return <Announcements />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return renderPage();
};

const OrganizerApp = () => {
  return (
    <AuthProvider>
      <ProtectedRoutes />
    </AuthProvider>
  );
};

export default OrganizerApp;
