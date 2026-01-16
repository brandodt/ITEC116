import React from 'react';
import { Calendar, MapPin, Users, Clock, Edit2, Trash2 } from 'react-feather';

/**
 * Event Card Component
 * Displays event information in a card format
 * Uses Emerald/Teal color palette
 */

const EventCard = ({ 
  event, 
  onView, 
  onEdit, 
  onDelete,
  showActions = true 
}) => {
  const {
    name,
    date,
    time,
    location,
    capacity = 0,
    registeredCount = 0,
    status,
    category,
    imageUrl,
    coverImage,
  } = event;

  // Get the cover image URL (support both imageUrl and coverImage fields)
  const eventCoverImage = imageUrl || coverImage;

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  // Calculate capacity percentage
  const safeCapacity = capacity || 0;
  const safeRegistered = registeredCount || 0;
  const capacityPercent = safeCapacity > 0 ? Math.round((safeRegistered / safeCapacity) * 100) : 0;
  const isAlmostFull = capacityPercent >= 90;
  const isFull = capacityPercent >= 100;

  // Status badge styles
  const getStatusStyle = () => {
    switch (status) {
      case 'upcoming':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'ongoing':
        return 'bg-teal-500/20 text-teal-400 border-teal-500/30';
      case 'completed':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 group overflow-hidden">
      {/* Cover Image */}
      {eventCoverImage && (
        <div className="relative h-40 w-full overflow-hidden">
          <img
            src={eventCoverImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-800/80 to-transparent" />
          {/* Status badge on image */}
          <span className={`absolute top-3 right-3 px-3 py-1 text-xs font-medium rounded-full border capitalize backdrop-blur-sm ${getStatusStyle()}`}>
            {status}
          </span>
        </div>
      )}
      
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
              {name}
            </h3>
            {category && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium text-teal-400 bg-teal-500/10 rounded">
                {category}
              </span>
            )}
          </div>
          {/* Only show status badge here if no cover image */}
          {!eventCoverImage && (
            <span className={`px-3 py-1 text-xs font-medium rounded-full border capitalize ${getStatusStyle()}`}>
              {status}
            </span>
          )}
        </div>

        {/* Event Details */}
        <div className="space-y-2 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span>{formatDate(date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Users className="w-4 h-4" />
              Registrations
            </span>
            <span className={`font-medium ${isFull ? 'text-red-400' : isAlmostFull ? 'text-yellow-400' : 'text-emerald-400'}`}>
              {safeRegistered} / {safeCapacity}
            </span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isFull ? 'bg-red-500' : isAlmostFull ? 'bg-yellow-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
              }`}
              style={{ width: `${Math.min(capacityPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                if (onEdit) onEdit(event);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-emerald-400 hover:text-white hover:bg-emerald-600 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => {
                if (onDelete) onDelete(event);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-400 hover:text-white hover:bg-red-600 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
