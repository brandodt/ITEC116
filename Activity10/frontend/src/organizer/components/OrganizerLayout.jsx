import React, { useState } from 'react';
import { useAuth, ROLES } from '../contexts/AuthContext';
import { 
  Calendar, 
  Users, 
  BarChart2, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home,
  Camera,
  FileText,
  Bell
} from 'react-feather';
import LogoutConfirmModal from '../../shared/components/LogoutConfirmModal';

/**
 * Organizer Layout Component
 * Wraps organizer pages with navigation, sidebar, and role-based access control
 * Uses Emerald/Teal color palette
 */

const OrganizerLayout = ({ children, activePage = 'dashboard' }) => {
  const { user, hasRole, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Handle logout confirmation
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    logout();
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  // Role-based access check
  if (!hasRole(ROLES.ORGANIZER) && !hasRole(ROLES.ADMIN)) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="bg-slate-800 rounded-xl p-8 text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400 mb-6">
            You don't have permission to access the Organizer Dashboard. 
            Please contact an administrator if you believe this is an error.
          </p>
          <button
            onClick={logout}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '#organizer-dashboard' },
    { id: 'events', label: 'My Events', icon: Calendar, href: '#organizer-events' },
    { id: 'attendees', label: 'Attendees', icon: Users, href: '#organizer-attendees' },
    { id: 'scanner', label: 'Check-in Scanner', icon: Camera, href: '#organizer-scanner' },
    // { id: 'announcements', label: 'Announcements', icon: Bell, href: '#organizer-announcements' },
    { id: 'reports', label: 'Reports', icon: FileText, href: '#organizer-reports' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '#organizer-settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on all screen sizes */}
      <aside className={`
        fixed inset-y-0 left-0 z-50
        w-64 bg-slate-800 border-r border-slate-700
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg">EventHub</h1>
              <span className="text-xs text-emerald-400 font-medium">Organizer</span>
            </div>
          </div>
          <button 
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-emerald-600/20 text-emerald-400 border-l-4 border-emerald-500' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* User Section - Always at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-slate-700 bg-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.name?.charAt(0) || 'O'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-emerald-400 truncate">{user?.organization || 'Organizer'}</p>
            </div>
          </div>
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-2 w-full px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal 
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        theme="emerald"
      />

      {/* Main Content - With left margin to account for fixed sidebar */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 lg:px-6">
          <button
            className="lg:hidden text-slate-400 hover:text-white p-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 lg:flex-none" />
          
          <div className="flex items-center gap-4">
            <a 
              href="#organizer-settings"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default OrganizerLayout;
