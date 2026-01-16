import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { AdminAuthProvider } from './contexts/AdminAuthContext';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const EventsList = lazy(() => import('./pages/EventsList'));
const EventDetails = lazy(() => import('./pages/EventDetails'));
const ManageUsers = lazy(() => import('./pages/ManageUsers'));
const Reports = lazy(() => import('./pages/Reports'));

/**
 * AdminApp - Main entry point for Admin module
 * Handles hash-based routing for admin pages
 * Routes use #admin-* prefix
 */

// Loading spinner component
const PageLoader = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-indigo-400 rounded-full animate-spin animate-reverse" />
      </div>
    </div>
  </div>
);

const AdminApp = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Parse hash and navigate
  const parseHash = useCallback(() => {
    const hash = window.location.hash.slice(1); // Remove #
    
    // Map hash routes to page names
    if (hash.startsWith('admin-dashboard')) {
      setCurrentPage('dashboard');
    } else if (hash.startsWith('admin-events')) {
      setCurrentPage('events');
    } else if (hash.startsWith('admin-event/')) {
      setCurrentPage('event-details');
    } else if (hash.startsWith('admin-users')) {
      setCurrentPage('users');
    } else if (hash.startsWith('admin-reports')) {
      setCurrentPage('reports');
    } else {
      // Default to dashboard for admin
      setCurrentPage('dashboard');
    }
  }, []);

  useEffect(() => {
    // Parse initial hash
    parseHash();

    // Listen for hash changes
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, [parseHash]);

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'events':
        return <EventsList />;
      case 'event-details':
        return <EventDetails />;
      case 'users':
        return <ManageUsers />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AdminAuthProvider>
      <Suspense fallback={<PageLoader />}>
        {renderPage()}
      </Suspense>
    </AdminAuthProvider>
  );
};

export default AdminApp;
