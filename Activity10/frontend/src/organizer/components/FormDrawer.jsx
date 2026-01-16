import React from 'react';
import { X } from 'react-feather';

/**
 * Form Drawer Component
 * Slide-out panel for forms and detailed views
 * Uses Emerald/Teal color palette
 */

const FormDrawer = ({ isOpen, title, onClose, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'w-full sm:w-[400px]',
    md: 'w-full sm:w-[520px]',
    lg: 'w-full sm:w-[640px]',
    xl: 'w-full sm:w-[800px]',
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Drawer Panel */}
      <div className={`
        absolute right-0 top-0 h-full ${sizeClasses[size]}
        bg-slate-800 border-l border-slate-700
        shadow-2xl flex flex-col
        animate-slide-in-right
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/95">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 pb-24">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormDrawer;
