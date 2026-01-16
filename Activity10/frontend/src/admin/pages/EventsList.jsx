import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar,
  Plus,
  Download,
  RefreshCw,
  Eye,
  Edit2,
  Trash2,
  Star
} from 'react-feather';
import AdminLayout from '../components/AdminLayout';
import EventTable from '../components/EventTable';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { EmptyState, ConfirmModal } from '../components/Feedback';
import { fetchAllEvents, deleteEvent, toggleEventFeatured } from '../services/adminService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Events List Page (Admin)
 * View all events across all organizers with admin controls
 * Indigo/Deep Slate color palette
 */

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Load events
  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllEvents();
      setEvents(data);
    } catch (error) {
      toast.error('Failed to load events');
      console.error('Load error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Handle view event
  const handleView = (event) => {
    window.location.hash = `admin-event/${event.id}`;
  };

  // Handle edit event
  const handleEdit = (event) => {
    window.location.hash = `admin-event/${event.id}?edit=true`;
  };

  // Handle delete event
  const handleDeleteClick = (event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEvent) return;

    try {
      await deleteEvent(selectedEvent.id);
      toast.success('Event deleted successfully');
      loadEvents();
    } catch (error) {
      toast.error('Failed to delete event');
    }
    setSelectedEvent(null);
  };

  // Handle toggle featured
  const handleToggleFeatured = async (event) => {
    try {
      await toggleEventFeatured(event.id);
      toast.success(event.featured ? 'Event unfeatured' : 'Event marked as featured');
      loadEvents();
    } catch (error) {
      toast.error('Failed to update event');
    }
  };

  // Calculate stats
  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
  const completedEvents = events.filter(e => e.status === 'completed').length;
  const totalRegistrations = events.reduce((sum, e) => sum + e.registrations, 0);

  return (
    <AdminLayout activePage="events">
      {/* Page Header */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-400" />
            All Events
          </h1>
          <p className="text-slate-400">
            Manage all events across the platform
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={loadEvents}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <p className="text-sm text-slate-400 mb-1">Total Events</p>
          <p className="text-2xl font-bold text-white">{totalEvents}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <p className="text-sm text-slate-400 mb-1">Upcoming</p>
          <p className="text-2xl font-bold text-indigo-400">{upcomingEvents}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <p className="text-sm text-slate-400 mb-1">Completed</p>
          <p className="text-2xl font-bold text-emerald-400">{completedEvents}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <p className="text-sm text-slate-400 mb-1">Total Registrations</p>
          <p className="text-2xl font-bold text-amber-400">{totalRegistrations}</p>
        </div>
      </div>

      {/* Events Table */}
      {isLoading ? (
        <TableSkeleton rows={6} cols={7} />
      ) : events.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No events yet"
          description="No events have been created on the platform yet."
        />
      ) : (
        <EventTable
          events={events}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onToggleFeatured={handleToggleFeatured}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedEvent(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Event"
        message={`Are you sure you want to delete "${selectedEvent?.name}"? This action cannot be undone and will remove all associated registrations.`}
        confirmLabel="Delete Event"
        variant="danger"
      />

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
    </AdminLayout>
  );
};

export default EventsList;
