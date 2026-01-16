import React from 'react';

/**
 * Loading Skeleton Components
 * Used to display placeholder content while data is loading
 * Provides visual feedback and improves perceived performance
 */

// Base skeleton pulse animation
const SkeletonPulse = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-700/50 rounded ${className}`} />
);

// Card skeleton for event cards
export const EventCardSkeleton = () => (
  <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <SkeletonPulse className="h-6 w-3/4 mb-2" />
        <SkeletonPulse className="h-4 w-1/2" />
      </div>
      <SkeletonPulse className="h-6 w-20 rounded-full" />
    </div>
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <SkeletonPulse className="h-4 w-4" />
        <SkeletonPulse className="h-4 w-32" />
      </div>
      <div className="flex items-center gap-2">
        <SkeletonPulse className="h-4 w-4" />
        <SkeletonPulse className="h-4 w-40" />
      </div>
      <div className="flex items-center gap-2">
        <SkeletonPulse className="h-4 w-4" />
        <SkeletonPulse className="h-4 w-24" />
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
      <SkeletonPulse className="h-4 w-28" />
      <div className="flex gap-2">
        <SkeletonPulse className="h-8 w-16 rounded-lg" />
        <SkeletonPulse className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  </div>
);

// Stats card skeleton
export const StatsCardSkeleton = () => (
  <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
    <div className="flex items-center justify-between mb-3">
      <SkeletonPulse className="h-4 w-24" />
      <SkeletonPulse className="h-10 w-10 rounded-lg" />
    </div>
    <SkeletonPulse className="h-8 w-16 mb-1" />
    <SkeletonPulse className="h-3 w-20" />
  </div>
);

// Table row skeleton
export const TableRowSkeleton = ({ columns = 5 }) => (
  <tr className="border-b border-slate-700">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-4">
        <SkeletonPulse className="h-4 w-full max-w-[120px]" />
      </td>
    ))}
  </tr>
);

// Attendee table skeleton
export const AttendeeTableSkeleton = ({ rows = 5 }) => (
  <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
    {/* Header */}
    <div className="px-4 py-3 border-b border-slate-700 flex items-center gap-4">
      <SkeletonPulse className="h-8 w-48" />
      <SkeletonPulse className="h-8 w-32" />
    </div>
    
    {/* Table */}
    <table className="w-full">
      <thead>
        <tr className="border-b border-slate-700 bg-slate-800/50">
          <th className="px-4 py-3 text-left"><SkeletonPulse className="h-4 w-24" /></th>
          <th className="px-4 py-3 text-left"><SkeletonPulse className="h-4 w-28" /></th>
          <th className="px-4 py-3 text-left"><SkeletonPulse className="h-4 w-20" /></th>
          <th className="px-4 py-3 text-left"><SkeletonPulse className="h-4 w-16" /></th>
          <th className="px-4 py-3 text-left"><SkeletonPulse className="h-4 w-20" /></th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} columns={5} />
        ))}
      </tbody>
    </table>
  </div>
);

// Dashboard skeleton
export const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
    
    {/* Events Grid */}
    <div>
      <div className="flex items-center justify-between mb-4">
        <SkeletonPulse className="h-6 w-32" />
        <SkeletonPulse className="h-10 w-28 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

// Form skeleton
export const FormSkeleton = () => (
  <div className="space-y-6">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i}>
        <SkeletonPulse className="h-4 w-24 mb-2" />
        <SkeletonPulse className="h-10 w-full rounded-lg" />
      </div>
    ))}
    <div className="flex gap-3 pt-4">
      <SkeletonPulse className="h-10 w-24 rounded-lg" />
      <SkeletonPulse className="h-10 w-24 rounded-lg" />
    </div>
  </div>
);

export default {
  EventCardSkeleton,
  StatsCardSkeleton,
  TableRowSkeleton,
  AttendeeTableSkeleton,
  DashboardSkeleton,
  FormSkeleton,
};
