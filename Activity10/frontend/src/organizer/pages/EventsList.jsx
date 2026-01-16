import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  Calendar,
  Grid,
  List,
  RefreshCw
} from 'react-feather';
import OrganizerLayout from '../components/OrganizerLayout';
import EventCard from '../components/EventCard';
import FormDrawer from '../components/FormDrawer';
import EventForm from '../components/EventForm';
import { EventCardSkeleton } from '../components/LoadingSkeleton';
import { EmptyState, Spinner } from '../components/Feedback';
import { ConfirmModal } from '../../shared';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../services/eventService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Events List Page
 * Displays all organizer's events with search, filter, and CRUD operations
 * Uses Emerald/Teal color palette
 */

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [isEventDrawerOpen, setIsEventDrawerOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load events
  const loadEvents = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      else setIsRefreshing(true);
      
      const data = await fetchEvents();
      setEvents(data);
    } catch (error) {
      toast.error('Failed to load events');
      console.error('Load events error:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = new Set(events.map(e => e.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [events]);

  // Filter and search events
  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(e => 
        e.name.toLowerCase().includes(query) ||
        e.location.toLowerCase().includes(query) ||
        (e.description && e.description.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(e => e.status === statusFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(e => e.category === categoryFilter);
    }

    // Sort by date (upcoming first)
    result.sort((a, b) => new Date(a.date) - new Date(b.date));

    return result;
  }, [events, searchQuery, statusFilter, categoryFilter]);

  // Handle create event
  const handleCreateEvent = async (eventData) => {
    try {
      setIsSubmitting(true);
      const newEvent = await createEvent(eventData);
      setEvents(prev => [newEvent, ...prev]);
      setIsEventDrawerOpen(false);
      toast.success('Event created successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to create event');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle update event
  const handleUpdateEvent = async (eventData) => {
    if (!editingEvent) return;
    
    try {
      setIsSubmitting(true);
      const updated = await updateEvent(editingEvent.id, eventData);
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? updated : e));
      setIsEventDrawerOpen(false);
      setEditingEvent(null);
      toast.success('Event updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update event');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete event - show confirmation modal
  const handleDeleteEvent = (event) => {
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete event
  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteEvent(eventToDelete.id);
      setEvents(prev => prev.filter(e => e.id !== eventToDelete.id));
      toast.success('Event deleted successfully!');
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
    } catch (error) {
      toast.error(error.message || 'Failed to delete event');
    } finally {
      setIsDeleting(false);
    }
  };

  // Close delete modal
  const closeDeleteModal = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
    }
  };

  // Handle view event
  const handleViewEvent = (event) => {
    window.location.hash = `organizer-event/${event.id}`;
  };

  // Handle edit event
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsEventDrawerOpen(true);
  };

  // Open create event drawer
  const openCreateDrawer = () => {
    setEditingEvent(null);
    setIsEventDrawerOpen(true);
  };

  // Close drawer
  const closeDrawer = () => {
    setIsEventDrawerOpen(false);
    setEditingEvent(null);
  };

  // Refresh events
  const handleRefresh = () => {
    loadEvents(false);
  };

  return (
    <OrganizerLayout activePage="events">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-500" />
            My Events
          </h1>
          <p className="text-slate-400">
            Manage and monitor all your events
          </p>
        </div>
        <button
          onClick={openCreateDrawer}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          <PlusCircle className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search events by name, location, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2.5 bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors disabled:opacity-50"
              aria-label="Refresh events"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Active filters summary */}
        {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all') && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700">
            <span className="text-sm text-slate-400">Active filters:</span>
            {searchQuery && (
              <span className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-400 rounded-full">
                Search: "{searchQuery}"
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="px-2 py-1 text-xs bg-teal-500/20 text-teal-400 rounded-full capitalize">
                {statusFilter}
              </span>
            )}
            {categoryFilter !== 'all' && (
              <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                {categoryFilter}
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
              className="text-xs text-slate-400 hover:text-white ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Events Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-400">
          Showing <span className="text-white font-medium">{filteredEvents.length}</span> of{' '}
          <span className="text-white font-medium">{events.length}</span> events
        </p>
      </div>

      {/* Events Grid/List */}
      {isLoading ? (
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' 
            ? "No events match your filters" 
            : "No events yet"
          }
          description={
            searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
              ? "Try adjusting your search or filter criteria"
              : "Create your first event to get started with event management!"
          }
          action={openCreateDrawer}
          actionLabel="Create Event"
        />
      ) : (
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onView={handleViewEvent}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
            />
          ))}
        </div>
      )}

      {/* Event Form Drawer */}
      <FormDrawer
        isOpen={isEventDrawerOpen}
        title={editingEvent ? 'Edit Event' : 'Create New Event'}
        onClose={closeDrawer}
        size="lg"
      >
        <EventForm
          initialEvent={editingEvent}
          onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
          onCancel={closeDrawer}
          isSubmitting={isSubmitting}
        />
      </FormDrawer>

      {/* Delete Event Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteEvent}
        title="Delete Event?"
        message="Are you sure you want to delete this event? All registrations and attendee data will be permanently removed."
        itemName={eventToDelete?.name}
        confirmText="Delete Event"
        cancelText="Cancel"
        type="delete"
        theme="emerald"
        isLoading={isDeleting}
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
    </OrganizerLayout>
  );
};

export default EventsList;
