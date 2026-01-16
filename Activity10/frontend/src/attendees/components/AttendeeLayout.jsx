import React, { useState } from 'react';
import { 
  Home, 
  Search, 
  Tag, 
  User, 
  LogOut, 
  Menu, 
  X,
  Bell
} from 'react-feather';
import { useAttendeeAuth } from '../contexts/AttendeeAuthContext';
import LogoutConfirmModal from '../../shared/components/LogoutConfirmModal';

/**
 * Attendee Layout Component
 * Main layout wrapper for all attendee pages with Sky Blue/Violet theme
 */

const AttendeeLayout = ({ children, activePage = 'discover' }) => {
  const { user, isAuthenticated, logout } = useAttendeeAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const publicNavItems = [
    { id: 'discover', label: 'Discover', icon: Search, href: '#discover' },
  ];

  const privateNavItems = [
    { id: 'discover', label: 'Discover', icon: Search, href: '#discover' },
    { id: 'my-tickets', label: 'My Tickets', icon: Tag, href: '#my-tickets' },
    { id: 'profile', label: 'Profile', icon: User, href: '#profile' },
  ];

  const navItems = isAuthenticated ? privateNavItems : publicNavItems;

  // Handle logout with modal
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="#discover" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-violet-600 rounded-xl flex items-center justify-center">
                <Tag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent hidden sm:block">
                EventHub
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-sky-500/20 to-violet-500/20 text-sky-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </a>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-sky-500 rounded-full" />
                  </button>

                  {/* User Menu */}
                  <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-700">
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">
                        {user?.name || user?.firstName || 'Guest'}
                      </p>
                      <p className="text-xs text-slate-400">Attendee</p>
                    </div>
                    <img
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0ea5e9&color=fff`}
                      alt="Avatar"
                      className="w-9 h-9 rounded-full ring-2 ring-sky-500/30"
                    />
                  </div>

                  {/* Logout */}
                  <button
                    onClick={handleLogoutClick}
                    className="hidden sm:flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <a
                    href="#login"
                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    Log In
                  </a>
                  <a
                    href="#register"
                    className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-sky-500 to-violet-600 text-white rounded-lg hover:from-sky-600 hover:to-violet-700 transition-all shadow-lg shadow-sky-500/25"
                  >
                    Sign Up
                  </a>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/50 animate-slide-in-top">
            <nav className="container mx-auto px-4 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-sky-500/20 to-violet-500/20 text-sky-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </a>
                );
              })}
              
              {isAuthenticated && (
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Log Out</span>
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal 
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        theme="sky"
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-800/50 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-violet-600 rounded-lg flex items-center justify-center">
                <Tag className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
                EventHub
              </span>
            </div>
            <p className="text-sm text-slate-500">
              © 2026 EventHub. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm text-slate-400 hover:text-sky-400 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-slate-400 hover:text-sky-400 transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-slate-400 hover:text-sky-400 transition-colors">
                Help
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AttendeeLayout;
