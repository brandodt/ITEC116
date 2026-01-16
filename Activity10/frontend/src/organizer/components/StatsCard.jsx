import React from 'react';
import { TrendingUp, TrendingDown } from 'react-feather';

/**
 * Stats Card Component
 * Displays a single statistic with optional trend indicator
 * Uses Emerald/Teal color palette
 */

const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendValue,
  variant = 'default' 
}) => {
  const variants = {
    default: {
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
    },
    teal: {
      iconBg: 'bg-teal-500/20',
      iconColor: 'text-teal-400',
    },
    success: {
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-400',
    },
    warning: {
      iconBg: 'bg-yellow-500/20',
      iconColor: 'text-yellow-400',
    },
    info: {
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
    },
  };

  const { iconBg, iconColor } = variants[variant] || variants.default;

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-400';
    if (trend === 'down') return 'text-red-400';
    return 'text-slate-400';
  };

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-emerald-500/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-400 font-medium">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${iconBg}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-slate-500">{subtitle}</p>
          )}
        </div>
        
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
