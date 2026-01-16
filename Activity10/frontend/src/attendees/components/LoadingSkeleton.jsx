import React from 'react';

/**
 * Loading Skeletons for Attendee Module
 * Shimmer loading states for various components
 */

// Base skeleton with shimmer animation
const SkeletonBase = ({ className = '' }) => (
  <div className={`animate-pulse bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-[length:200%_100%] rounded ${className}`} />
);

// Event Card Skeleton
export const EventCardSkeleton = () => (
  <div className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50">
    {/* Image skeleton */}
    <SkeletonBase className="aspect-[16/10]" />
    
    {/* Content skeleton */}
    <div className="p-4 space-y-3">
      <SkeletonBase className="h-3 w-16 rounded-full" />
      <SkeletonBase className="h-6 w-3/4" />
      <SkeletonBase className="h-4 w-1/2" />
      <div className="flex items-center justify-between pt-2">
        <SkeletonBase className="h-4 w-24" />
        <SkeletonBase className="h-7 w-7 rounded-full" />
      </div>
    </div>
  </div>
);

// Event Grid Skeleton
export const EventGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <EventCardSkeleton key={i} />
    ))}
  </div>
);

// Ticket Card Skeleton
export const TicketCardSkeleton = () => (
  <div className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 flex flex-col sm:flex-row">
    <SkeletonBase className="aspect-video sm:aspect-auto sm:w-48 sm:h-auto" />
    <div className="flex-1 p-4 space-y-3">
      <SkeletonBase className="h-3 w-20 rounded-full" />
      <SkeletonBase className="h-6 w-3/4" />
      <SkeletonBase className="h-4 w-1/2" />
      <div className="flex items-center gap-4 pt-2">
        <SkeletonBase className="h-4 w-24" />
        <SkeletonBase className="h-4 w-20" />
      </div>
    </div>
  </div>
);

// Ticket List Skeleton
export const TicketListSkeleton = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <TicketCardSkeleton key={i} />
    ))}
  </div>
);

// Event Details Skeleton
export const EventDetailsSkeleton = () => (
  <div className="space-y-6">
    {/* Hero Image */}
    <SkeletonBase className="w-full aspect-[21/9] rounded-2xl" />
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-4">
        <SkeletonBase className="h-3 w-24 rounded-full" />
        <SkeletonBase className="h-10 w-3/4" />
        <SkeletonBase className="h-4 w-1/2" />
        <div className="space-y-2 pt-4">
          <SkeletonBase className="h-4 w-full" />
          <SkeletonBase className="h-4 w-full" />
          <SkeletonBase className="h-4 w-5/6" />
          <SkeletonBase className="h-4 w-4/5" />
        </div>
      </div>
      
      {/* Sidebar */}
      <div className="space-y-4">
        <SkeletonBase className="h-48 rounded-xl" />
        <SkeletonBase className="h-12 rounded-lg" />
      </div>
    </div>
  </div>
);

// Stats Card Skeleton
export const StatsCardSkeleton = () => (
  <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 space-y-3">
    <div className="flex items-center justify-between">
      <SkeletonBase className="h-4 w-24" />
      <SkeletonBase className="h-8 w-8 rounded-lg" />
    </div>
    <SkeletonBase className="h-8 w-16" />
    <SkeletonBase className="h-3 w-20" />
  </div>
);

// Dashboard Skeleton
export const AttendeeDashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Stats Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
    
    {/* Tickets Section */}
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SkeletonBase className="h-6 w-32" />
        <SkeletonBase className="h-8 w-24 rounded-lg" />
      </div>
      <TicketListSkeleton count={2} />
    </div>
  </div>
);

// Category Filter Skeleton
export const CategoryFilterSkeleton = () => (
  <div className="flex gap-2 overflow-x-auto pb-2">
    {Array.from({ length: 6 }).map((_, i) => (
      <SkeletonBase key={i} className="h-10 w-24 rounded-full flex-shrink-0" />
    ))}
  </div>
);

export default {
  EventCardSkeleton,
  EventGridSkeleton,
  TicketCardSkeleton,
  TicketListSkeleton,
  EventDetailsSkeleton,
  StatsCardSkeleton,
  AttendeeDashboardSkeleton,
  CategoryFilterSkeleton,
};
