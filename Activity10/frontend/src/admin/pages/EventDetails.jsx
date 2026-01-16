import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit2,
  Trash2,
  Download,
  Star,
  CheckCircle,
  XCircle,
  Mail,
  User,
  Tag,
  DollarSign,
  TrendingUp
} from 'react-feather';
import AdminLayout from '../components/AdminLayout';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { ConfirmModal } from '../components/Feedback';
import { fetchEventById, deleteEvent, toggleEventFeatured, exportToCSV } from '../services/adminService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Admin Event Details Page
 * View complete event info, registrations, and admin controls
 * Indigo/Deep Slate color palette
 */

const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Get event ID from hash
  const getEventId = () => {
    const hash = window.location.hash;
    const match = hash.match(/admin-event\/([^?]+)/);
    return match ? match[1] : null;
  };

  const eventId = getEventId();

  // Load event data
  const loadEvent = useCallback(async () => {
    if (!eventId) return;
    
    try {
      setIsLoading(true);
      const data = await fetchEventById(eventId);
      setEvent(data);
    } catch (error) {
      toast.error('Failed to load event details');
      console.error('Load error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteEvent(eventId);
      toast.success('Event deleted successfully');
      setTimeout(() => {
        window.location.hash = 'admin-events';
      }, 1000);
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  // Handle toggle featured
  const handleToggleFeatured = async () => {
    try {
      await toggleEventFeatured(eventId);
      toast.success(event.featured ? 'Event unfeatured' : 'Event marked as featured');
      loadEvent();
    } catch (error) {
      toast.error('Failed to update event');
    }
  };

  // Handle export registrations
  const handleExport = async () => {
    try {
      setIsExporting(true);
      const csvContent = await exportToCSV('registrations', { eventId });
      
      // Create download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${event.name.replace(/\s+/g, '_')}_registrations.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Export downloaded successfully');
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
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
        return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'ongoing':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
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
      <AdminLayout activePage="events">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-slate-700 rounded mb-6" />
          <div className="h-64 bg-slate-800 rounded-xl mb-6" />
          <TableSkeleton rows={5} cols={5} />
        </div>
      </AdminLayout>
    );
  }

  if (!event) {
    return (
      <AdminLayout activePage="events">
        <div className="text-center py-16">
          <Calendar className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Event Not Found</h2>
          <p className="text-slate-400 mb-6">The event you're looking for doesn't exist or has been deleted.</p>
          <a
            href="#admin-events"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </a>
        </div>
      </AdminLayout>
    );
  }

  const registrationPercentage = event.capacity > 0 
    ? Math.round((event.registrationCount / event.capacity) * 100) 
    : 0;

  return (
    <AdminLayout activePage="events">
      {/* Back Button */}
      <div className="mb-6">
        <a
          href="#admin-events"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Events</span>
        </a>
      </div>

      {/* Event Header */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden mb-6">
        {/* Cover Image */}
        {event.imageUrl ? (
          <div className="relative h-48 w-full">
            <img
              src={event.imageUrl}
              alt={event.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-br from-indigo-600 to-slate-800" />
        )}

        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 text-xs font-medium rounded-full border capitalize ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
                {event.featured && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                    <Star className="w-3 h-3" /> Featured
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">{event.name}</h1>
              <p className="text-slate-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Organized by: <span className="text-white">{event.organizer}</span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleFeatured}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  event.featured 
                    ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Star className="w-4 h-4" />
                {event.featured ? 'Unfeature' : 'Feature'}
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50"
              >
                <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
                Export
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Registrations</p>
              <p className="text-xl font-bold text-white">{event.registrationCount} / {event.capacity}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Checked In</p>
              <p className="text-xl font-bold text-white">{event.checkedInCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Cancelled</p>
              <p className="text-xl font-bold text-white">{event.cancelledCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Revenue</p>
              <p className="text-xl font-bold text-white">₱{(event.price * event.confirmedCount).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details & Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Info */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Event Details</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-indigo-400 mt-0.5" />
              <div>
                <p className="text-sm text-slate-400">Date</p>
                <p className="text-white">{formatDate(event.date)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-indigo-400 mt-0.5" />
              <div>
                <p className="text-sm text-slate-400">Time</p>
                <p className="text-white">
                  {formatTime(event.time)}
                  {event.endTime && ` - ${formatTime(event.endTime)}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-indigo-400 mt-0.5" />
              <div>
                <p className="text-sm text-slate-400">Location</p>
                <p className="text-white">{event.location}</p>
                {event.address && <p className="text-sm text-slate-500">{event.address}</p>}
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Tag className="w-5 h-5 text-indigo-400 mt-0.5" />
              <div>
                <p className="text-sm text-slate-400">Category</p>
                <p className="text-white">{event.category || 'Uncategorized'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-indigo-400 mt-0.5" />
              <div>
                <p className="text-sm text-slate-400">Ticket Price</p>
                <p className="text-white">{event.price === 0 ? 'Free' : `₱${event.price.toLocaleString()}`}</p>
              </div>
            </div>
          </div>

          {/* Capacity Progress */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-400">Capacity</span>
              <span className="text-white font-medium">{registrationPercentage}%</span>
            </div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(registrationPercentage, 100)}%` }}
              />
            </div>
          </div>

          {event.description && (
            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-sm text-slate-400 mb-2">Description</p>
              <p className="text-slate-300 text-sm whitespace-pre-wrap">{event.description}</p>
            </div>
          )}
        </div>

        {/* Registrations List */}
        <div className="lg:col-span-2 bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Registrations ({event.registrations?.length || 0})
          </h2>
          
          {event.registrations && event.registrations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Attendee</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Ticket</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Check-in</th>
                  </tr>
                </thead>
                <tbody>
                  {event.registrations.map((reg) => (
                    <tr key={reg.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-white font-medium">{reg.attendeeName}</p>
                          <p className="text-sm text-slate-400">{reg.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-slate-300">{reg.ticketType}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          reg.status === 'confirmed' 
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : reg.status === 'cancelled'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {reg.checkedIn ? (
                          <span className="flex items-center gap-1 text-emerald-400 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            Yes
                          </span>
                        ) : (
                          <span className="text-slate-500 text-sm">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No registrations yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Event"
        message={`Are you sure you want to delete "${event.name}"? This action cannot be undone and will remove all associated registrations.`}
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

export default EventDetails;
