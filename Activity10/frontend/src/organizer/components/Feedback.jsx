import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'react-feather';

/**
 * Feedback Components
 * Toast notifications and inline feedback messages
 * Uses Emerald/Teal color palette
 */

// Toast notification variants
const toastVariants = {
  success: {
    bg: 'bg-emerald-500/20 border-emerald-500/40',
    icon: CheckCircle,
    iconColor: 'text-emerald-400',
    title: 'Success',
  },
  error: {
    bg: 'bg-red-500/20 border-red-500/40',
    icon: XCircle,
    iconColor: 'text-red-400',
    title: 'Error',
  },
  warning: {
    bg: 'bg-yellow-500/20 border-yellow-500/40',
    icon: AlertCircle,
    iconColor: 'text-yellow-400',
    title: 'Warning',
  },
  info: {
    bg: 'bg-blue-500/20 border-blue-500/40',
    icon: Info,
    iconColor: 'text-blue-400',
    title: 'Info',
  },
};

// Toast notification component
export const Toast = ({ 
  type = 'info', 
  title, 
  message, 
  onClose,
  autoClose = true,
  duration = 5000 
}) => {
  const variant = toastVariants[type] || toastVariants.info;
  const Icon = variant.icon;

  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <div className={`
      flex items-start gap-3 p-4 rounded-xl border ${variant.bg}
      shadow-lg backdrop-blur-sm animate-slide-in-top
    `}>
      <Icon className={`w-5 h-5 ${variant.iconColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white">{title || variant.title}</p>
        {message && (
          <p className="text-sm text-slate-300 mt-1">{message}</p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// Inline feedback message
export const InlineFeedback = ({ type = 'info', message, className = '' }) => {
  const variant = toastVariants[type] || toastVariants.info;
  const Icon = variant.icon;

  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg ${variant.bg} ${className}`}>
      <Icon className={`w-4 h-4 ${variant.iconColor} flex-shrink-0`} />
      <span className="text-sm text-slate-200">{message}</span>
    </div>
  );
};

// Empty state component
export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  actionLabel,
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    {Icon && (
      <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-500" />
      </div>
    )}
    <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
    {description && (
      <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
    )}
    {action && actionLabel && (
      <button
        onClick={action}
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

// Loading spinner
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <svg
      className={`animate-spin ${sizes[size]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// Full page loader
export const PageLoader = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px]">
    <Spinner size="xl" className="text-emerald-500 mb-4" />
    <p className="text-slate-400">{message}</p>
  </div>
);

export default { Toast, InlineFeedback, EmptyState, Spinner, PageLoader };
