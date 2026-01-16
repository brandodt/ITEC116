import React, { useState, useEffect, useCallback } from 'react';
import { 
  Bell,
  Send,
  Users,
  Calendar,
  ChevronDown,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  Eye,
  Filter
} from 'react-feather';
import OrganizerLayout from '../components/OrganizerLayout';
import { Spinner, InlineFeedback, EmptyState } from '../components/Feedback';
import { fetchEvents, fetchEventAttendees } from '../services/eventService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Announcements Page
 * Send notifications/emails to event attendees
 * Emerald/Teal color palette
 */

// Mock sent announcements
const mockAnnouncements = [
  {
    id: 1,
    eventId: 'event-1',
    eventName: 'Tech Conference 2025',
    subject: 'Important: Venue Change Notification',
    message: 'Dear attendees, please note that the venue has been changed to Hall B. See you there!',
    recipients: 45,
    sentAt: '2025-01-10T09:30:00Z',
    status: 'sent'
  },
  {
    id: 2,
    eventId: 'event-2',
    eventName: 'Web Dev Workshop',
    subject: 'Reminder: Workshop starts tomorrow!',
    message: 'This is a friendly reminder that the workshop begins tomorrow at 9 AM. Bring your laptops!',
    recipients: 28,
    sentAt: '2025-01-08T14:00:00Z',
    status: 'sent'
  }
];

const Announcements = () => {
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendeeCount, setAttendeeCount] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    sendToAll: true
  });

  // Load events
  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchEvents();
      setEvents(data);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Load attendee count when event selected
  useEffect(() => {
    const loadAttendees = async () => {
      if (selectedEvent) {
        try {
          const attendees = await fetchEventAttendees(selectedEvent.id);
          setAttendeeCount(attendees.length);
        } catch (error) {
          setAttendeeCount(selectedEvent.registeredCount || 0);
        }
      }
    };
    loadAttendees();
  }, [selectedEvent]);

  // Handle form change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle send announcement
  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!selectedEvent) {
      toast.error('Please select an event');
      return;
    }
    
    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsSending(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newAnnouncement = {
        id: Date.now(),
        eventId: selectedEvent.id,
        eventName: selectedEvent.name,
        subject: formData.subject,
        message: formData.message,
        recipients: attendeeCount,
        sentAt: new Date().toISOString(),
        status: 'sent'
      };
      
      setAnnouncements(prev => [newAnnouncement, ...prev]);
      toast.success(`Announcement sent to ${attendeeCount} attendees!`);
      
      // Reset form
      setFormData({ subject: '', message: '', sendToAll: true });
      setShowCompose(false);
      setSelectedEvent(null);
    } catch (error) {
      toast.error('Failed to send announcement');
    } finally {
      setIsSending(false);
    }
  };

  // Delete announcement
  const handleDelete = async (id) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    toast.success('Announcement deleted');
  };

  // Format date
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <OrganizerLayout activePage="announcements">
      {/* Page Header */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <Bell className="w-6 h-6 text-teal-400" />
            Announcements
          </h1>
          <p className="text-slate-400">
            Send notifications and updates to event attendees
          </p>
        </div>
        
        <button
          onClick={() => setShowCompose(!showCompose)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Send className="w-4 h-4" />
          {showCompose ? 'Cancel' : 'New Announcement'}
        </button>
      </div>

      {/* Compose Form */}
      {showCompose && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Compose Announcement</h2>
          
          <form onSubmit={handleSend} className="space-y-4">
            {/* Event Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Select Event *
              </label>
              <div className="relative">
                <select
                  value={selectedEvent?.id || ''}
                  onChange={(e) => {
                    const event = events.find(ev => ev.id === e.target.value);
                    setSelectedEvent(event || null);
                  }}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                >
                  <option value="">Choose an event...</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.name} ({event.registeredCount} attendees)
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
              {selectedEvent && (
                <p className="mt-2 text-sm text-emerald-400 flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Will be sent to {attendeeCount} registered attendees
                </p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter announcement subject..."
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your announcement message..."
                rows={5}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none"
              />
              <p className="mt-1 text-xs text-slate-500">
                {formData.message.length}/500 characters
              </p>
            </div>

            {/* Send Options */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sendToAll"
                name="sendToAll"
                checked={formData.sendToAll}
                onChange={handleChange}
                className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-emerald-500 focus:ring-emerald-500/50"
              />
              <label htmlFor="sendToAll" className="text-sm text-slate-400">
                Send to all registered attendees (including those who haven't checked in)
              </label>
            </div>

            {/* Preview & Send */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
              <button
                type="submit"
                disabled={isSending || !selectedEvent || !formData.subject || !formData.message}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <Spinner size="sm" className="text-white" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Announcement
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCompose(false);
                  setFormData({ subject: '', message: '', sendToAll: true });
                  setSelectedEvent(null);
                }}
                className="px-4 py-2.5 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Announcements History */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            Sent Announcements
          </h2>
          <span className="text-sm text-slate-400">
            {announcements.length} total
          </span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" className="text-emerald-500" />
          </div>
        ) : announcements.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No announcements yet"
            description="Click 'New Announcement' to send your first message to attendees."
          />
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div 
                key={announcement.id}
                className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {announcement.eventName}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Users className="w-3 h-3" />
                        {announcement.recipients} recipients
                      </span>
                    </div>
                    <h3 className="text-white font-medium mb-1">{announcement.subject}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2">{announcement.message}</p>
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      Sent {formatDate(announcement.sentAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="mt-6 p-4 bg-teal-500/10 rounded-xl border border-teal-500/30">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-teal-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-teal-400 mb-1">About Announcements</h4>
            <p className="text-sm text-slate-400">
              Announcements are sent via email to all registered attendees of the selected event. 
              Use this feature to send important updates, reminders, or last-minute changes about your events.
              Recipients will receive the message in their registered email address.
            </p>
          </div>
        </div>
      </div>

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

export default Announcements;
