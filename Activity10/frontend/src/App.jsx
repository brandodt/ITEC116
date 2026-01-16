import React, { useState, useEffect } from 'react';
import OrganizerApp from './organizer/OrganizerApp';
import AttendeeApp from './attendees/AttendeeApp';
import AdminApp from './admin/AdminApp';

/**
 * Main Application Entry Point
 * Role-based module switching between Admin, Organizer, and Attendee
 * Uses URL hash prefix to determine which module to load:
 * - #admin-... for Admin module (e.g., #admin-dashboard, #admin-users)
 * - #organizer-... for Organizer module (e.g., #organizer-dashboard, #organizer-events)
 * - #attendee/... or default for Attendee module
 */
function App() {
  const [currentModule, setCurrentModule] = useState(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#admin-')) return 'admin';
    if (hash.startsWith('#organizer-')) return 'organizer';
    return 'attendee'; // Default to attendee (public-facing)
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#admin-')) {
        setCurrentModule('admin');
      } else if (hash.startsWith('#organizer-')) {
        setCurrentModule('organizer');
      } else {
        setCurrentModule('attendee');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Render current module
  const renderModule = () => {
    switch (currentModule) {
      case 'admin':
        return <AdminApp />;
      case 'organizer':
        return <OrganizerApp />;
      default:
        return <AttendeeApp />;
    }
  };

  // Floating module switcher for demo purposes
  const ModuleSwitcher = () => (
    <div className="fixed bottom-4 right-4 z-[100] flex items-center gap-2 p-2 bg-slate-900/90 backdrop-blur-sm rounded-full border border-slate-700 shadow-xl">
      <button
        onClick={() => {
          setCurrentModule('attendee');
          window.location.hash = 'discover';
        }}
        className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
          currentModule === 'attendee'
            ? 'bg-gradient-to-r from-sky-500 to-violet-600 text-white'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        👤 Attendee
      </button>
      <button
        onClick={() => {
          setCurrentModule('organizer');
          window.location.hash = 'organizer-login';
        }}
        className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
          currentModule === 'organizer'
            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        📋 Organizer
      </button>
      <button
        onClick={() => {
          setCurrentModule('admin');
          window.location.hash = 'admin-dashboard';
        }}
        className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
          currentModule === 'admin'
            ? 'bg-gradient-to-r from-indigo-500 to-slate-600 text-white'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        🛡️ Admin
      </button>
    </div>
  );

  return (
    <>
      {renderModule()}
      <ModuleSwitcher />
    </>
  );
}

export default App;
