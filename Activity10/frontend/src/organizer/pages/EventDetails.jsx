import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit2,
  Trash2,
  Share2,
  Download,
  CheckCircle,
  UserCheck,
  AlertCircle,
  Eye,
  Tag
} from 'react-feather';
import OrganizerLayout from '../components/OrganizerLayout';
import FormDrawer from '../components/FormDrawer';
import EventForm from '../components/EventForm';
import { fetchEventById, updateEvent, deleteEvent } from '../services/eventService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Organizer Event Details Page
 * View and manage a single event with attendee list
 * Emerald/Teal color palette
 */

const EventDetails = ({ eventId }) => {
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load event data
  const loadEvent = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchEventById(eventId);
      setEvent(data);
    } catch (error) {
      toast.error('Failed to load event');
      console.error('Load error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
  }, [eventId, loadEvent]);

  // Handle update event
  const handleUpdateEvent = async (eventData) => {
    try {
      setIsSubmitting(true);
      const updated = await updateEvent(eventId, eventData);
      setEvent(updated);
      setIsEditDrawerOpen(false);
      toast.success('Event updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update event');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete event
  const handleDeleteEvent = async () => {
    if (!window.confirm(`Are you sure you want to delete "${event.name}"?`)) {
      return;
    }
    
    try {
      await deleteEvent(eventId);
      toast.success('Event deleted successfully!');
      setTimeout(() => {
        window.location.hash = 'organizer-events';
      }, 500);
    } catch (error) {
      toast.error(error.message || 'Failed to delete event');
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format time
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'ongoing':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
      case 'completed':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  if (isLoading) {
    return (
      <OrganizerLayout activePage="events">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-slate-700 rounded mb-6" />
          <div className="h-64 bg-slate-800 rounded-xl mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-slate-800 rounded-xl" />
            <div className="h-96 bg-slate-800 rounded-xl" />
          </div>
        </div>
      </OrganizerLayout>
    );
  }

  if (!event) {
    return (
      <OrganizerLayout activePage="events">
        <div className="text-center py-16">
          <AlertCircle className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Event Not Found</h2>
          <p className="text-slate-400 mb-6">The event you're looking for doesn't exist or has been deleted.</p>
          <a
            href="#organizer-events"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </a>
        </div>
      </OrganizerLayout>
    );
  }

  const registrationPercentage = event.capacity > 0 
    ? Math.round((event.registeredCount / event.capacity) * 100) 
    : 0;

  return (
    <OrganizerLayout activePage="events">
      {/* Sticky Back Button */}
      <div className="sticky top-0 z-20 -mx-4 lg:-mx-6 px-4 lg:px-6 py-3 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 mb-6">
        <div className="flex items-center justify-between">
          <a
            href="#organizer-events"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Events</span>
          </a>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDeleteEvent}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Event Header with Cover Image */}
      <div className="relative rounded-2xl overflow-hidden mb-6">
        {event.imageUrl || event.coverImage ? (
          <img
            src={event.imageUrl || event.coverImage}
            alt={event.name}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center">
            <Calendar className="w-20 h-20 text-white/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-start justify-between">
            <div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)} mb-3`}>
                {event.status}
              </span>
              <h1 className="text-3xl font-bold text-white mb-2">{event.name}</h1>
              <p className="text-slate-300 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                {event.category || 'Uncategorized'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Details */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Event Details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-lg">
                <Calendar className="w-5 h-5 text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-400">Date</p>
                  <p className="text-white font-medium">{formatDate(event.date)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-lg">
                <Clock className="w-5 h-5 text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-400">Time</p>
                  <p className="text-white font-medium">
                    {formatTime(event.time)}
                    {event.endTime && ` - ${formatTime(event.endTime)}`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-lg sm:col-span-2">
                <MapPin className="w-5 h-5 text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-400">Location</p>
                  <p className="text-white font-medium">{event.location}</p>
                  {event.address && (
                    <p className="text-sm text-slate-400 mt-1">{event.address}</p>
                  )}
                </div>
              </div>
            </div>

            {event.description && (
              <div className="mt-6 pt-6 border-t border-slate-700">
                <h3 className="text-sm font-medium text-slate-400 mb-2">Description</h3>
                <p className="text-slate-300 whitespace-pre-wrap">{event.description}</p>
              </div>
            )}
          </div>

          {/* Attendee Summary */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Attendees</h2>
              <a
                href={`#organizer-attendees?event=${eventId}`}
                className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                View All
                <Eye className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                <Users className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{event.registeredCount || 0}</p>
                <p className="text-xs text-slate-400">Registered</p>
              </div>
              <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                <UserCheck className="w-6 h-6 text-sky-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{event.checkedInCount || 0}</p>
                <p className="text-xs text-slate-400">Checked In</p>
              </div>
              <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{event.capacity || 0}</p>
                <p className="text-xs text-slate-400">Capacity</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Registration</h3>
            
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-400">Progress</span>
                <span className="text-white font-medium">{registrationPercentage}%</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(registrationPercentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {event.registeredCount || 0} of {event.capacity || 0} spots filled
              </p>
            </div>

            {registrationPercentage >= 90 && (
              <div className="p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg">
                <p className="text-sm text-amber-400">
                  ⚠️ Almost full! Only {event.capacity - event.registeredCount} spots left.
                </p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <a
                href={`#organizer-scanner?event=${eventId}`}
                className="flex items-center gap-3 w-full p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-colors"
              >
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-slate-300">Check-in Scanner</span>
              </a>
              
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}#event/${eventId}`);
                  toast.success('Event link copied!');
                }}
                className="flex items-center gap-3 w-full p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-colors"
              >
                <Share2 className="w-5 h-5 text-sky-400" />
                <span className="text-slate-300">Copy Event Link</span>
              </button>
              
              <button
                onClick={() => toast.info('Export feature coming soon!')}
                className="flex items-center gap-3 w-full p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-colors"
              >
                <Download className="w-5 h-5 text-amber-400" />
                <span className="text-slate-300">Export Attendees</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Event Drawer */}
      <FormDrawer
        isOpen={isEditDrawerOpen}
        title="Edit Event"
        onClose={() => setIsEditDrawerOpen(false)}
        size="lg"
      >
        <EventForm
          initialEvent={event}
          onSubmit={handleUpdateEvent}
          onCancel={() => setIsEditDrawerOpen(false)}
          isSubmitting={isSubmitting}
        />
      </FormDrawer>

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

export default EventDetails;
