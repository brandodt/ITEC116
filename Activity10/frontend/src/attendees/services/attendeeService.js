/**
 * Attendee Service
 * Service layer for attendee-related API calls
 * Abstracts API communication for future NestJS backend integration
 */

import { mockEvents, mockTickets, mockCategories, mockUser } from '../../shared/data/mockData';

// Simulated API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch all public events for discovery
 */
export const fetchPublicEvents = async (filters = {}) => {
  await delay(500);
  
  // Filter events that are published or upcoming (for attendee discovery)
  let events = [...mockEvents].filter(e => e.status === 'published' || e.status === 'upcoming');
  
  // Apply category filter
  if (filters.category && filters.category !== 'all') {
    events = events.filter(e => e.category === filters.category);
  }
  
  // Apply date filter
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
  
  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    events = events.filter(e => 
      e.name.toLowerCase().includes(searchLower) ||
      e.description.toLowerCase().includes(searchLower) ||
      e.location.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort by date (upcoming first)
  events.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return events;
};

/**
 * Fetch single event details
 */
export const fetchEventById = async (eventId) => {
  await delay(300);
  const event = mockEvents.find(e => e.id === eventId);
  if (!event) {
    throw new Error('Event not found');
  }
  return event;
};

/**
 * Fetch all categories
 */
export const fetchCategories = async () => {
  await delay(200);
  return mockCategories;
};

/**
 * Check if user is already registered for an event
 */
export const checkExistingRegistration = async (eventId, email) => {
  await delay(200);
  
  // Check if there's already a valid ticket for this event and email
  const existingTicket = mockTickets.find(
    t => t.eventId === eventId && 
         t.attendeeEmail.toLowerCase() === email.toLowerCase() &&
         t.status !== 'cancelled'
  );
  
  return existingTicket || null;
};

/**
 * Register for an event
 */
export const registerForEvent = async (eventId, registrationData) => {
  await delay(800);
  
  const event = mockEvents.find(e => e.id === eventId);
  if (!event) {
    throw new Error('Event not found');
  }
  
  // Check for duplicate registration
  const existingRegistration = mockTickets.find(
    t => t.eventId === eventId && 
         t.attendeeEmail.toLowerCase() === registrationData.email.toLowerCase() &&
         t.status !== 'cancelled'
  );
  
  if (existingRegistration) {
    throw new Error('You are already registered for this event. Check your tickets to view your registration.');
  }
  
  // Check availability
  if (event.registrations >= event.capacity) {
    throw new Error('Event is fully booked');
  }
  
  // Generate ticket
  const ticketId = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  const qrCode = `EVT:${eventId}:ATT:${ticketId}:${Date.now()}`;
  
  const newTicket = {
    id: ticketId,
    eventId,
    eventName: event.name,
    eventDate: event.date,
    eventTime: event.time,
    eventLocation: event.location,
    eventImage: event.image,
    attendeeName: `${registrationData.firstName} ${registrationData.lastName}`,
    attendeeEmail: registrationData.email,
    ticketType: registrationData.ticketType || 'General Admission',
    qrCode,
    status: 'valid',
    registeredAt: new Date().toISOString(),
    checkedIn: false,
  };
  
  // Add to mock tickets (in real app, this goes to backend)
  mockTickets.push(newTicket);
  
  return newTicket;
};

/**
 * Fetch user's tickets
 */
export const fetchMyTickets = async () => {
  await delay(400);
  // In real app, filter by authenticated user
  return mockTickets.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
};

/**
 * Fetch single ticket details
 */
export const fetchTicketById = async (ticketId) => {
  await delay(200);
  const ticket = mockTickets.find(t => t.id === ticketId);
  if (!ticket) {
    throw new Error('Ticket not found');
  }
  return ticket;
};

/**
 * Cancel a ticket
 */
export const cancelTicket = async (ticketId) => {
  await delay(500);
  const ticketIndex = mockTickets.findIndex(t => t.id === ticketId);
  if (ticketIndex === -1) {
    throw new Error('Ticket not found');
  }
  
  mockTickets[ticketIndex].status = 'cancelled';
  return mockTickets[ticketIndex];
};

/**
 * Update registration details
 */
export const updateRegistration = async (ticketId, updateData) => {
  await delay(600);
  const ticketIndex = mockTickets.findIndex(t => t.id === ticketId);
  if (ticketIndex === -1) {
    throw new Error('Ticket not found');
  }
  
  // Update allowed fields
  if (updateData.attendeeName) {
    mockTickets[ticketIndex].attendeeName = updateData.attendeeName;
  }
  if (updateData.attendeeEmail) {
    mockTickets[ticketIndex].attendeeEmail = updateData.attendeeEmail;
  }
  if (updateData.ticketType) {
    mockTickets[ticketIndex].ticketType = updateData.ticketType;
  }
  if (updateData.phone) {
    mockTickets[ticketIndex].phone = updateData.phone;
  }
  if (updateData.specialRequirements !== undefined) {
    mockTickets[ticketIndex].specialRequirements = updateData.specialRequirements;
  }
  
  mockTickets[ticketIndex].updatedAt = new Date().toISOString();
  
  return mockTickets[ticketIndex];
};

/**
 * Fetch attendee dashboard stats
 */
export const fetchAttendeeStats = async () => {
  await delay(300);
  
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
};

/**
 * Get current user info
 */
export const getCurrentUser = async () => {
  await delay(100);
  return mockUser;
};

/**
 * Login
 */
export const login = async (email, password) => {
  await delay(600);
  // Mock login validation
  if (email && password) {
    return mockUser;
  }
  throw new Error('Invalid credentials');
};

/**
 * Logout
 */
export const logout = async () => {
  await delay(200);
  return true;
};
