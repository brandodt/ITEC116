import React from 'react';
import { LogOut, AlertTriangle } from 'react-feather';

/**
 * Shared Logout Confirmation Modal Component
 * Custom styled modal to confirm logout action
 * Supports different color themes for each module
 */

const LogoutConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  theme = 'emerald' // 'emerald' for organizer, 'indigo' for admin, 'sky' for attendee
}) => {
  if (!isOpen) return null;

  // Theme configurations
  const themes = {
    emerald: {
      name: 'Organizer',
      gradient: 'from-emerald-500 to-teal-600',
    },
    indigo: {
      name: 'Admin',
      gradient: 'from-indigo-500 to-indigo-700',
    },
    sky: {
      name: 'Attendee',
      gradient: 'from-sky-500 to-violet-600',
    },
  };

  const currentTheme = themes[theme] || themes.emerald;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-amber-400" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">Sign Out?</h3>
          <p className="text-slate-400">
            Are you sure you want to sign out of your {currentTheme.name.toLowerCase()} account? 
            You'll need to log in again to access your dashboard.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
