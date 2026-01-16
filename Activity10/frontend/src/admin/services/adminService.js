/**
 * Admin Service
 * API abstraction layer for admin operations
 * Currently uses mock data, ready to connect to NestJS backend
 */

import {
  mockUsers,
  mockEvents as mockAllEvents,
  mockAllRegistrations,
  mockSystemStats,
  mockActivityLogs,
  mockReportData,
} from '../../shared/data/mockData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============ USER MANAGEMENT ============

/**
 * Fetch all users (organizers, staff, admins)
 */
export const fetchAllUsers = async (filters = {}) => {
  await delay(600);
  
  let users = [...mockUsers];
  
  if (filters.role && filters.role !== 'all') {
    users = users.filter(u => u.role === filters.role);
  }
  
  if (filters.status && filters.status !== 'all') {
    users = users.filter(u => u.status === filters.status);
  }
  
  if (filters.search) {
    const search = filters.search.toLowerCase();
    users = users.filter(u => 
      u.name.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search)
    );
  }
  
  return users;
};

/**
 * Fetch user by ID
 */
export const fetchUserById = async (userId) => {
  await delay(400);
  const user = mockUsers.find(u => u.id === userId);
  if (!user) throw new Error('User not found');
  return user;
};

/**
 * Create new user
 */
export const createUser = async (userData) => {
  await delay(800);
  const newUser = {
    id: `usr-${Date.now()}`,
    ...userData,
    eventsCreated: 0,
    totalAttendees: 0,
    joinedAt: new Date().toISOString().split('T')[0],
    lastActive: new Date().toISOString().split('T')[0],
  };
  mockUsers.push(newUser);
  return newUser;
};

/**
 * Update user
 */
export const updateUser = async (userId, userData) => {
  await delay(600);
  const index = mockUsers.findIndex(u => u.id === userId);
  if (index === -1) throw new Error('User not found');
  
  mockUsers[index] = { ...mockUsers[index], ...userData };
  return mockUsers[index];
};

/**
 * Toggle user status (activate/deactivate)
 */
export const toggleUserStatus = async (userId) => {
  await delay(500);
  const user = mockUsers.find(u => u.id === userId);
  if (!user) throw new Error('User not found');
  
  user.status = user.status === 'active' ? 'inactive' : 'active';
  return user;
};

/**
 * Delete user
 */
export const deleteUser = async (userId) => {
  await delay(500);
  const index = mockUsers.findIndex(u => u.id === userId);
  if (index === -1) throw new Error('User not found');
  
  mockUsers.splice(index, 1);
  return { success: true };
};

// ============ EVENT MANAGEMENT ============

/**
 * Fetch all events (admin view - all organizers)
 */
export const fetchAllEvents = async (filters = {}) => {
  await delay(600);
  
  let events = [...mockAllEvents];
  
  if (filters.status && filters.status !== 'all') {
    events = events.filter(e => e.status === filters.status);
  }
  
  if (filters.category && filters.category !== 'all') {
    events = events.filter(e => e.category === filters.category);
  }
  
  if (filters.organizer && filters.organizer !== 'all') {
    events = events.filter(e => e.organizerId === filters.organizer);
  }
  
  if (filters.search) {
    const search = filters.search.toLowerCase();
    events = events.filter(e => 
      e.name.toLowerCase().includes(search) ||
      e.organizer.toLowerCase().includes(search) ||
      e.location.toLowerCase().includes(search)
    );
  }
  
  // Sort by date (newest first by default)
  events.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return events;
};

/**
 * Fetch event by ID with full details
 */
export const fetchEventById = async (eventId) => {
  await delay(400);
  const event = mockAllEvents.find(e => e.id === eventId);
  if (!event) throw new Error('Event not found');
  
  // Get registrations for this event
  const registrations = mockAllRegistrations.filter(r => r.eventId === eventId);
  
  return {
    ...event,
    registrations: registrations,
    registrationCount: registrations.length,
    confirmedCount: registrations.filter(r => r.status === 'confirmed').length,
    cancelledCount: registrations.filter(r => r.status === 'cancelled').length,
    checkedInCount: registrations.filter(r => r.checkedIn).length,
  };
};

/**
 * Update event
 */
export const updateEvent = async (eventId, eventData) => {
  await delay(600);
  const index = mockAllEvents.findIndex(e => e.id === eventId);
  if (index === -1) throw new Error('Event not found');
  
  mockAllEvents[index] = { ...mockAllEvents[index], ...eventData };
  return mockAllEvents[index];
};

/**
 * Delete event
 */
export const deleteEvent = async (eventId) => {
  await delay(500);
  const index = mockAllEvents.findIndex(e => e.id === eventId);
  if (index === -1) throw new Error('Event not found');
  
  mockAllEvents.splice(index, 1);
  return { success: true };
};

/**
 * Toggle event featured status
 */
export const toggleEventFeatured = async (eventId) => {
  await delay(300);
  const event = mockAllEvents.find(e => e.id === eventId);
  if (!event) throw new Error('Event not found');
  
  event.featured = !event.featured;
  return event;
};

// ============ STATISTICS & REPORTS ============

/**
 * Fetch system-wide statistics
 */
export const fetchSystemStats = async () => {
  await delay(500);
  return { ...mockSystemStats };
};

/**
 * Fetch activity logs
 */
export const fetchActivityLogs = async (limit = 10) => {
  await delay(400);
  return mockActivityLogs.slice(0, limit);
};

/**
 * Fetch report data
 */
export const fetchReportData = async (reportType = 'all') => {
  await delay(600);
  
  if (reportType === 'registrations') {
    return { registrationsByMonth: mockReportData.registrationsByMonth };
  }
  if (reportType === 'revenue') {
    return { revenueByMonth: mockReportData.revenueByMonth };
  }
  if (reportType === 'categories') {
    return { eventsByCategory: mockReportData.eventsByCategory };
  }
  if (reportType === 'organizers') {
    return { topOrganizers: mockReportData.topOrganizers };
  }
  
  return { ...mockReportData };
};

/**
 * Export data to CSV
 */
export const exportToCSV = async (dataType, filters = {}) => {
  await delay(800);
  
  let data = [];
  let headers = [];
  
  switch (dataType) {
    case 'users':
      headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Events Created', 'Total Attendees', 'Joined At'];
      data = mockUsers.map(u => [u.id, u.name, u.email, u.role, u.status, u.eventsCreated, u.totalAttendees, u.joinedAt]);
      break;
    case 'events':
      headers = ['ID', 'Name', 'Date', 'Location', 'Organizer', 'Capacity', 'Registrations', 'Status', 'Revenue'];
      data = mockAllEvents.map(e => [e.id, e.name, e.date, e.location, e.organizer, e.capacity, e.registrations, e.status, e.price * e.registrations]);
      break;
    case 'registrations':
      headers = ['ID', 'Attendee', 'Email', 'Event', 'Ticket Type', 'Status', 'Checked In', 'Registered At'];
      data = mockAllRegistrations.map(r => [r.id, r.attendeeName, r.email, r.eventName, r.ticketType, r.status, r.checkedIn ? 'Yes' : 'No', r.registeredAt]);
      break;
    default:
      throw new Error('Invalid data type');
  }
  
  // Generate CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
};

/**
 * Fetch all registrations
 */
export const fetchAllRegistrations = async (filters = {}) => {
  await delay(500);
  
  let registrations = [...mockAllRegistrations];
  
  if (filters.eventId) {
    registrations = registrations.filter(r => r.eventId === filters.eventId);
  }
  
  if (filters.status && filters.status !== 'all') {
    registrations = registrations.filter(r => r.status === filters.status);
  }
  
  return registrations;
};

export default {
  fetchAllUsers,
  fetchUserById,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
  fetchAllEvents,
  fetchEventById,
  updateEvent,
  deleteEvent,
  toggleEventFeatured,
  fetchSystemStats,
  fetchActivityLogs,
  fetchReportData,
  exportToCSV,
  fetchAllRegistrations,
};
