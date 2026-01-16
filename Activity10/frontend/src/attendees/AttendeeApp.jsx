import React, { useState, useEffect } from 'react';
import { AttendeeAuthProvider } from './contexts/AttendeeAuthContext';
import EventDiscovery from './pages/EventDiscovery';
import EventDetails from './pages/EventDetails';
import MyTickets from './pages/MyTickets';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import ConfirmRegistration from './pages/ConfirmRegistration';

/**
 * Attendee App Component
 * Main entry point for the Attendee module with hash-based routing
 * Sky Blue/Violet color palette
 */

const AttendeeApp = () => {
  const [currentRoute, setCurrentRoute] = useState(() => {
    return parseRoute(window.location.hash);
  });

  // Parse route from hash
  function parseRoute(hash) {
    const cleanHash = hash.replace('#', '') || 'discover';
    
    // Check for event details route: #event/evt-001
    if (cleanHash.startsWith('event/')) {
      const eventId = cleanHash.replace('event/', '');
      return { page: 'event-details', eventId, confirmToken: null };
    }
    
    // Check for confirmation route: #confirm/TOKEN
    if (cleanHash.startsWith('confirm/')) {
      const token = cleanHash.replace('confirm/', '');
      return { page: 'confirm', eventId: null, confirmToken: token };
    }
    
    return { page: cleanHash, eventId: null, confirmToken: null };
  }

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(parseRoute(window.location.hash));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Render current page based on route
  const renderPage = () => {
    switch (currentRoute.page) {
      case 'discover':
        return <EventDiscovery />;
      case 'event-details':
        return <EventDetails eventId={currentRoute.eventId} />;
      case 'confirm':
        return <ConfirmRegistration token={currentRoute.confirmToken} />;
      case 'my-tickets':
        return <MyTickets />;
      case 'profile':
        return <Profile />;
      case 'login':
        return <Login mode="login" />;
      case 'register':
        return <Login mode="register" />;
      case 'forgot-password':
        return <ForgotPassword />;
      default:
        return <EventDiscovery />;
    }
  };

  return (
    <AttendeeAuthProvider>
      {renderPage()}
    </AttendeeAuthProvider>
  );
};

export default AttendeeApp;
