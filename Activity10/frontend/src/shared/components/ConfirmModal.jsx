import React from 'react';
import { AlertTriangle, Trash2, XCircle, LogOut, AlertCircle } from 'react-feather';

/**
 * Shared Confirmation Modal Component
 * Reusable modal for confirming destructive actions
 * Supports different types: delete, cancel, logout, warning
 * Supports themes: emerald (organizer), indigo (admin), sky (attendee)
 */

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // 'delete', 'cancel', 'logout', 'warning'
  theme = 'sky', // 'emerald', 'indigo', 'sky'
  isLoading = false,
  itemName = '', // Optional: name of item being acted upon
}) => {
  if (!isOpen) return null;

  // Icon configurations based on type
  const typeConfig = {
    delete: {
      icon: Trash2,
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-400',
      confirmBg: 'from-red-500 to-red-600',
      confirmHover: 'hover:from-red-600 hover:to-red-700',
    },
    cancel: {
      icon: XCircle,
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-400',
      confirmBg: 'from-amber-500 to-amber-600',
      confirmHover: 'hover:from-amber-600 hover:to-amber-700',
    },
    logout: {
      icon: LogOut,
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-400',
      confirmBg: 'from-red-500 to-red-600',
      confirmHover: 'hover:from-red-600 hover:to-red-700',
    },
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-400',
      confirmBg: 'from-amber-500 to-amber-600',
      confirmHover: 'hover:from-amber-600 hover:to-amber-700',
    },
  };

  // Theme configurations for cancel button accent
  const themeConfig = {
    emerald: {
      cancelHover: 'hover:text-emerald-400',
      ring: 'focus:ring-emerald-500/50',
    },
    indigo: {
      cancelHover: 'hover:text-indigo-400',
      ring: 'focus:ring-indigo-500/50',
    },
    sky: {
      cancelHover: 'hover:text-sky-400',
      ring: 'focus:ring-sky-500/50',
    },
  };

  const currentType = typeConfig[type] || typeConfig.warning;
  const currentTheme = themeConfig[theme] || themeConfig.sky;
  const IconComponent = currentType.icon;

  // Handle keyboard escape
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && !isLoading) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 ${currentType.iconBg} rounded-full flex items-center justify-center`}>
            <IconComponent className={`w-8 h-8 ${currentType.iconColor}`} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 id="confirm-modal-title" className="text-xl font-bold text-white mb-2">
            {title}
          </h3>
          <p className="text-slate-400">
            {message}
            {itemName && (
              <span className="block mt-2 text-white font-medium">
                "{itemName}"
              </span>
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`flex-1 px-4 py-3 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 ${currentTheme.cancelHover} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-3 bg-gradient-to-r ${currentType.confirmBg} text-white font-medium rounded-lg ${currentType.confirmHover} transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <IconComponent className="w-4 h-4" />
                {confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
