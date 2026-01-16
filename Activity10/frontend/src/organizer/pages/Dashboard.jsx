import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  TrendingUp,
  PlusCircle,
  ArrowRight,
  Clock
} from 'react-feather';
import OrganizerLayout from '../components/OrganizerLayout';
import StatsCard from '../components/StatsCard';
import EventCard from '../components/EventCard';
import FormDrawer from '../components/FormDrawer';
import EventForm from '../components/EventForm';
import { DashboardSkeleton, EventCardSkeleton } from '../components/LoadingSkeleton';
import { EmptyState, Toast } from '../components/Feedback';
import { ConfirmModal } from '../../shared';
import { useAuth } from '../contexts/AuthContext';
import { 
  fetchEvents, 
  fetchDashboardStats, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} from '../services/eventService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Organizer Dashboard Page
 * Central hub for event management with stats and quick actions
 * Uses Emerald/Teal color palette
 */

const Dashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEventDrawerOpen, setIsEventDrawerOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [eventsData, statsData] = await Promise.all([
        fetchEvents(),
        fetchDashboardStats(),
      ]);
      setEvents(eventsData);
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard load error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Get upcoming events (first 3)
  const upcomingEvents = events
    .filter(e => e.status === 'upcoming')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  // Handle create event
  const handleCreateEvent = async (eventData) => {
    try {
      setIsSubmitting(true);
      const newEvent = await createEvent(eventData);
      setEvents(prev => [newEvent, ...prev]);
      setIsEventDrawerOpen(false);
      toast.success('Event created successfully!');
      // Refresh stats
      const statsData = await fetchDashboardStats();
      setStats(statsData);
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
      // Refresh stats
      const statsData = await fetchDashboardStats();
      setStats(statsData);
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
    // TODO: Navigate to event details page
    console.log('View event:', event);
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

  if (isLoading) {
    return (
      <OrganizerLayout activePage="dashboard">
        <DashboardSkeleton />
      </OrganizerLayout>
    );
  }

  return (
    <OrganizerLayout activePage="dashboard">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">
          Welcome back, {user?.name?.split(' ')[0] || 'Organizer'}!
        </h1>
        <p className="text-slate-400">
          {user?.organization ? `${user.organization} • ` : ''}Here's an overview of your events.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Events"
          value={stats?.totalEvents || 0}
          subtitle="All time"
          icon={Calendar}
          variant="default"
        />
        <StatsCard
          title="Upcoming Events"
          value={stats?.upcomingEvents || 0}
          subtitle="Scheduled"
          icon={Clock}
          variant="teal"
        />
        <StatsCard
          title="Total Registrations"
          value={stats?.totalRegistrations || 0}
          subtitle="Across all events"
          icon={Users}
          variant="info"
        />
        <StatsCard
          title="Check-in Rate"
          value={`${stats?.checkInRate || 0}%`}
          subtitle="Overall attendance"
          icon={CheckCircle}
          variant="success"
          trend="up"
          trendValue="+5%"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-xl p-6 border border-emerald-500/30 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">
              Ready to create your next event?
            </h2>
            <p className="text-slate-400 text-sm">
              Set up a new event and start accepting registrations in minutes.
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
      </div>

      {/* Upcoming Events Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-500" />
            Upcoming Events
          </h2>
          <a 
            href="#organizer-events" 
            className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {upcomingEvents.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No upcoming events"
            description="You don't have any upcoming events. Create your first event to get started!"
            action={openCreateDrawer}
            actionLabel="Create Event"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.map(event => (
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
      </div>

      {/* Recent Activity Section */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-500" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {events.slice(0, 5).map(event => (
            <div 
              key={event.id}
              className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <div>
                  <p className="text-sm text-white">{event.name}</p>
                  <p className="text-xs text-slate-500">
                    {event.registeredCount} registrations
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-400">
                {new Date(event.updatedAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>

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

export default Dashboard;
