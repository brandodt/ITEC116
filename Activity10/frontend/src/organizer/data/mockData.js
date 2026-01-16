/**
 * Mock data for development and testing
 * This will be replaced by actual API calls to the NestJS backend
 */

export const mockEvents = [
  {
    id: 'evt-001',
    name: 'Tech Innovation Summit 2026',
    description: 'Join industry leaders for a day of innovation, networking, and cutting-edge technology discussions.',
    date: '2026-02-15',
    time: '09:00',
    endTime: '17:00',
    location: 'Grand Convention Center, Hall A',
    address: '123 Innovation Drive, Tech City, TC 12345',
    capacity: 500,
    registeredCount: 342,
    checkedInCount: 0,
    status: 'upcoming',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    organizerName: 'Tech Innovators Inc.',
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2026-01-10T15:30:00Z',
  },
  {
    id: 'evt-002',
    name: 'Web Development Workshop',
    description: 'Hands-on workshop covering modern web development practices with React and Node.js.',
    date: '2026-01-25',
    time: '13:00',
    endTime: '18:00',
    location: 'Digital Learning Hub, Room 201',
    address: '456 Code Street, Developer Town, DT 67890',
    capacity: 50,
    registeredCount: 48,
    checkedInCount: 0,
    status: 'upcoming',
    category: 'Workshop',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    organizerName: 'Code Academy',
    createdAt: '2025-11-15T08:00:00Z',
    updatedAt: '2026-01-12T09:00:00Z',
  },
  {
    id: 'evt-003',
    name: 'Startup Networking Night',
    description: 'Connect with fellow entrepreneurs, investors, and mentors in a relaxed evening setting.',
    date: '2026-01-30',
    time: '18:00',
    endTime: '21:00',
    location: 'The Innovation Lounge',
    address: '789 Venture Avenue, Startup City, SC 11111',
    capacity: 150,
    registeredCount: 89,
    checkedInCount: 0,
    status: 'upcoming',
    category: 'Networking',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
    organizerName: 'Startup Hub',
    createdAt: '2025-12-20T14:00:00Z',
    updatedAt: '2026-01-08T11:00:00Z',
  },
  {
    id: 'evt-004',
    name: 'AI & Machine Learning Conference',
    description: 'Explore the latest advancements in artificial intelligence and machine learning with expert speakers.',
    date: '2026-03-10',
    time: '08:30',
    endTime: '18:00',
    location: 'University Conference Center',
    address: '321 Academic Blvd, Knowledge City, KC 22222',
    capacity: 300,
    registeredCount: 156,
    checkedInCount: 0,
    status: 'upcoming',
    category: 'Conference',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    organizerName: 'AI Research Lab',
    createdAt: '2025-10-01T12:00:00Z',
    updatedAt: '2026-01-14T16:00:00Z',
  },
  {
    id: 'evt-005',
    name: 'Design Thinking Bootcamp',
    description: 'Intensive 2-day bootcamp on design thinking methodologies for product innovation.',
    date: '2026-02-20',
    time: '09:00',
    endTime: '17:00',
    location: 'Creative Studios Building',
    address: '555 Design Lane, Art District, AD 33333',
    capacity: 30,
    registeredCount: 30,
    checkedInCount: 0,
    status: 'upcoming',
    category: 'Bootcamp',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
    organizerName: 'Creative Design Studio',
    createdAt: '2025-11-01T10:00:00Z',
    updatedAt: '2026-01-05T14:00:00Z',
  },
];

export const mockAttendees = [
  // Tech Innovation Summit attendees
  { id: 'att-001', eventId: 'evt-001', name: 'John Smith', email: 'john.smith@email.com', company: 'Tech Corp', ticketCode: 'TIS2026-001', checkedIn: false, checkInTime: null, registeredAt: '2025-12-05T10:00:00Z' },
  { id: 'att-002', eventId: 'evt-001', name: 'Sarah Johnson', email: 'sarah.j@email.com', company: 'Innovation Labs', ticketCode: 'TIS2026-002', checkedIn: false, checkInTime: null, registeredAt: '2025-12-06T14:30:00Z' },
  { id: 'att-003', eventId: 'evt-001', name: 'Michael Chen', email: 'mchen@email.com', company: 'StartupXYZ', ticketCode: 'TIS2026-003', checkedIn: false, checkInTime: null, registeredAt: '2025-12-07T09:15:00Z' },
  { id: 'att-004', eventId: 'evt-001', name: 'Emily Davis', email: 'emily.d@email.com', company: 'Digital Solutions', ticketCode: 'TIS2026-004', checkedIn: false, checkInTime: null, registeredAt: '2025-12-08T16:00:00Z' },
  { id: 'att-005', eventId: 'evt-001', name: 'Robert Wilson', email: 'rwilson@email.com', company: 'Future Tech', ticketCode: 'TIS2026-005', checkedIn: false, checkInTime: null, registeredAt: '2025-12-10T11:00:00Z' },
  
  // Web Development Workshop attendees
  { id: 'att-006', eventId: 'evt-002', name: 'Lisa Anderson', email: 'lisa.a@email.com', company: null, ticketCode: 'WDW2026-001', checkedIn: false, checkInTime: null, registeredAt: '2025-12-01T08:00:00Z' },
  { id: 'att-007', eventId: 'evt-002', name: 'David Brown', email: 'dbrown@email.com', company: 'WebDev Inc', ticketCode: 'WDW2026-002', checkedIn: false, checkInTime: null, registeredAt: '2025-12-02T13:30:00Z' },
  { id: 'att-008', eventId: 'evt-002', name: 'Jennifer Lee', email: 'jlee@email.com', company: 'Code Academy', ticketCode: 'WDW2026-003', checkedIn: false, checkInTime: null, registeredAt: '2025-12-03T10:00:00Z' },
  
  // Startup Networking Night attendees
  { id: 'att-009', eventId: 'evt-003', name: 'Thomas Garcia', email: 'tgarcia@email.com', company: 'Venture Capital LLC', ticketCode: 'SNN2026-001', checkedIn: false, checkInTime: null, registeredAt: '2025-12-22T09:00:00Z' },
  { id: 'att-010', eventId: 'evt-003', name: 'Amanda Martinez', email: 'amartinez@email.com', company: 'Startup Hub', ticketCode: 'SNN2026-002', checkedIn: false, checkInTime: null, registeredAt: '2025-12-23T14:00:00Z' },
  
  // AI & ML Conference attendees
  { id: 'att-011', eventId: 'evt-004', name: 'Christopher White', email: 'cwhite@email.com', company: 'AI Research Lab', ticketCode: 'AIML2026-001', checkedIn: false, checkInTime: null, registeredAt: '2025-10-15T10:00:00Z' },
  { id: 'att-012', eventId: 'evt-004', name: 'Michelle Taylor', email: 'mtaylor@email.com', company: 'ML Solutions', ticketCode: 'AIML2026-002', checkedIn: false, checkInTime: null, registeredAt: '2025-10-20T11:30:00Z' },
  { id: 'att-013', eventId: 'evt-004', name: 'Daniel Harris', email: 'dharris@email.com', company: 'Neural Networks Inc', ticketCode: 'AIML2026-003', checkedIn: false, checkInTime: null, registeredAt: '2025-11-01T08:00:00Z' },
  
  // Design Thinking Bootcamp attendees
  { id: 'att-014', eventId: 'evt-005', name: 'Jessica Robinson', email: 'jrobinson@email.com', company: 'Creative Agency', ticketCode: 'DTB2026-001', checkedIn: false, checkInTime: null, registeredAt: '2025-11-10T09:00:00Z' },
  { id: 'att-015', eventId: 'evt-005', name: 'Kevin Clark', email: 'kclark@email.com', company: 'Design Studio', ticketCode: 'DTB2026-002', checkedIn: false, checkInTime: null, registeredAt: '2025-11-12T14:00:00Z' },
];

export const mockUser = {
  id: 'org-001',
  name: 'Alex Organizer',
  email: 'alex@organizer.com',
  role: 'ORGANIZER',
  avatar: null,
};
