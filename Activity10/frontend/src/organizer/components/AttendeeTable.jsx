import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  CheckCircle, 
  XCircle, 
  Mail,
  Briefcase,
  ChevronUp,
  ChevronDown,
  Filter
} from 'react-feather';
import { Spinner, EmptyState } from './Feedback';

/**
 * Attendee Table Component
 * Displays registered attendees with search, filter, and sorting
 * Uses Emerald/Teal color palette
 */

const AttendeeTable = ({ 
  attendees = [], 
  eventName = '',
  isLoading = false,
  onCheckIn,
  onExport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [selectedAttendees, setSelectedAttendees] = useState([]);

  // Filter and sort attendees
  const filteredAttendees = useMemo(() => {
    let result = [...attendees];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.name.toLowerCase().includes(query) ||
        a.email.toLowerCase().includes(query) ||
        (a.company && a.company.toLowerCase().includes(query)) ||
        a.ticketCode.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(a => 
        statusFilter === 'checked-in' ? a.checkedIn : !a.checkedIn
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      // Handle null/undefined values
      if (aVal == null) aVal = '';
      if (bVal == null) bVal = '';

      // String comparison
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [attendees, searchQuery, statusFilter, sortConfig]);

  // Handle sort column click
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedAttendees(filteredAttendees.map(a => a.id));
    } else {
      setSelectedAttendees([]);
    }
  };

  // Handle individual select
  const handleSelectOne = (id) => {
    setSelectedAttendees(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateStr).toLocaleString('en-US', options);
  };

  // Sort indicator component
  const SortIndicator = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <span className="text-slate-600 ml-1">↕</span>;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 inline text-emerald-400" />
      : <ChevronDown className="w-4 h-4 inline text-emerald-400" />;
  };

  // Stats summary
  const checkedInCount = attendees.filter(a => a.checkedIn).length;
  const totalCount = attendees.length;

  if (isLoading) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-8">
        <div className="flex items-center justify-center">
          <Spinner size="lg" className="text-emerald-500" />
          <span className="ml-3 text-slate-400">Loading attendees...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Registered Attendees
            </h3>
            {eventName && (
              <p className="text-sm text-slate-400">{eventName}</p>
            )}
          </div>
          
          {/* Summary Stats */}
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-400">
              Total: <span className="text-white font-medium">{totalCount}</span>
            </span>
            <span className="text-slate-400">
              Checked In: <span className="text-emerald-400 font-medium">{checkedInCount}</span>
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, email, company, or ticket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="registered">Registered</option>
              <option value="checked-in">Checked In</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={() => onExport?.()}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      {filteredAttendees.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No attendees found"
          description={
            searchQuery || statusFilter !== 'all'
              ? "Try adjusting your search or filter criteria"
              : "No attendees have registered for this event yet"
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-700">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedAttendees.length === filteredAttendees.length && filteredAttendees.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500/50"
                  />
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('name')}
                >
                  Name <SortIndicator columnKey="name" />
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('email')}
                >
                  Email <SortIndicator columnKey="email" />
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('company')}
                >
                  Company <SortIndicator columnKey="company" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Ticket Code
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('checkedIn')}
                >
                  Status <SortIndicator columnKey="checkedIn" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendees.map((attendee, index) => (
                <tr 
                  key={attendee.id}
                  className={`
                    border-b border-slate-700/50 transition-colors
                    ${index % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-800/10'}
                    hover:bg-slate-700/30
                  `}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedAttendees.includes(attendee.id)}
                      onChange={() => handleSelectOne(attendee.id)}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500/50"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-white font-medium">{attendee.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{attendee.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {attendee.company ? (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-sm">{attendee.company}</span>
                      </div>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs bg-slate-700/50 px-2 py-1 rounded text-teal-400">
                      {attendee.ticketCode}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    {attendee.checkedIn ? (
                      <div className="flex items-center gap-1.5">
                        <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Checked In
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatDate(attendee.checkInTime)}
                        </span>
                      </div>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-slate-600/30 text-slate-400 rounded-full">
                        <XCircle className="w-3 h-3" />
                        Registered
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {!attendee.checkedIn && (
                      <button
                        onClick={() => onCheckIn?.(attendee)}
                        className="text-sm text-emerald-400 hover:text-emerald-300 font-medium"
                      >
                        Check In
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer with count */}
      {filteredAttendees.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-700 text-sm text-slate-400">
          Showing {filteredAttendees.length} of {totalCount} attendees
          {selectedAttendees.length > 0 && (
            <span className="ml-4 text-emerald-400">
              {selectedAttendees.length} selected
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendeeTable;
