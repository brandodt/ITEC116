/**
 * Attendee Service
 * Service layer for attendee-related API calls
 * Connected to NestJS backend
 */

import api from '../../shared/services/api';
import { getStoredUser } from '../../shared/services/api';

/**
 * Normalize event data to ensure consistent field names
 */
const normalizeEvent = (event) => ({
  ...event,
  id: event._id || event.id,
  registrations: event.registeredCount || event.registrations || 0,
  image: event.imageUrl || event.coverImage || event.image,
  organizer: event.organizerName || event.organizer || 'Unknown Organizer',
  price: getEventPriceFromData(event),
});

/**
 * Extract price from ticketPrices object or price field
 */
const getEventPriceFromData = (event) => {
  if (event.price !== undefined && event.price !== null) {
    return event.price;
  }
  if (event.ticketPrices && typeof event.ticketPrices === 'object') {
    const prices = Object.values(event.ticketPrices).filter(p => typeof p === 'number');
    if (prices.length > 0) {
      return Math.min(...prices);
    }
  }
  return 0;
};

/**
 * Normalize ticket data
 */
const normalizeTicket = (ticket) => ({
  ...ticket,
  id: ticket._id || ticket.id,
});

/**
 * Fetch all public events for discovery
 */
export const fetchPublicEvents = async (filters = {}) => {
  let endpoint = '/events/public';
  const params = new URLSearchParams();
  
  // Apply category filter
  if (filters.category && filters.category !== 'all') {
    params.append('category', filters.category);
  }
  
  // Apply search filter
  if (filters.search) {
    params.append('search', filters.search);
  }
  
  const queryString = params.toString();
  if (queryString) {
    endpoint += `?${queryString}`;
  }
  
  let events = await api.get(endpoint);
  
  // Normalize events
  events = events.map(normalizeEvent);
  
  // Apply date filter (client-side if not supported by backend)
  if (filters.dateRange) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (filters.dateRange) {
      case 'today':
        events = events.filter(e => {
          const eventDate = new Date(e.date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate.getTime() === today.getTime();
        });
        break;
      case 'week':
        const weekEnd = new Date(today);
        weekEnd.setDate(weekEnd.getDate() + 7);
        events = events.filter(e => {
          const eventDate = new Date(e.date);
          return eventDate >= today && eventDate <= weekEnd;
        });
        break;
      case 'month':
        const monthEnd = new Date(today);
        monthEnd.setMonth(monthEnd.getMonth() + 1);
        events = events.filter(e => {
          const eventDate = new Date(e.date);
          return eventDate >= today && eventDate <= monthEnd;
        });
        break;
      default:
        break;
    }
  }
  
  // Sort by date (upcoming first)
  events.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return events;
};

/**
 * Fetch single event details
 */
export const fetchEventById = async (eventId) => {
  const event = await api.get(`/events/public/${eventId}`);
  return normalizeEvent(event);
};

/**
 * Fetch all categories
 */
export const fetchCategories = async () => {
  try {
    const categories = await api.get('/events/categories');
    // Backend returns array of strings, keep original name as id for proper matching
    if (Array.isArray(categories)) {
      return categories.map(cat => {
        // Handle both string categories and already-formatted objects
        if (typeof cat === 'string') {
          // Use original category name as id to match backend data
          return { id: cat, name: cat };
        }
        return cat;
      }).filter(cat => cat.name); // Remove empty categories
    }
    return [];
  } catch {
    // Fallback categories if endpoint doesn't exist
    return [
      { id: 'Technology', name: 'Technology' },
      { id: 'Workshop', name: 'Workshop' },
      { id: 'Networking', name: 'Networking' },
      { id: 'Conference', name: 'Conference' },
      { id: 'Music & Arts', name: 'Music & Arts' },
      { id: 'Sports', name: 'Sports' },
      { id: 'Education', name: 'Education' },
      { id: 'Business', name: 'Business' },
    ];
  }
};

/**
 * Check if user is already registered for an event
 */
export const checkExistingRegistration = async (eventId, email) => {
  try {
    const tickets = await api.get('/tickets/my-tickets');
    const existingTicket = tickets.find(
      t => t.eventId === eventId && 
           t.attendeeEmail?.toLowerCase() === email.toLowerCase() &&
           t.status !== 'cancelled'
    );
    return existingTicket || null;
  } catch {
    return null;
  }
};

/**
 * Register for an event
 */
export const registerForEvent = async (eventId, registrationData) => {
  const payload = {
    eventId,
    attendeeName: `${registrationData.firstName} ${registrationData.lastName}`,
    attendeeEmail: registrationData.email,
    ticketType: registrationData.ticketType || 'General Admission',
    phone: registrationData.phone,
    specialRequirements: registrationData.specialRequirements,
  };
  
  return api.post('/tickets/register', payload);
};

/**
 * Fetch user's tickets
 */
export const fetchMyTickets = async () => {
  try {
    const tickets = await api.get('/tickets/my-tickets');
    return tickets.map(normalizeTicket).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch {
    return [];
  }
};

/**
 * Fetch single ticket details
 */
export const fetchTicketById = async (ticketId) => {
  const ticket = await api.get(`/tickets/${ticketId}`);
  return normalizeTicket(ticket);
};

/**
 * Cancel a ticket
 */
export const cancelTicket = async (ticketId) => {
  return api.delete(`/tickets/${ticketId}`);
};

/**
 * Update registration details
 */
export const updateRegistration = async (ticketId, updateData) => {
  return api.patch(`/tickets/${ticketId}`, updateData);
};

/**
 * Fetch attendee dashboard stats
 */
export const fetchAttendeeStats = async () => {
  try {
    return await api.get('/tickets/my-stats');
  } catch {
    // Fallback: calculate from tickets
    const tickets = await fetchMyTickets();
    const now = new Date();
    
    const upcomingTickets = tickets.filter(t => 
      t.status === 'valid' && new Date(t.eventDate) >= now
    );
    
    const pastTickets = tickets.filter(t => 
      new Date(t.eventDate) < now
    );
    
    const checkedInCount = tickets.filter(t => t.checkedIn).length;
    
    return {
      totalTickets: tickets.length,
      upcomingEvents: upcomingTickets.length,
      pastEvents: pastTickets.length,
      checkedInEvents: checkedInCount,
    };
  }
};

/**
 * Get current user info
 */
export const getCurrentUser = async () => {
  try {
    return await api.get('/auth/me');
  } catch {
    return getStoredUser();
  }
};

/**
 * Login
 */
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.user;
};

/**
 * Logout
 */
export const logout = async () => {
  // Clear local storage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  return true;
};
