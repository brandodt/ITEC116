import React, { useState } from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { 
  Home,
  Calendar, 
  Users, 
  BarChart2, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Shield,
  FileText,
  UserPlus
} from 'react-feather';
import LogoutConfirmModal from '../../shared/components/LogoutConfirmModal';

/**
 * Admin Layout Component
 * Wraps admin pages with navigation, sidebar, and role-based access control
 * Uses Indigo/Deep Slate color palette
 */

const AdminLayout = ({ children, activePage = 'dashboard' }) => {
  const { user, logout } = useAdminAuth();
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

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '#admin-dashboard' },
    { id: 'events', label: 'All Events', icon: Calendar, href: '#admin-events' },
    { id: 'users', label: 'Manage Users', icon: Users, href: '#admin-users' },
    { id: 'reports', label: 'Reports', icon: BarChart2, href: '#admin-reports' },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on all screen sizes */}
      <aside className={`
        fixed inset-y-0 left-0 z-50
        w-64 bg-slate-900 border-r border-slate-800
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg">EventHub</h1>
              <span className="text-xs text-indigo-400 font-medium">Admin Panel</span>
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
                    ? 'bg-indigo-600/20 text-indigo-400 border-l-4 border-indigo-500 shadow-lg shadow-indigo-500/10' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </a>
            );
          })}

          {/* Divider */}
          <div className="my-4 border-t border-slate-800" />
          
          {/* Settings */}
          <a
            href="#admin-settings"
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${activePage === 'settings'
                ? 'bg-indigo-600/20 text-indigo-400 border-l-4 border-indigo-500'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }
            `}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </a>
        </nav>

        {/* User Section - Always at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center ring-2 ring-indigo-500/30">
              <span className="text-white font-semibold">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-indigo-400 truncate">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-2 w-full px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
        theme="indigo"
      />

      {/* Main Content - With left margin to account for fixed sidebar */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between px-4 lg:px-6">
          <button
            className="lg:hidden text-slate-400 hover:text-white p-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 lg:flex-none">
            <h2 className="text-lg font-semibold text-white capitalize hidden lg:block">
              {activePage === 'dashboard' ? 'Admin Dashboard' : activePage}
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Quick Add User Button */}
            <a
              href="#admin-users"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/25"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Add User</span>
            </a>
            
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>© 2026 EventHub Admin Panel</span>
            <span>v1.0.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
