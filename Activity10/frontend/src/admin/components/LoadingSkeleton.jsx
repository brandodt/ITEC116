import React from 'react';

/**
 * Loading Skeleton Components for Admin Module
 * Indigo/Deep Slate themed skeleton loaders
 */

// Base skeleton pulse animation class
const skeletonBase = "animate-pulse bg-slate-700/50 rounded";

// Stats Card Skeleton
export const StatsCardSkeleton = () => (
  <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5">
    <div className="flex items-center justify-between mb-3">
      <div className={`h-4 w-24 ${skeletonBase}`} />
      <div className={`h-10 w-10 rounded-xl ${skeletonBase}`} />
    </div>
    <div className={`h-8 w-16 ${skeletonBase} mb-2`} />
    <div className={`h-3 w-20 ${skeletonBase}`} />
  </div>
);

// Table Row Skeleton
export const TableRowSkeleton = ({ cols = 5 }) => (
  <tr className="border-b border-slate-700/50">
    {Array(cols).fill(0).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className={`h-4 ${skeletonBase}`} style={{ width: `${60 + Math.random() * 40}%` }} />
      </td>
    ))}
  </tr>
);

// Table Skeleton
export const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-900/50">
          <tr>
            {Array(cols).fill(0).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <div className={`h-4 w-20 ${skeletonBase}`} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array(rows).fill(0).map((_, i) => (
            <TableRowSkeleton key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// User Card Skeleton
export const UserCardSkeleton = () => (
  <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full ${skeletonBase}`} />
      <div className="flex-1">
        <div className={`h-4 w-32 ${skeletonBase} mb-2`} />
        <div className={`h-3 w-40 ${skeletonBase}`} />
      </div>
      <div className={`h-6 w-16 rounded-full ${skeletonBase}`} />
    </div>
  </div>
);

// Event Card Skeleton
export const EventCardSkeleton = () => (
  <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
    <div className="flex items-start gap-4">
      <div className={`w-16 h-16 rounded-lg ${skeletonBase}`} />
      <div className="flex-1">
        <div className={`h-5 w-48 ${skeletonBase} mb-2`} />
        <div className={`h-3 w-32 ${skeletonBase} mb-2`} />
        <div className={`h-3 w-24 ${skeletonBase}`} />
      </div>
      <div className="flex gap-2">
        <div className={`h-8 w-8 rounded-lg ${skeletonBase}`} />
        <div className={`h-8 w-8 rounded-lg ${skeletonBase}`} />
      </div>
    </div>
  </div>
);

// Activity Log Skeleton
export const ActivityLogSkeleton = ({ count = 5 }) => (
  <div className="space-y-3">
    {Array(count).fill(0).map((_, i) => (
      <div key={i} className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
        <div className={`w-8 h-8 rounded-full ${skeletonBase} flex-shrink-0`} />
        <div className="flex-1">
          <div className={`h-4 w-48 ${skeletonBase} mb-2`} />
          <div className={`h-3 w-full ${skeletonBase}`} />
        </div>
        <div className={`h-3 w-16 ${skeletonBase}`} />
      </div>
    ))}
  </div>
);

// Chart Skeleton
export const ChartSkeleton = ({ height = 200 }) => (
  <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
    <div className={`h-5 w-32 ${skeletonBase} mb-4`} />
    <div className={`${skeletonBase}`} style={{ height: `${height}px` }} />
  </div>
);

// Report Summary Skeleton
export const ReportSummarySkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array(4).fill(0).map((_, i) => (
      <StatsCardSkeleton key={i} />
    ))}
  </div>
);

// Page Header Skeleton
export const PageHeaderSkeleton = () => (
  <div className="mb-6">
    <div className={`h-8 w-48 ${skeletonBase} mb-2`} />
    <div className={`h-4 w-64 ${skeletonBase}`} />
  </div>
);

// Full Page Skeleton
export const FullPageSkeleton = () => (
  <div className="space-y-6">
    <PageHeaderSkeleton />
    <ReportSummarySkeleton />
    <TableSkeleton rows={5} cols={6} />
  </div>
);

export default {
  StatsCardSkeleton,
  TableRowSkeleton,
  TableSkeleton,
  UserCardSkeleton,
  EventCardSkeleton,
  ActivityLogSkeleton,
  ChartSkeleton,
  ReportSummarySkeleton,
  PageHeaderSkeleton,
  FullPageSkeleton,
};
