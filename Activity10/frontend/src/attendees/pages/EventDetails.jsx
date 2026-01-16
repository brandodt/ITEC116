import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  Share2,
  Heart,
  ExternalLink
} from 'react-feather';
import AttendeeLayout from '../components/AttendeeLayout';
import RegistrationForm from '../components/RegistrationForm';
import { EventDetailsSkeleton } from '../components/LoadingSkeleton';
import { fetchEventById, registerForEvent } from '../services/attendeeService';
import { useAttendeeAuth } from '../contexts/AttendeeAuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Event Details Page
 * Displays full event information and registration form
 */

const EventDetails = ({ eventId }) => {
  const { isAuthenticated } = useAttendeeAuth();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Load event data
  const loadEvent = useCallback(async () => {
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
    if (eventId) {
      loadEvent();
    }
  }, [eventId, loadEvent]);

  const handleRegister = async (formData) => {
    try {
      setIsRegistering(true);
      const ticket = await registerForEvent(eventId, formData);
      toast.success('Registration successful! Check your tickets.');
      setShowRegistration(false);
      // Navigate to tickets
      setTimeout(() => {
        window.location.hash = 'my-tickets';
      }, 1500);
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.name,
          text: event?.description,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      // Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatPrice = (price) => {
    if (price === 0) return 'Free';
    return `₱${price.toLocaleString()}`;
  };

  const spotsLeft = event ? event.capacity - event.registrations : 0;
  const isSoldOut = spotsLeft <= 0;

  if (isLoading) {
    return (
      <AttendeeLayout activePage="discover">
        <EventDetailsSkeleton />
      </AttendeeLayout>
    );
  }

  if (!event) {
    return (
      <AttendeeLayout activePage="discover">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-white mb-2">Event not found</h2>
          <a href="#discover" className="text-sky-400 hover:underline">
            Back to events
          </a>
        </div>
      </AttendeeLayout>
    );
  }

  return (
    <AttendeeLayout activePage="discover">
      {/* Back Button - Sticky */}
      <div className="sticky top-16 z-40 -mx-4 px-4 py-3 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 mb-4">
        <button
          onClick={() => window.location.hash = 'discover'}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>
      </div>

      {/* Hero Image */}
      <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-6">
        {event.image ? (
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sky-600 to-violet-700 flex items-center justify-center">
            <Calendar className="w-20 h-20 text-white/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        
        {/* Floating Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className={`p-3 rounded-full backdrop-blur-sm transition-all ${
              isFavorited
                ? 'bg-red-500 text-white'
                : 'bg-slate-900/50 text-white hover:bg-slate-800'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-3 rounded-full bg-slate-900/50 backdrop-blur-sm text-white hover:bg-slate-800 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 bg-sky-500/90 backdrop-blur-sm text-white text-sm font-medium rounded-full capitalize">
            {event.category}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Title & Organizer */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-3">{event.name}</h1>
            <div className="flex items-center gap-3">
              {event.organizerLogo && (
                <img
                  src={event.organizerLogo}
                  alt={event.organizer}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <p className="text-sm text-slate-400">Organized by</p>
                <p className="text-white font-medium">{event.organizer}</p>
              </div>
            </div>
          </div>

          {/* Event Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Date</p>
                <p className="text-sm text-white font-medium">{formatDate(event.date)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Time</p>
                <p className="text-sm text-white font-medium">{event.time} - {event.endTime}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Capacity</p>
                <p className="text-sm text-white font-medium">
                  {isSoldOut ? 'Sold Out' : `${spotsLeft} spots left`}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <p className="text-white font-medium">{event.location}</p>
                <p className="text-sm text-slate-400">{event.address}</p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(event.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-sm text-sky-400 hover:text-sky-300"
                >
                  View on map
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-3">About This Event</h2>
            <p className="text-slate-300 leading-relaxed mb-4">{event.description}</p>
            
            {event.fullDescription && (
              <div 
                className="prose prose-invert prose-sm max-w-none text-slate-300"
                dangerouslySetInnerHTML={{ __html: event.fullDescription }}
              />
            )}
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Registration */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            {showRegistration ? (
              <RegistrationForm
                event={event}
                ticketTypes={event.ticketTypes}
                onSubmit={handleRegister}
                onCancel={() => setShowRegistration(false)}
                isSubmitting={isRegistering}
              />
            ) : (
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-slate-400 mb-1">Starting from</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
                    {formatPrice(event.price)}
                  </p>
                </div>

                {/* Ticket Types Preview */}
                {event.ticketTypes && event.ticketTypes.length > 1 && (
                  <div className="space-y-2 mb-6">
                    {event.ticketTypes.slice(0, 3).map((ticket) => (
                      <div
                        key={ticket.id}
                        className="flex items-center justify-between text-sm p-2 bg-slate-900/50 rounded-lg"
                      >
                        <span className="text-slate-300">{ticket.name}</span>
                        <span className={ticket.price === 0 ? 'text-emerald-400' : 'text-white'}>
                          {formatPrice(ticket.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setShowRegistration(true)}
                  disabled={isSoldOut}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    isSoldOut
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-sky-500 to-violet-600 text-white hover:from-sky-600 hover:to-violet-700 shadow-lg shadow-sky-500/25'
                  }`}
                >
                  {isSoldOut ? 'Sold Out' : 'Register Now'}
                </button>

                {/* Spots indicator */}
                {!isSoldOut && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-400">Spots filled</span>
                      <span className="text-white">
                        {event.registrations} / {event.capacity}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-500 to-violet-600 rounded-full transition-all"
                        style={{ width: `${(event.registrations / event.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
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
    </AttendeeLayout>
  );
};

export default EventDetails;
