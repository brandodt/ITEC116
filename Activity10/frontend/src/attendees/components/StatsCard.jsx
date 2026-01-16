import React from 'react';

/**
 * Stats Card Component for Attendee Dashboard
 * Displays statistics with Sky Blue/Violet gradient
 */

const StatsCard = ({ title, value, subtitle, icon: Icon, variant = 'default' }) => {
  const variants = {
    default: {
      iconBg: 'bg-slate-700/50',
      iconColor: 'text-slate-400',
      valueBg: '',
    },
    primary: {
      iconBg: 'bg-sky-500/20',
      iconColor: 'text-sky-400',
      valueBg: 'bg-gradient-to-r from-sky-400 to-sky-500 bg-clip-text text-transparent',
    },
    violet: {
      iconBg: 'bg-violet-500/20',
      iconColor: 'text-violet-400',
      valueBg: 'bg-gradient-to-r from-violet-400 to-violet-500 bg-clip-text text-transparent',
    },
    success: {
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      valueBg: 'bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent',
    },
    warning: {
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-400',
      valueBg: 'bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent',
    },
  };

  const style = variants[variant] || variants.default;

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 hover:border-sky-500/30 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-400">{title}</p>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.iconBg}`}>
            <Icon className={`w-5 h-5 ${style.iconColor}`} />
          </div>
        )}
      </div>
      <p className={`text-3xl font-bold ${style.valueBg || 'text-white'}`}>
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
};

export default StatsCard;
