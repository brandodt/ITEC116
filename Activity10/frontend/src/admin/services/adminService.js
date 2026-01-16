/**
 * Admin Service
 * API abstraction layer for admin operations
 * Connected to NestJS backend
 */

import api from '../../shared/services/api';

// ============ NORMALIZATION HELPERS ============

/**
 * Normalize user object from MongoDB format
 */
const normalizeUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    id: user._id || user.id,
    // Map isActive boolean to status string for frontend compatibility
    status: user.status || (user.isActive === false ? 'inactive' : 'active'),
  };
};

/**
 * Transform user data from frontend format to backend format
 */
const transformUserForBackend = (userData, isCreate = false) => {
  // Only include fields that the backend DTO accepts
  const transformed = {};
  
  if (userData.name) transformed.name = userData.name;
  if (userData.email) transformed.email = userData.email;
  if (userData.password) transformed.password = userData.password;
  if (userData.role) transformed.role = userData.role;
  if (userData.phone) transformed.phone = userData.phone;
  if (userData.organization) transformed.organization = userData.organization;
  
  // For updates, include isActive if status was provided
  if (!isCreate && 'status' in userData) {
    transformed.isActive = userData.status === 'active';
  }
  
  return transformed;
};

/**
 * Normalize event object from MongoDB format
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
  };
};

/**
 * Normalize ticket/registration object from MongoDB format
 */
const normalizeTicket = (ticket) => {
  if (!ticket) return null;
  return {
    ...ticket,
    id: ticket._id || ticket.id,
    eventId: ticket.eventId?._id || ticket.eventId,
    userId: ticket.userId?._id || ticket.userId,
  };
};

// ============ USER MANAGEMENT ============

/**
 * Fetch all users (organizers, staff, admins)
 */
export const fetchAllUsers = async (filters = {}) => {
  let endpoint = '/users';
  const params = new URLSearchParams();
  
  if (filters.role && filters.role !== 'all') {
    params.append('role', filters.role);
  }
  
  const queryString = params.toString();
  if (queryString) {
    endpoint += `?${queryString}`;
  }
  
  const users = await api.get(endpoint);
  
  // Normalize and apply client-side filtering
  let filteredUsers = users.map(normalizeUser);
  
  if (filters.status && filters.status !== 'all') {
    filteredUsers = filteredUsers.filter(u => u.status === filters.status);
  }
  
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filteredUsers = filteredUsers.filter(u => 
      u.name?.toLowerCase().includes(search) ||
      u.email?.toLowerCase().includes(search)
    );
  }
  
  return filteredUsers;
};

/**
 * Fetch user by ID
 */
export const fetchUserById = async (userId) => {
  const user = await api.get(`/users/${userId}`);
  return normalizeUser(user);
};

/**
 * Create new user
 */
export const createUser = async (userData) => {
  const transformedData = transformUserForBackend(userData, true);
  const user = await api.post('/users', transformedData);
  return normalizeUser(user);
};

/**
 * Update user
 */
export const updateUser = async (userId, userData) => {
  const transformedData = transformUserForBackend(userData, false);
  const user = await api.patch(`/users/${userId}`, transformedData);
  return normalizeUser(user);
};

/**
 * Toggle user status (activate/deactivate)
 */
export const toggleUserStatus = async (userId) => {
  const user = await fetchUserById(userId);
  const isCurrentlyActive = user.status === 'active' || user.isActive === true;
  const updated = await api.patch(`/users/${userId}`, { isActive: !isCurrentlyActive });
  return normalizeUser(updated);
};

/**
 * Delete user
 */
export const deleteUser = async (userId) => {
  return api.delete(`/users/${userId}`);
};

// ============ EVENT MANAGEMENT ============

/**
 * Fetch all events (admin view - all organizers)
 */
export const fetchAllEvents = async (filters = {}) => {
  let endpoint = '/events';
  const params = new URLSearchParams();
  
  if (filters.status && filters.status !== 'all') {
    params.append('status', filters.status);
  }
  
  if (filters.category && filters.category !== 'all') {
    params.append('category', filters.category);
  }
  
  if (filters.organizer && filters.organizer !== 'all') {
    params.append('organizerId', filters.organizer);
  }
  
  const queryString = params.toString();
  if (queryString) {
    endpoint += `?${queryString}`;
  }
  
  const events = await api.get(endpoint);
  
  // Normalize and apply client-side search filter
  let filteredEvents = events.map(normalizeEvent);
  
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filteredEvents = filteredEvents.filter(e => 
      e.name?.toLowerCase().includes(search) ||
      e.organizerName?.toLowerCase().includes(search) ||
      e.location?.toLowerCase().includes(search)
    );
  }
  
  // Sort by date (newest first by default)
  filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return filteredEvents;
};

/**
 * Fetch event by ID with full details
 */
export const fetchEventById = async (eventId) => {
  const event = await api.get(`/events/${eventId}`);
  const normalizedEvent = normalizeEvent(event);
  
  // Get registrations for this event
  try {
    const registrations = await api.get(`/tickets/event/${eventId}`);
    const normalizedRegistrations = registrations.map(normalizeTicket);
    return {
      ...normalizedEvent,
      registrations: normalizedRegistrations,
      registrationCount: normalizedRegistrations.length,
      confirmedCount: normalizedRegistrations.filter(r => r.status === 'confirmed' || r.status === 'valid').length,
      cancelledCount: normalizedRegistrations.filter(r => r.status === 'cancelled').length,
      checkedInCount: normalizedRegistrations.filter(r => r.checkedIn).length,
    };
  } catch {
    return {
      ...normalizedEvent,
      registrations: [],
      registrationCount: normalizedEvent.registeredCount || 0,
      confirmedCount: normalizedEvent.registeredCount || 0,
      cancelledCount: 0,
      checkedInCount: normalizedEvent.checkedInCount || 0,
    };
  }
};

/**
 * Update event
 */
export const updateEvent = async (eventId, eventData) => {
  const event = await api.patch(`/events/${eventId}`, eventData);
  return normalizeEvent(event);
};

/**
 * Delete event
 */
export const deleteEvent = async (eventId) => {
  return api.delete(`/events/${eventId}`);
};

/**
 * Toggle event featured status
 */
export const toggleEventFeatured = async (eventId) => {
  const event = await api.get(`/events/${eventId}`);
  const updated = await api.patch(`/events/${eventId}`, { featured: !event.featured });
  return normalizeEvent(updated);
};

// ============ STATISTICS & REPORTS ============

/**
 * Fetch system-wide statistics
 */
export const fetchSystemStats = async () => {
  try {
    // Fetch events and users to calculate stats
    const [events, users, userStats] = await Promise.all([
      api.get('/events'),
      api.get('/users'),
      api.get('/users/stats').catch(() => null),
    ]);
    
    const upcomingEvents = events.filter(e => e.status === 'upcoming' || e.status === 'published').length;
    const completedEvents = events.filter(e => e.status === 'completed').length;
    const totalRegistrations = events.reduce((sum, e) => sum + (e.registeredCount || 0), 0);
    const totalRevenue = events.reduce((sum, e) => sum + ((e.price || 0) * (e.registeredCount || 0)), 0);
    const checkedIn = events.reduce((sum, e) => sum + (e.checkedInCount || 0), 0);
    
    return {
      totalUsers: users.length,
      activeOrganizers: users.filter(u => u.role === 'organizer' && u.status === 'active').length,
      totalEvents: events.length,
      upcomingEvents,
      completedEvents,
      totalRegistrations,
      totalRevenue,
      averageAttendanceRate: totalRegistrations > 0 ? Math.round((checkedIn / totalRegistrations) * 100) : 0,
      monthlyGrowth: {
        users: 12,
        events: 25,
        registrations: 18,
      },
      userStats,
    };
  } catch (error) {
    console.error('Failed to fetch system stats:', error);
    throw error;
  }
};

/**
 * Fetch activity logs
 * Note: This may need a dedicated endpoint in the backend
 */
export const fetchActivityLogs = async (limit = 10) => {
  // Activity logs endpoint might not exist in the backend
  // Return empty array for now
  return [];
};

/**
 * Fetch report data
 */
export const fetchReportData = async (reportType = 'all') => {
  try {
    const events = await api.get('/events');
    
    // Calculate report data from events
    const eventsByCategory = {};
    events.forEach(e => {
      const category = e.category || 'Other';
      eventsByCategory[category] = (eventsByCategory[category] || 0) + 1;
    });
    
    return {
      registrationsByMonth: [],
      eventsByCategory: Object.entries(eventsByCategory).map(([category, count]) => ({
        category,
        count,
      })),
      revenueByMonth: [],
      topOrganizers: [],
    };
  } catch (error) {
    console.error('Failed to fetch report data:', error);
    throw error;
  }
};

/**
 * Export data to CSV
 */
export const exportToCSV = async (dataType, filters = {}) => {
  let data = [];
  let headers = [];
  
  switch (dataType) {
    case 'users':
      const users = await fetchAllUsers(filters);
      headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Joined At'];
      data = users.map(u => [u._id || u.id, u.name, u.email, u.role, u.status, u.createdAt]);
      break;
    case 'events':
      const events = await fetchAllEvents(filters);
      headers = ['ID', 'Name', 'Date', 'Location', 'Organizer', 'Capacity', 'Registrations', 'Status'];
      data = events.map(e => [e._id || e.id, e.name, e.date, e.location, e.organizerName, e.capacity, e.registeredCount, e.status]);
      break;
    case 'registrations':
      // Fetch all tickets
      const tickets = await api.get('/tickets');
      headers = ['ID', 'Attendee', 'Email', 'Event', 'Status', 'Checked In', 'Registered At'];
      data = tickets.map(r => [r._id || r.id, r.attendeeName, r.attendeeEmail, r.eventName, r.status, r.checkedIn ? 'Yes' : 'No', r.createdAt]);
      break;
    default:
      throw new Error('Invalid data type');
  }
  
  // Generate CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row => row.map(cell => `"${cell || ''}"`).join(','))
  ].join('\n');
  
  return csvContent;
};

/**
 * Fetch all registrations/tickets
 */
export const fetchAllRegistrations = async (filters = {}) => {
  let endpoint = '/tickets';
  const params = new URLSearchParams();
  
  if (filters.eventId) {
    params.append('eventId', filters.eventId);
  }
  
  if (filters.status && filters.status !== 'all') {
    params.append('status', filters.status);
  }
  
  const queryString = params.toString();
  if (queryString) {
    endpoint += `?${queryString}`;
  }
  
  const tickets = await api.get(endpoint);
  return tickets.map(normalizeTicket);
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
