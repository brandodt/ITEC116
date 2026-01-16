import React from 'react';
import { Calendar, MapPin, Clock, Tag, Edit2 } from 'react-feather';

/**
 * Ticket Card Component
 * Displays ticket information with QR code access
 */

const TicketCard = ({ ticket, onViewQR, onCancel, onUpdate }) => {
  const eventDate = new Date(ticket.eventDate);
  const isPast = eventDate < new Date();
  const isToday = eventDate.toDateString() === new Date().toDateString();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = () => {
    if (ticket.status === 'cancelled') {
      return (
        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full">
          Cancelled
        </span>
      );
    }
    if (ticket.checkedIn) {
      return (
        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
          Checked In
        </span>
      );
    }
    if (isPast) {
      return (
        <span className="px-2 py-1 bg-slate-500/20 text-slate-400 text-xs font-medium rounded-full">
          Expired
        </span>
      );
    }
    if (isToday) {
      return (
        <span className="px-2 py-1 bg-sky-500/20 text-sky-400 text-xs font-medium rounded-full animate-pulse">
          Today!
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-violet-500/20 text-violet-400 text-xs font-medium rounded-full">
        Valid
      </span>
    );
  };

  const canShowQR = ticket.status === 'valid' && !isPast && !ticket.checkedIn;

  return (
    <div className={`bg-slate-800/50 rounded-2xl overflow-hidden border transition-all duration-300 ${
      isPast || ticket.status === 'cancelled'
        ? 'border-slate-700/30 opacity-70'
        : 'border-slate-700/50 hover:border-sky-500/30'
    }`}>
      <div className="flex flex-col sm:flex-row">
        {/* Event Image */}
        <div className="relative sm:w-48 flex-shrink-0">
          {ticket.eventImage ? (
            <img
              src={ticket.eventImage}
              alt={ticket.eventName}
              className="w-full h-32 sm:h-full object-cover"
            />
          ) : (
            <div className="w-full h-32 sm:h-full bg-gradient-to-br from-sky-600 to-violet-700 flex items-center justify-center">
              <Tag className="w-8 h-8 text-white/50" />
            </div>
          )}
          
          {/* Status Overlay for mobile */}
          <div className="absolute top-2 right-2 sm:hidden">
            {getStatusBadge()}
          </div>
        </div>

        {/* Ticket Details */}
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs text-sky-400 mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {ticket.ticketType}
              </p>
              <h3 className="text-lg font-semibold text-white line-clamp-1">
                {ticket.eventName}
              </h3>
            </div>
            <div className="hidden sm:block">
              {getStatusBadge()}
            </div>
          </div>

          <div className="space-y-1.5 text-sm text-slate-400 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-violet-400 flex-shrink-0" />
              <span>{formatDate(ticket.eventDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-400 flex-shrink-0" />
              <span>{ticket.eventTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-violet-400 flex-shrink-0" />
              <span className="truncate">{ticket.eventLocation}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-auto pt-2 border-t border-slate-700/50">
            {canShowQR && (
              <button
                onClick={() => onViewQR?.(ticket)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-violet-600 text-white text-sm font-medium rounded-lg hover:from-sky-600 hover:to-violet-700 transition-all shadow-lg shadow-sky-500/25"
              >
                <Tag className="w-4 h-4" />
                Show QR Code
              </button>
            )}
            
            {!isPast && ticket.status === 'valid' && !ticket.checkedIn && (
              <>
                <button
                  onClick={() => onUpdate?.(ticket)}
                  className="px-4 py-2 text-sm text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => onCancel?.(ticket)}
                  className="px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </>
            )}
            
            {(isPast || ticket.status === 'cancelled' || ticket.checkedIn) && (
              <p className="text-sm text-slate-500">
                {ticket.checkedIn ? 'You attended this event' : 
                 ticket.status === 'cancelled' ? 'This ticket was cancelled' :
                 'This event has passed'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Ticket ID Footer */}
      <div className="px-4 py-2 bg-slate-900/50 border-t border-slate-700/30">
        <p className="text-xs text-slate-500 font-mono">
          Ticket ID: {ticket.id}
        </p>
      </div>
    </div>
  );
};

export default TicketCard;
