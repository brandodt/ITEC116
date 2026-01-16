import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Calendar,
  ArrowLeft,
  Download,
  RefreshCw,
  CheckCircle
} from 'react-feather';
import OrganizerLayout from '../components/OrganizerLayout';
import AttendeeTable from '../components/AttendeeTable';
import { AttendeeTableSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/Feedback';
import { 
  fetchEvents, 
  fetchEventAttendees, 
  updateAttendeeCheckIn,
  exportAttendeeList 
} from '../services/eventService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Attendee Overview Page
 * Displays registered attendees for selected event with status management
 * Uses Emerald/Teal color palette
 */

const AttendeeOverview = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingAttendees, setIsLoadingAttendees] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Load events on mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoadingEvents(true);
        const data = await fetchEvents();
        setEvents(data);
        // Auto-select first event if available
        if (data.length > 0) {
          setSelectedEventId(data[0].id);
        }
      } catch (error) {
        toast.error('Failed to load events');
        console.error('Load events error:', error);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    loadEvents();
  }, []);

  // Load attendees when event is selected
  const loadAttendees = useCallback(async () => {
    if (!selectedEventId) {
      setAttendees([]);
      return;
    }

    try {
      setIsLoadingAttendees(true);
      const data = await fetchEventAttendees(selectedEventId);
      setAttendees(data);
    } catch (error) {
      toast.error('Failed to load attendees');
      console.error('Load attendees error:', error);
    } finally {
      setIsLoadingAttendees(false);
    }
  }, [selectedEventId]);

  useEffect(() => {
    loadAttendees();
  }, [loadAttendees]);

  // Get selected event details
  const selectedEvent = events.find(e => e.id === selectedEventId);

  // Handle check-in
  const handleCheckIn = async (attendee) => {
    try {
      await updateAttendeeCheckIn(attendee.id, true);
      setAttendees(prev => 
        prev.map(a => 
          a.id === attendee.id 
            ? { ...a, checkedIn: true, checkInTime: new Date().toISOString() }
            : a
        )
      );
      toast.success(`${attendee.name} checked in successfully!`);
    } catch (error) {
      toast.error('Failed to check in attendee');
      console.error('Check-in error:', error);
    }
  };

  // Handle export
  const handleExport = async () => {
    if (!selectedEventId) return;

    try {
      setIsExporting(true);
      const csvData = await exportAttendeeList(selectedEventId);
      
      // Create and download file
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `attendees-${selectedEvent?.name?.replace(/\s+/g, '-') || 'export'}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Attendee list exported successfully!');
    } catch (error) {
      toast.error('Failed to export attendee list');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Calculate stats
  const totalAttendees = attendees.length;
  const checkedInCount = attendees.filter(a => a.checkedIn).length;
  const checkInRate = totalAttendees > 0 
    ? Math.round((checkedInCount / totalAttendees) * 100) 
    : 0;

  if (isLoadingEvents) {
    return (
      <OrganizerLayout activePage="attendees">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Attendee Overview</h1>
          <p className="text-slate-400">Loading events...</p>
        </div>
        <AttendeeTableSkeleton rows={5} />
      </OrganizerLayout>
    );
  }

  if (events.length === 0) {
    return (
      <OrganizerLayout activePage="attendees">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Attendee Overview</h1>
          <p className="text-slate-400">View and manage event attendees</p>
        </div>
        <EmptyState
          icon={Calendar}
          title="No events available"
          description="Create an event first to view and manage attendees."
          action={() => window.location.href = '#organizer-events'}
          actionLabel="Go to Events"
        />
      </OrganizerLayout>
    );
  }

  return (
    <OrganizerLayout activePage="attendees">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <Users className="w-6 h-6 text-emerald-500" />
          Attendee Overview
        </h1>
        <p className="text-slate-400">
          View and manage registered attendees for your events
        </p>
      </div>

      {/* Event Selector */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Event Select */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Select Event
            </label>
            <select
              value={selectedEventId || ''}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full max-w-md px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
            >
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.name} ({event.registeredCount} registered)
                </option>
              ))}
            </select>
          </div>

          {/* Stats Summary */}
          {selectedEvent && (
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{totalAttendees}</p>
                <p className="text-xs text-slate-400">Registered</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">{checkedInCount}</p>
                <p className="text-xs text-slate-400">Checked In</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-teal-400">{checkInRate}%</p>
                <p className="text-xs text-slate-400">Rate</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={loadAttendees}
              disabled={isLoadingAttendees}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingAttendees ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Selected Event Info */}
        {selectedEvent && (
          <div className="mt-4 pt-4 border-t border-slate-700 flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-emerald-500" />
              {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <span>•</span>
            <span>{selectedEvent.time}</span>
            <span>•</span>
            <span>{selectedEvent.location}</span>
            <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium capitalize ${
              selectedEvent.status === 'upcoming' 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'bg-slate-500/20 text-slate-400'
            }`}>
              {selectedEvent.status}
            </span>
          </div>
        )}
      </div>

      {/* Capacity Progress */}
      {selectedEvent && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Registration Capacity</span>
            <span className="text-sm font-medium text-white">
              {totalAttendees} / {selectedEvent.capacity}
            </span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((totalAttendees / selectedEvent.capacity) * 100, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
            <span>{Math.round((totalAttendees / selectedEvent.capacity) * 100)}% filled</span>
            <span>{selectedEvent.capacity - totalAttendees} spots remaining</span>
          </div>
        </div>
      )}

      {/* Attendee Table */}
      {isLoadingAttendees ? (
        <AttendeeTableSkeleton rows={5} />
      ) : (
        <AttendeeTable
          attendees={attendees}
          eventName={selectedEvent?.name}
          isLoading={isLoadingAttendees}
          onCheckIn={handleCheckIn}
          onExport={handleExport}
        />
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="!bg-slate-800 !border !border-slate-700"
      />
    </OrganizerLayout>
  );
};

export default AttendeeOverview;
