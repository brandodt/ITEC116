import React from 'react';
import { Calendar, MapPin, Users, Tag } from 'react-feather';

/**
 * Event Card Component
 * Displays event information in a card format for the discovery grid
 * Sky Blue/Violet color palette
 */

const EventCard = ({ event, onClick, variant = 'default' }) => {
  const isFeatured = variant === 'featured' || event.featured;
  const registrations = event.registrations ?? event.registeredCount ?? 0;
  const capacity = event.capacity ?? 0;
  const spotsLeft = capacity - registrations;
  const isAlmostFull = spotsLeft <= 10 && spotsLeft > 0;
  const isFull = spotsLeft <= 0;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Get the minimum price from ticketPrices or use price field
  const getEventPrice = () => {
    if (event.price !== undefined && event.price !== null) {
      return event.price;
    }
    if (event.ticketPrices && typeof event.ticketPrices === 'object') {
      const prices = Object.values(event.ticketPrices).filter(p => typeof p === 'number');
      if (prices.length > 0) {
        return Math.min(...prices);
      }
    }
    return 0; // Free by default
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null || price === 0) return 'Free';
    return `₱${price.toLocaleString()}`;
  };

  const eventPrice = getEventPrice();

  return (
    <div
      onClick={() => onClick?.(event)}
      className={`group relative bg-slate-800/50 rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-sky-500/10 ${
        isFeatured
          ? 'border-sky-500/30 ring-1 ring-sky-500/20'
          : 'border-slate-700/50 hover:border-sky-500/30'
      }`}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-3 left-3 z-10 px-2 py-1 bg-gradient-to-r from-sky-500 to-violet-600 text-white text-xs font-semibold rounded-full shadow-lg">
          ⭐ Featured
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {event.image ? (
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sky-600 to-violet-700 flex items-center justify-center">
            <Calendar className="w-12 h-12 text-white/50" />
          </div>
        )}
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
        
        {/* Date Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-slate-900/80 backdrop-blur-sm rounded-lg text-white text-sm">
          <Calendar className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-medium">{formatDate(event.date)}</span>
        </div>

        {/* Price Badge */}
        <div className={`absolute bottom-3 right-3 px-2 py-1 rounded-lg text-sm font-bold ${
          eventPrice === 0 
            ? 'bg-emerald-500/90 text-white' 
            : 'bg-white/90 text-slate-900'
        }`}>
          {formatPrice(eventPrice)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="flex items-center gap-1 text-xs text-sky-400 mb-2">
          <Tag className="w-3 h-3" />
          <span className="capitalize">{event.category}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-sky-400 transition-colors">
          {event.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-3">
          <MapPin className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>

        {/* Capacity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-slate-500" />
            {isFull ? (
              <span className="text-sm text-red-400 font-medium">Sold Out</span>
            ) : isAlmostFull ? (
              <span className="text-sm text-amber-400 font-medium">
                Only {spotsLeft} spots left!
              </span>
            ) : (
              <span className="text-sm text-slate-400">
                {spotsLeft} spots available
              </span>
            )}
          </div>

          {/* Organizer Avatar */}
          {event.organizerLogo && (
            <img
              src={event.organizerLogo}
              alt={event.organizer}
              className="w-7 h-7 rounded-full ring-2 ring-slate-700"
              title={event.organizer}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
