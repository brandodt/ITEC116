/**
 * Event Service - Abstraction layer for event-related API operations
 * This service will connect to the NestJS backend in production
 * Events are filtered by the logged-in organizer
 */

import { mockEvents, mockAttendees, mockOrganizers } from '../../shared/data/mockData';

// Simulated API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get current organizer's event IDs from session
const getOrganizerEventIds = () => {
  try {
    const session = localStorage.getItem('organizer_session');
    if (!session) return [];
    
    const { id } = JSON.parse(session);
    
    // Find organizer from shared data and get their owned events
    const organizer = mockOrganizers.find(o => o.id === id);
    return organizer?.eventsOwned || [];
  } catch {
    return [];
  }
};

/**
 * Fetch all events for the current organizer (filtered by ownership)
 * @returns {Promise<Array>} List of events owned by the organizer
 */
export const fetchEvents = async () => {
  await delay(800);
  const ownedEventIds = getOrganizerEventIds();
  // Filter events to only show those owned by the current organizer
  return mockEvents.filter(e => ownedEventIds.includes(e.id));
};

/**
 * Fetch a single event by ID (with ownership check)
 * @param {string} eventId - The event ID
 * @returns {Promise<Object>} Event details
 */
export const fetchEventById = async (eventId) => {
  await delay(500);
  const ownedEventIds = getOrganizerEventIds();
  const event = mockEvents.find(e => e.id === eventId);
  
  if (!event) {
    throw new Error('Event not found');
  }
  
  // Check if organizer owns this event
  if (!ownedEventIds.includes(eventId)) {
    throw new Error('You do not have permission to view this event');
  }
  
  return { ...event };
};

/**
 * Create a new event (owned by current organizer)
 * @param {Object} eventData - Event data
 * @returns {Promise<Object>} Created event
 */
export const createEvent = async (eventData) => {
  await delay(600);
  const newEvent = {
    id: `event-${Date.now()}`,
    ...eventData,
    registeredCount: 0,
    checkedInCount: 0,
    status: 'upcoming',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockEvents.unshift(newEvent);
  
  // In a real app, the backend would handle ownership
  // For now, we add the new event ID to the organizer's owned events in memory
  // This will persist until page refresh
  
  return newEvent;
};

/**
 * Update an existing event
 * @param {string} eventId - The event ID
 * @param {Object} eventData - Updated event data
 * @returns {Promise<Object>} Updated event
 */
export const updateEvent = async (eventId, eventData) => {
  await delay(600);
  const index = mockEvents.findIndex(e => e.id === eventId);
  if (index === -1) {
    throw new Error('Event not found');
  }
  mockEvents[index] = {
    ...mockEvents[index],
    ...eventData,
    updatedAt: new Date().toISOString(),
  };
  return { ...mockEvents[index] };
};

/**
 * Delete an event
 * @param {string} eventId - The event ID
 * @returns {Promise<void>}
 */
export const deleteEvent = async (eventId) => {
  await delay(500);
  const index = mockEvents.findIndex(e => e.id === eventId);
  if (index === -1) {
    throw new Error('Event not found');
  }
  mockEvents.splice(index, 1);
};

/**
 * Fetch attendees for a specific event (with ownership check)
 * @param {string} eventId - The event ID
 * @returns {Promise<Array>} List of attendees
 */
export const fetchEventAttendees = async (eventId) => {
  await delay(700);
  const ownedEventIds = getOrganizerEventIds();
  
  // Check if organizer owns this event
  if (!ownedEventIds.includes(eventId)) {
    throw new Error('You do not have permission to view attendees for this event');
  }
  
  return mockAttendees.filter(a => a.eventId === eventId);
};

/**
 * Update attendee check-in status
 * @param {string} attendeeId - The attendee ID
 * @param {boolean} checkedIn - Check-in status
 * @returns {Promise<Object>} Updated attendee
 */
export const updateAttendeeCheckIn = async (attendeeId, checkedIn) => {
  await delay(400);
  const attendee = mockAttendees.find(a => a.id === attendeeId);
  if (!attendee) {
    throw new Error('Attendee not found');
  }
  attendee.checkedIn = checkedIn;
  attendee.checkInTime = checkedIn ? new Date().toISOString() : null;
  return { ...attendee };
};

/**
 * Export attendee list (returns CSV data)
 * @param {string} eventId - The event ID
 * @returns {Promise<string>} CSV string
 */
export const exportAttendeeList = async (eventId) => {
  await delay(500);
  const attendees = mockAttendees.filter(a => a.eventId === eventId);
  const headers = ['Name', 'Email', 'Company', 'Status', 'Check-in Time'];
  const rows = attendees.map(a => [
    a.name,
    a.email,
    a.company || '',
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
  await delay(300);
  const attendee = mockAttendees.find(a => a.ticketCode === ticketCode);
  if (!attendee) {
    return { valid: false, message: 'Invalid ticket code' };
  }
  if (attendee.checkedIn) {
    return { valid: false, message: 'Ticket already used', attendee };
  }
  attendee.checkedIn = true;
  attendee.checkInTime = new Date().toISOString();
  return { valid: true, message: 'Check-in successful', attendee };
};

/**
 * Get dashboard statistics (filtered by organizer's events)
 * @returns {Promise<Object>} Dashboard stats
 */
export const fetchDashboardStats = async () => {
  await delay(600);
  const ownedEventIds = getOrganizerEventIds();
  const organizerEvents = mockEvents.filter(e => ownedEventIds.includes(e.id));
  
  const totalEvents = organizerEvents.length;
  const upcomingEvents = organizerEvents.filter(e => e.status === 'upcoming').length;
  const totalRegistrations = organizerEvents.reduce((sum, e) => sum + e.registeredCount, 0);
  const totalCheckIns = organizerEvents.reduce((sum, e) => sum + e.checkedInCount, 0);
  
  return {
    totalEvents,
    upcomingEvents,
    totalRegistrations,
    totalCheckIns,
    checkInRate: totalRegistrations > 0 
      ? Math.round((totalCheckIns / totalRegistrations) * 100) 
      : 0,
  };
};
