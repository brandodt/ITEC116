import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, AlertTriangle } from 'react-feather';

/**
 * Feedback Components for Admin Module
 * Indigo/Deep Slate themed alerts and feedback
 */

// Alert component
export const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  onClose,
  action,
  actionLabel 
}) => {
  const variants = {
    info: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/30',
      icon: Info,
      iconColor: 'text-indigo-400',
      titleColor: 'text-indigo-300',
    },
    success: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      icon: CheckCircle,
      iconColor: 'text-emerald-400',
      titleColor: 'text-emerald-300',
    },
    warning: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
      titleColor: 'text-amber-300',
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      icon: XCircle,
      iconColor: 'text-red-400',
      titleColor: 'text-red-300',
    },
  };

  const style = variants[type] || variants.info;
  const Icon = style.icon;

  return (
    <div className={`${style.bg} ${style.border} border rounded-xl p-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          {title && (
            <h4 className={`font-medium ${style.titleColor} mb-1`}>{title}</h4>
          )}
          <p className="text-sm text-slate-300">{message}</p>
          {action && actionLabel && (
            <button
              onClick={action}
              className={`mt-3 text-sm font-medium ${style.iconColor} hover:underline`}
            >
              {actionLabel}
            </button>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

// Empty State component
export const EmptyState = ({ 
  icon: Icon = AlertCircle, 
  title, 
  description, 
  action, 
  actionLabel 
}) => (
  <div className="text-center py-12 px-4">
    <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
      <Icon className="w-8 h-8 text-slate-500" />
    </div>
    <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
    <p className="text-slate-400 max-w-sm mx-auto mb-6">{description}</p>
    {action && actionLabel && (
      <button
        onClick={action}
        className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg shadow-indigo-500/25"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

// Confirmation Modal
export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger'
}) => {
  if (!isOpen) return null;

  const buttonVariants = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white',
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-slate-800 rounded-2xl border border-slate-700 p-6 max-w-md w-full shadow-2xl animate-fade-in">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-slate-400 mb-6">{message}</p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${buttonVariants[variant]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// Status Badge
export const StatusBadge = ({ status, size = 'default' }) => {
  const variants = {
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    inactive: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    upcoming: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    confirmed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };

  const sizes = {
    small: 'px-2 py-0.5 text-xs',
    default: 'px-2.5 py-1 text-xs',
    large: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={`
      inline-flex items-center font-medium rounded-full border capitalize
      ${variants[status] || variants.inactive}
      ${sizes[size]}
    `}>
      {status}
    </span>
  );
};

// Role Badge
export const RoleBadge = ({ role }) => {
  const variants = {
    admin: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    organizer: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    staff: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    attendee: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border capitalize
      ${variants[role] || variants.attendee}
    `}>
      {role}
    </span>
  );
};

// Progress Bar
export const ProgressBar = ({ value, max, label, showPercentage = true, variant = 'indigo' }) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  const gradients = {
    indigo: 'from-indigo-500 to-indigo-600',
    emerald: 'from-emerald-500 to-teal-500',
    amber: 'from-amber-500 to-orange-500',
  };

  return (
    <div>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm mb-1">
          {label && <span className="text-slate-400">{label}</span>}
          {showPercentage && <span className="text-white font-medium">{percentage}%</span>}
        </div>
      )}
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${gradients[variant]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default {
  Alert,
  EmptyState,
  ConfirmModal,
  StatusBadge,
  RoleBadge,
  ProgressBar,
};
