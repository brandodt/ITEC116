import React, { useState } from 'react';
import { 
  Search, 
  Calendar,
  MapPin,
  Users,
  Edit2, 
  Trash2, 
  Eye,
  Star,
  DollarSign
} from 'react-feather';
import { StatusBadge } from './Feedback';

/**
 * Event Table Component for Admin
 * Displays all events with actions and filtering
 */

const EventTable = ({ 
  events, 
  onEdit, 
  onDelete, 
  onView,
  onToggleFeatured,
  isLoading 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Get unique categories
  const categories = [...new Set(events.map(e => e.category))];

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatPrice = (price) => {
    if (price === 0) return 'Free';
    return `₱${price.toLocaleString()}`;
  };

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-slate-700/50 flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, organizers, locations..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Category Filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Event
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Organizer
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Capacity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  No events found matching your criteria
                </td>
              </tr>
            ) : (
              filteredEvents.map((event) => (
                <tr 
                  key={event.id} 
                  className="hover:bg-slate-700/20 transition-colors"
                >
                  {/* Event Info */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500/30 to-indigo-700/30 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white truncate">{event.name}</p>
                          {event.featured && (
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-current flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Organizer */}
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-300">{event.organizer}</span>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3">
                    <div className="text-sm text-white">{formatDate(event.date)}</div>
                    <div className="text-xs text-slate-400">{event.time}</div>
                  </td>

                  {/* Capacity */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-[80px]">
                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
                            style={{ width: `${Math.min((event.registrations / event.capacity) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">
                        {event.registrations}/{event.capacity}
                      </span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${
                      event.price === 0 ? 'text-emerald-400' : 'text-white'
                    }`}>
                      {formatPrice(event.price)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <StatusBadge status={event.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onView?.(event)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onToggleFeatured?.(event)}
                        className={`p-2 rounded-lg transition-colors ${
                          event.featured
                            ? 'text-amber-400 hover:bg-amber-500/10'
                            : 'text-slate-400 hover:text-amber-400 hover:bg-amber-500/10'
                        }`}
                        title={event.featured ? 'Remove Featured' : 'Mark as Featured'}
                      >
                        <Star className={`w-4 h-4 ${event.featured ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => onEdit?.(event)}
                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete?.(event)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-700/50 flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Showing {filteredEvents.length} of {events.length} events
        </p>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span>Total Revenue:</span>
          <span className="font-semibold text-indigo-400">
            ₱{filteredEvents.reduce((sum, e) => sum + (e.price * e.registrations), 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventTable;
