/**
 * Event Service - Abstraction layer for event-related API operations
 * Connected to NestJS backend
 * Events are filtered by the logged-in organizer
 */

import api from '../../shared/services/api';

/**
 * Normalize event object from MongoDB format
 * Maps _id to id and other field mappings
 */
const normalizeEvent = (event) => {
  if (!event) return null;
  
  // Extract price from ticketPrices if available
  let price = 0;
  if (event.price !== undefined && event.price !== null) {
    price = event.price;
  } else if (event.ticketPrices && typeof event.ticketPrices === 'object') {
    const prices = Object.values(event.ticketPrices).filter(p => typeof p === 'number');
    if (prices.length > 0) {
      price = Math.min(...prices);
    }
  }
  
  return {
    ...event,
    id: event._id || event.id,
    registrations: event.registeredCount ?? event.registrations ?? 0,
    image: event.imageUrl || event.coverImage || event.image,
    organizer: event.organizerName || event.organizer || 'Unknown Organizer',
    price: price,
    featured: event.isFeatured || event.featured || false,
    // Use calculatedStatus if available (from enriched backend response)
    status: event.calculatedStatus || event.status || 'upcoming',
  };
};

/**
 * Fetch all events for the current organizer (filtered by ownership)
 * @returns {Promise<Array>} List of events owned by the organizer
 */
export const fetchEvents = async () => {
  const events = await api.get('/events/my-events');
  return events.map(normalizeEvent);
};

/**
 * Fetch a single event by ID (with ownership check)
 * @param {string} eventId - The event ID
 * @returns {Promise<Object>} Event details
 */
export const fetchEventById = async (eventId) => {
  const event = await api.get(`/events/${eventId}`);
  return normalizeEvent(event);
};

/**
 * Create a new event (owned by current organizer)
 * @param {Object} eventData - Event data
 * @returns {Promise<Object>} Created event
 */
export const createEvent = async (eventData) => {
  const event = await api.post('/events', eventData);
  return normalizeEvent(event);
};

/**
 * Update an existing event
 * @param {string} eventId - The event ID
 * @param {Object} eventData - Updated event data
 * @returns {Promise<Object>} Updated event
 */
export const updateEvent = async (eventId, eventData) => {
  const event = await api.patch(`/events/${eventId}`, eventData);
  return normalizeEvent(event);
};

/**
 * Delete an event
 * @param {string} eventId - The event ID
 * @returns {Promise<void>}
 */
export const deleteEvent = async (eventId) => {
  return api.delete(`/events/${eventId}`);
};

/**
 * Normalize ticket/attendee data for frontend display
 */
const normalizeAttendee = (ticket) => {
  if (!ticket) return null;
  return {
    ...ticket,
    id: ticket._id || ticket.id,
    // Map backend field names to what AttendeeTable expects
    name: ticket.attendeeName || ticket.name || 'Unknown',
    email: ticket.attendeeEmail || ticket.email || '',
    ticketCode: ticket.qrCode || ticket.ticketCode || '',
    company: ticket.company || '',
    checkedIn: ticket.checkedIn || false,
    checkInTime: ticket.checkedInAt || ticket.checkInTime,
    status: ticket.status,
  };
};

/**
 * Fetch attendees for a specific event (with ownership check)
 * @param {string} eventId - The event ID
 * @returns {Promise<Array>} List of attendees
 */
export const fetchEventAttendees = async (eventId) => {
  try {
    const response = await api.get(`/tickets/event/${eventId}/attendees`);
    // Handle various response formats - backend returns { tickets, stats }
    let tickets = [];
    if (Array.isArray(response)) {
      tickets = response;
    } else if (response?.tickets && Array.isArray(response.tickets)) {
      tickets = response.tickets;
    } else if (response?.attendees && Array.isArray(response.attendees)) {
      tickets = response.attendees;
    } else if (response?.data && Array.isArray(response.data)) {
      tickets = response.data;
    }
    return tickets.map(normalizeAttendee).filter(Boolean);
  } catch {
    // Fallback to tickets endpoint
    try {
      const tickets = await api.get(`/tickets/event/${eventId}`);
      const ticketArray = Array.isArray(tickets) ? tickets : [];
      return ticketArray.map(normalizeAttendee).filter(Boolean);
    } catch {
      return [];
    }
  }
};

/**
 * Update attendee check-in status
 * @param {string} attendeeId - The attendee/ticket ID
 * @param {boolean} checkedIn - Check-in status
 * @returns {Promise<Object>} Updated attendee
 */
export const updateAttendeeCheckIn = async (attendeeId, checkedIn) => {
  // This would typically use a check-in endpoint
  return api.patch(`/tickets/${attendeeId}`, { checkedIn });
};

/**
 * Export attendee list (returns CSV data)
 * @param {string} eventId - The event ID
 * @returns {Promise<string>} CSV string
 */
export const exportAttendeeList = async (eventId) => {
  const attendees = await fetchEventAttendees(eventId);
  const headers = ['Name', 'Email', 'Status', 'Check-in Time'];
  const rows = attendees.map(a => [
    a.attendeeName || a.name,
    a.attendeeEmail || a.email,
    a.checkedIn ? 'Checked In' : 'Registered',
    a.checkInTime || '',
  ]);
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

/**
 * Scan QR code and verify ticket
 * @param {string} ticketCode - The ticket/QR code
 * @returns {Promise<Object>} Verification result
 */
export const verifyTicket = async (ticketCode) => {
  try {
    const result = await api.post('/tickets/check-in', { qrCode: ticketCode });
    return { valid: true, message: 'Check-in successful', attendee: result };
  } catch (error) {
    return { valid: false, message: error.message };
  }
};

/**
 * Get dashboard statistics (filtered by organizer's events)
 * @returns {Promise<Object>} Dashboard stats
 */
export const fetchDashboardStats = async () => {
  try {
    return await api.get('/events/my-stats');
  } catch {
    // Fallback: calculate from events
    const events = await fetchEvents();
    
    const totalEvents = events.length;
    const upcomingEvents = events.filter(e => e.status === 'upcoming' || e.status === 'published').length;
    const totalRegistrations = events.reduce((sum, e) => sum + (e.registeredCount || 0), 0);
    const totalCheckIns = events.reduce((sum, e) => sum + (e.checkedInCount || 0), 0);
    
    return {
      totalEvents,
      upcomingEvents,
      totalRegistrations,
      totalCheckIns,
      checkInRate: totalRegistrations > 0 
        ? Math.round((totalCheckIns / totalRegistrations) * 100) 
        : 0,
    };
  }
};
