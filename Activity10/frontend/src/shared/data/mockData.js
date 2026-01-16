/**
 * Shared Mock Data for All Modules
 * Single source of truth for development data across Admin, Organizer, and Attendee modules
 */

// =============================================================================
// CATEGORIES
// =============================================================================
export const mockCategories = [
  { id: 'technology', name: 'Technology', icon: '' },
  { id: 'workshop', name: 'Workshop', icon: '' },
  { id: 'networking', name: 'Networking', icon: '' },
  { id: 'conference', name: 'Conference', icon: '' },
  { id: 'music', name: 'Music & Arts', icon: '' },
  { id: 'sports', name: 'Sports', icon: '' },
  { id: 'education', name: 'Education', icon: '' },
  { id: 'business', name: 'Business', icon: '' },
  { id: 'seminar', name: 'Seminar', icon: '' },
  { id: 'training', name: 'Training', icon: '' },
  { id: 'bootcamp', name: 'Bootcamp', icon: '' },
];

// =============================================================================
// ORGANIZER ACCOUNTS (for Authentication)
// =============================================================================
export const mockOrganizers = [
  {
    id: 'org-001',
    name: 'Alex Organizer',
    email: 'alex@organizer.com',
    password: 'password123',
    role: 'ORGANIZER',
    avatar: null,
    organization: 'Tech Innovators Inc.',
    eventsOwned: ['evt-001', 'evt-004'],
  },
  {
    id: 'org-002',
    name: 'Sarah Events',
    email: 'sarah@events.com',
    password: 'password123',
    role: 'ORGANIZER',
    avatar: null,
    organization: 'Code Academy',
    eventsOwned: ['evt-002', 'evt-003'],
  },
  {
    id: 'org-003',
    name: 'Mike Creative',
    email: 'mike@creative.com',
    password: 'password123',
    role: 'ORGANIZER',
    avatar: null,
    organization: 'Creative Design Studio',
    eventsOwned: ['evt-005'],
  },
];

// =============================================================================
// ADMIN ACCOUNTS (for Authentication)
// =============================================================================
export const mockAdmins = [
  {
    id: 'admin-001',
    name: 'System Admin',
    email: 'admin@eventhub.com',
    password: 'admin123',
    role: 'admin',
    avatar: null,
    permissions: ['manage_users', 'manage_events', 'view_reports', 'export_data', 'system_settings'],
  },
];

// =============================================================================
// ATTENDEE ACCOUNTS (for Authentication)
// =============================================================================
export const mockAttendeeUsers = [
  {
    id: 'user-001',
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    email: 'juan@email.com',
    password: 'password123',
    avatar: 'https://ui-avatars.com/api/?name=Juan+DC&background=0ea5e9&color=fff',
    role: 'attendee',
    phone: '+63 912 345 6789',
    createdAt: '2025-06-15T00:00:00Z',
  },
  {
    id: 'user-002',
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'maria@email.com',
    password: 'password123',
    avatar: 'https://ui-avatars.com/api/?name=Maria+S&background=8b5cf6&color=fff',
    role: 'attendee',
    phone: '+63 923 456 7890',
    createdAt: '2025-07-20T00:00:00Z',
  },
];

// =============================================================================
// ALL USERS (Admin perspective - includes all roles)
// =============================================================================
export const mockUsers = [
  {
    id: 'usr-001',
    name: 'Alex Organizer',
    email: 'alex@organizer.com',
    role: 'organizer',
    status: 'active',
    avatar: null,
    eventsCreated: 12,
    totalAttendees: 1523,
    joinedAt: '2024-06-15',
    lastActive: '2026-01-15',
  },
  {
    id: 'usr-002',
    name: 'Sarah Chen',
    email: 'sarah@events.com',
    role: 'organizer',
    status: 'active',
    avatar: null,
    eventsCreated: 8,
    totalAttendees: 892,
    joinedAt: '2024-09-20',
    lastActive: '2026-01-14',
  },
  {
    id: 'usr-003',
    name: 'Mike Johnson',
    email: 'mike@staff.com',
    role: 'staff',
    status: 'active',
    avatar: null,
    eventsCreated: 0,
    totalAttendees: 0,
    joinedAt: '2025-01-10',
    lastActive: '2026-01-16',
  },
  {
    id: 'usr-004',
    name: 'Emily Davis',
    email: 'emily.d@organizer.com',
    role: 'organizer',
    status: 'inactive',
    avatar: null,
    eventsCreated: 3,
    totalAttendees: 245,
    joinedAt: '2025-03-05',
    lastActive: '2025-11-20',
  },
  {
    id: 'usr-005',
    name: 'James Wilson',
    email: 'admin@eventhub.com',
    role: 'admin',
    status: 'active',
    avatar: null,
    eventsCreated: 0,
    totalAttendees: 0,
    joinedAt: '2024-01-01',
    lastActive: '2026-01-16',
  },
  {
    id: 'usr-006',
    name: 'Lisa Thompson',
    email: 'lisa.t@staff.com',
    role: 'staff',
    status: 'active',
    avatar: null,
    eventsCreated: 0,
    totalAttendees: 0,
    joinedAt: '2025-06-15',
    lastActive: '2026-01-15',
  },
  {
    id: 'usr-007',
    name: 'David Brown',
    email: 'david.b@organizer.com',
    role: 'organizer',
    status: 'pending',
    avatar: null,
    eventsCreated: 0,
    totalAttendees: 0,
    joinedAt: '2026-01-10',
    lastActive: '2026-01-10',
  },
];

// =============================================================================
// EVENTS (Unified across all modules)
// =============================================================================
export const mockEvents = [
  {
    id: 'evt-001',
    name: 'Tech Innovation Summit 2026',
    description: 'Join us for the biggest tech conference of the year! Explore cutting-edge innovations in AI, blockchain, cloud computing, and more. Network with industry leaders and discover the future of technology.',
    fullDescription: `
      <h3>About This Event</h3>
      <p>The Tech Innovation Summit 2026 brings together the brightest minds in technology for two days of inspiring talks, hands-on workshops, and unparalleled networking opportunities.</p>
      
      <h3>What to Expect</h3>
      <ul>
        <li>Keynote speeches from industry pioneers</li>
        <li>Interactive workshop sessions</li>
        <li>Product demonstrations and tech showcases</li>
        <li>Networking sessions with refreshments</li>
        <li>Career fair with top tech companies</li>
      </ul>
      
      <h3>Who Should Attend</h3>
      <p>This event is perfect for developers, entrepreneurs, tech enthusiasts, students, and anyone passionate about the future of technology.</p>
    `,
    category: 'technology',
    date: '2026-02-15',
    time: '09:00',
    endTime: '18:00',
    location: 'Metro Manila Convention Center',
    address: '123 EDSA, Pasay City, Metro Manila',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    capacity: 500,
    registrations: 342,
    registeredCount: 342,
    checkedIn: 0,
    checkedInCount: 0,
    price: 2500,
    currency: 'PHP',
    ticketTypes: [
      { id: 'general', name: 'General Admission', price: 2500, available: 100 },
      { id: 'vip', name: 'VIP Access', price: 5000, available: 25 },
      { id: 'student', name: 'Student', price: 1500, available: 50 },
    ],
    organizer: 'Tech Innovators Inc.',
    organizerId: 'org-001',
    organizerLogo: 'https://ui-avatars.com/api/?name=TechPH&background=0ea5e9&color=fff',
    tags: ['AI', 'Innovation', 'Networking', 'Tech'],
    status: 'upcoming',
    featured: true,
    createdAt: '2025-10-15',
    updatedAt: '2026-01-10T15:30:00Z',
  },
  {
    id: 'evt-002',
    name: 'Web Development Workshop',
    description: 'Hands-on workshop covering modern web development with React and Node.js.',
    fullDescription: `
      <h3>Workshop Overview</h3>
      <p>Transform your web development skills in this intensive workshop. Learn modern frameworks and best practices from industry experts.</p>
      
      <h3>Curriculum</h3>
      <ul>
        <li>React fundamentals, hooks, and state management</li>
        <li>Building responsive UIs with Tailwind CSS</li>
        <li>Node.js and Express backend development</li>
        <li>Database integration and API design</li>
      </ul>
    `,
    category: 'workshop',
    date: '2026-01-25',
    time: '13:00',
    endTime: '18:00',
    location: 'Digital Learning Hub, Room 201',
    address: '456 BGC, Taguig City',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    capacity: 50,
    registrations: 48,
    registeredCount: 48,
    checkedIn: 0,
    checkedInCount: 0,
    price: 1500,
    currency: 'PHP',
    ticketTypes: [
      { id: 'general', name: 'Workshop Pass', price: 1500, available: 2 },
    ],
    organizer: 'Code Academy',
    organizerId: 'org-002',
    organizerLogo: 'https://ui-avatars.com/api/?name=CA&background=8b5cf6&color=fff',
    tags: ['React', 'Node.js', 'Web Development'],
    status: 'upcoming',
    featured: false,
    createdAt: '2025-11-15T08:00:00Z',
    updatedAt: '2026-01-12T09:00:00Z',
  },
  {
    id: 'evt-003',
    name: 'Startup Networking Night',
    description: 'Connect with fellow entrepreneurs, investors, and mentors in a relaxed evening setting.',
    fullDescription: `
      <h3>Event Description</h3>
      <p>Join us for an evening dedicated to the startup ecosystem! Meet founders, investors, and professionals who share your passion for innovation.</p>
      
      <h3>Highlights</h3>
      <ul>
        <li>Startup pitches (5 minutes each)</li>
        <li>Investor panel discussion</li>
        <li>Speed networking sessions</li>
        <li>Food and drinks included</li>
      </ul>
    `,
    category: 'networking',
    date: '2026-01-30',
    time: '18:00',
    endTime: '21:00',
    location: 'The Hub Manila',
    address: '789 Makati Ave, Makati City',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
    capacity: 150,
    registrations: 89,
    registeredCount: 89,
    checkedIn: 0,
    checkedInCount: 0,
    price: 0,
    currency: 'PHP',
    ticketTypes: [
      { id: 'free', name: 'Free Entry', price: 0, available: 61 },
    ],
    organizer: 'Code Academy',
    organizerId: 'org-002',
    organizerLogo: 'https://ui-avatars.com/api/?name=Startup&background=10b981&color=fff',
    tags: ['Networking', 'Startups', 'Business'],
    status: 'upcoming',
    featured: true,
    createdAt: '2025-12-20T14:00:00Z',
    updatedAt: '2026-01-08T11:00:00Z',
  },
  {
    id: 'evt-004',
    name: 'AI & Machine Learning Conference',
    description: 'Explore the latest advancements in artificial intelligence and machine learning with expert speakers.',
    fullDescription: `
      <h3>Conference Overview</h3>
      <p>Dive deep into the world of artificial intelligence and machine learning in this comprehensive conference.</p>
      
      <h3>What You'll Learn</h3>
      <ul>
        <li>Introduction to AI/ML concepts</li>
        <li>Python for data science</li>
        <li>Building neural networks with TensorFlow</li>
        <li>Training and deploying ML models</li>
        <li>Real-world AI applications</li>
      </ul>
    `,
    category: 'conference',
    date: '2026-03-10',
    time: '08:30',
    endTime: '18:00',
    location: 'SMX Convention Center',
    address: 'SM Aura, BGC, Taguig City',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    capacity: 300,
    registrations: 156,
    registeredCount: 156,
    checkedIn: 0,
    checkedInCount: 0,
    price: 2000,
    currency: 'PHP',
    ticketTypes: [
      { id: 'general', name: 'General Pass', price: 2000, available: 100 },
      { id: 'premium', name: 'Premium (Front Row)', price: 3500, available: 20 },
    ],
    organizer: 'Tech Innovators Inc.',
    organizerId: 'org-001',
    organizerLogo: 'https://ui-avatars.com/api/?name=AI&background=8b5cf6&color=fff',
    tags: ['AI', 'Machine Learning', 'Python', 'Conference'],
    status: 'upcoming',
    featured: true,
    createdAt: '2025-10-01T12:00:00Z',
    updatedAt: '2026-01-14T16:00:00Z',
  },
  {
    id: 'evt-005',
    name: 'Design Thinking Bootcamp',
    description: 'Intensive 2-day bootcamp on design thinking methodologies for product innovation.',
    fullDescription: `
      <h3>Bootcamp Details</h3>
      <p>Take your design skills to the next level with this intensive bootcamp on design thinking methodology.</p>
      
      <h3>What's Included</h3>
      <ul>
        <li>Day 1: Design thinking fundamentals</li>
        <li>Day 2: Hands-on project work</li>
        <li>Certificate of completion</li>
        <li>Lunch and refreshments</li>
      </ul>
    `,
    category: 'bootcamp',
    date: '2026-02-20',
    time: '09:00',
    endTime: '17:00',
    location: 'Creative Studios Building',
    address: '555 Design Lane, Ortigas, Pasig City',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
    capacity: 30,
    registrations: 30,
    registeredCount: 30,
    checkedIn: 0,
    checkedInCount: 0,
    price: 4000,
    currency: 'PHP',
    ticketTypes: [
      { id: 'bootcamp', name: 'Bootcamp Pass', price: 4000, available: 0 },
    ],
    organizer: 'Creative Design Studio',
    organizerId: 'org-003',
    organizerLogo: 'https://ui-avatars.com/api/?name=CDS&background=f59e0b&color=fff',
    tags: ['Design', 'UX', 'Innovation', 'Bootcamp'],
    status: 'upcoming',
    featured: false,
    createdAt: '2025-11-01T10:00:00Z',
    updatedAt: '2026-01-05T14:00:00Z',
  },
  {
    id: 'evt-006',
    name: 'Indie Music Festival',
    description: 'A celebration of local indie music featuring 15+ bands and artists. Food trucks, art exhibits, and good vibes!',
    fullDescription: `
      <h3>Festival Info</h3>
      <p>Experience the best of Philippine indie music in one unforgettable day!</p>
      
      <h3>Lineup</h3>
      <ul>
        <li>Main Stage: Headliners from 6PM</li>
        <li>Side Stage: Emerging artists all day</li>
        <li>Acoustic Tent: Intimate performances</li>
      </ul>
      
      <h3>What's Included</h3>
      <p>Entry to all stages, festival kit, and access to food court area.</p>
    `,
    category: 'music',
    date: '2026-02-28',
    time: '14:00',
    endTime: '23:00',
    location: 'Circuit Makati Grounds',
    address: 'Circuit Makati, Makati City',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
    capacity: 2000,
    registrations: 1456,
    registeredCount: 1456,
    checkedIn: 0,
    checkedInCount: 0,
    price: 800,
    currency: 'PHP',
    ticketTypes: [
      { id: 'ga', name: 'General Admission', price: 800, available: 400 },
      { id: 'vip', name: 'VIP (Front Area)', price: 1500, available: 50 },
    ],
    organizer: 'IndieScene PH',
    organizerId: null,
    organizerLogo: 'https://ui-avatars.com/api/?name=Indie&background=6366f1&color=fff',
    tags: ['Music', 'Festival', 'Indie', 'Live'],
    status: 'published',
    featured: true,
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2026-01-10T11:00:00Z',
  },
  {
    id: 'evt-007',
    name: 'Basketball Tournament Finals',
    description: 'Watch the championship game of the inter-company basketball league. Exciting playoffs action!',
    fullDescription: `
      <h3>Championship Game</h3>
      <p>The culmination of the inter-company basketball league season!</p>
      
      <h3>Schedule</h3>
      <ul>
        <li>Gates Open: 4:00 PM</li>
        <li>Pre-game Show: 5:30 PM</li>
        <li>Tip-off: 6:00 PM</li>
      </ul>
    `,
    category: 'sports',
    date: '2026-02-20',
    time: '16:00',
    endTime: '21:00',
    location: 'Ynares Sports Arena',
    address: 'Pasig City',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
    capacity: 500,
    registrations: 234,
    registeredCount: 234,
    checkedIn: 0,
    checkedInCount: 0,
    price: 200,
    currency: 'PHP',
    ticketTypes: [
      { id: 'general', name: 'Regular Seat', price: 200, available: 200 },
      { id: 'courtside', name: 'Courtside', price: 500, available: 20 },
    ],
    organizer: 'Corporate Sports League',
    organizerId: null,
    organizerLogo: 'https://ui-avatars.com/api/?name=CSL&background=ef4444&color=fff',
    tags: ['Sports', 'Basketball', 'Tournament'],
    status: 'published',
    featured: false,
    createdAt: '2025-11-20T09:00:00Z',
    updatedAt: '2026-01-08T14:00:00Z',
  },
  {
    id: 'evt-008',
    name: 'Data Science Masterclass',
    description: 'Advanced data science techniques including deep learning, NLP, and computer vision. For intermediate practitioners.',
    fullDescription: `
      <h3>Masterclass Details</h3>
      <p>Take your data science skills to the next level with advanced techniques and real-world projects.</p>
      
      <h3>Prerequisites</h3>
      <ul>
        <li>Python programming experience</li>
        <li>Basic ML knowledge</li>
        <li>Familiarity with pandas/numpy</li>
      </ul>
    `,
    category: 'education',
    date: '2026-03-05',
    time: '09:00',
    endTime: '16:00',
    location: 'UP Diliman',
    address: 'Quezon City',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    capacity: 40,
    registrations: 32,
    registeredCount: 32,
    checkedIn: 0,
    checkedInCount: 0,
    price: 4000,
    currency: 'PHP',
    ticketTypes: [
      { id: 'masterclass', name: 'Masterclass Pass', price: 4000, available: 8 },
    ],
    organizer: 'Data Science PH',
    organizerId: null,
    organizerLogo: 'https://ui-avatars.com/api/?name=DS&background=14b8a6&color=fff',
    tags: ['Data Science', 'Deep Learning', 'NLP'],
    status: 'published',
    featured: false,
    createdAt: '2025-10-15T12:00:00Z',
    updatedAt: '2026-01-06T10:00:00Z',
  },
];

// =============================================================================
// ATTENDEES / REGISTRATIONS
// =============================================================================
export const mockAttendees = [
  // Tech Innovation Summit attendees
  { id: 'att-001', eventId: 'evt-001', name: 'John Smith', email: 'john.smith@email.com', company: 'Tech Corp', ticketCode: 'TIS2026-001', ticketType: 'VIP', checkedIn: false, checkInTime: null, registeredAt: '2025-12-05T10:00:00Z' },
  { id: 'att-002', eventId: 'evt-001', name: 'Sarah Johnson', email: 'sarah.j@email.com', company: 'Innovation Labs', ticketCode: 'TIS2026-002', ticketType: 'General', checkedIn: false, checkInTime: null, registeredAt: '2025-12-06T14:30:00Z' },
  { id: 'att-003', eventId: 'evt-001', name: 'Michael Chen', email: 'mchen@email.com', company: 'StartupXYZ', ticketCode: 'TIS2026-003', ticketType: 'General', checkedIn: false, checkInTime: null, registeredAt: '2025-12-07T09:15:00Z' },
  { id: 'att-004', eventId: 'evt-001', name: 'Emily Davis', email: 'emily.d@email.com', company: 'Digital Solutions', ticketCode: 'TIS2026-004', ticketType: 'Student', checkedIn: false, checkInTime: null, registeredAt: '2025-12-08T16:00:00Z' },
  { id: 'att-005', eventId: 'evt-001', name: 'Robert Wilson', email: 'rwilson@email.com', company: 'Future Tech', ticketCode: 'TIS2026-005', ticketType: 'General', checkedIn: false, checkInTime: null, registeredAt: '2025-12-10T11:00:00Z' },
  
  // Web Development Workshop attendees
  { id: 'att-006', eventId: 'evt-002', name: 'Lisa Anderson', email: 'lisa.a@email.com', company: null, ticketCode: 'WDW2026-001', ticketType: 'General', checkedIn: false, checkInTime: null, registeredAt: '2025-12-01T08:00:00Z' },
  { id: 'att-007', eventId: 'evt-002', name: 'David Brown', email: 'dbrown@email.com', company: 'WebDev Inc', ticketCode: 'WDW2026-002', ticketType: 'General', checkedIn: false, checkInTime: null, registeredAt: '2025-12-02T13:30:00Z' },
  { id: 'att-008', eventId: 'evt-002', name: 'Jennifer Lee', email: 'jlee@email.com', company: 'Code Academy', ticketCode: 'WDW2026-003', ticketType: 'General', checkedIn: false, checkInTime: null, registeredAt: '2025-12-03T10:00:00Z' },
  
  // Startup Networking Night attendees
  { id: 'att-009', eventId: 'evt-003', name: 'Thomas Garcia', email: 'tgarcia@email.com', company: 'Venture Capital LLC', ticketCode: 'SNN2026-001', ticketType: 'Free', checkedIn: false, checkInTime: null, registeredAt: '2025-12-22T09:00:00Z' },
  { id: 'att-010', eventId: 'evt-003', name: 'Amanda Martinez', email: 'amartinez@email.com', company: 'Startup Hub', ticketCode: 'SNN2026-002', ticketType: 'Free', checkedIn: false, checkInTime: null, registeredAt: '2025-12-23T14:00:00Z' },
  
  // AI & ML Conference attendees
  { id: 'att-011', eventId: 'evt-004', name: 'Christopher White', email: 'cwhite@email.com', company: 'AI Research Lab', ticketCode: 'AIML2026-001', ticketType: 'General', checkedIn: false, checkInTime: null, registeredAt: '2025-10-15T10:00:00Z' },
  { id: 'att-012', eventId: 'evt-004', name: 'Michelle Taylor', email: 'mtaylor@email.com', company: 'ML Solutions', ticketCode: 'AIML2026-002', ticketType: 'Premium', checkedIn: false, checkInTime: null, registeredAt: '2025-10-20T11:30:00Z' },
  { id: 'att-013', eventId: 'evt-004', name: 'Daniel Harris', email: 'dharris@email.com', company: 'Neural Networks Inc', ticketCode: 'AIML2026-003', ticketType: 'General', checkedIn: false, checkInTime: null, registeredAt: '2025-11-01T08:00:00Z' },
  
  // Design Thinking Bootcamp attendees
  { id: 'att-014', eventId: 'evt-005', name: 'Jessica Robinson', email: 'jrobinson@email.com', company: 'Creative Agency', ticketCode: 'DTB2026-001', ticketType: 'Bootcamp', checkedIn: false, checkInTime: null, registeredAt: '2025-11-10T09:00:00Z' },
  { id: 'att-015', eventId: 'evt-005', name: 'Kevin Clark', email: 'kclark@email.com', company: 'Design Studio', ticketCode: 'DTB2026-002', ticketType: 'Bootcamp', checkedIn: false, checkInTime: null, registeredAt: '2025-11-12T14:00:00Z' },
];

// =============================================================================
// TICKETS (Attendee's purchased tickets)
// =============================================================================
export let mockTickets = [
  {
    id: 'TKT-2026-ABC123',
    eventId: 'evt-001',
    eventName: 'Tech Innovation Summit 2026',
    eventDate: '2026-02-15',
    eventTime: '09:00',
    eventLocation: 'Metro Manila Convention Center',
    eventImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    attendeeName: 'Juan Dela Cruz',
    attendeeEmail: 'juan@email.com',
    ticketType: 'VIP Access',
    qrCode: 'EVT:evt-001:ATT:TKT-2026-ABC123:1705392000000',
    status: 'valid',
    registeredAt: '2026-01-10T08:30:00Z',
    checkedIn: false,
  },
  {
    id: 'TKT-2026-DEF456',
    eventId: 'evt-003',
    eventName: 'Startup Networking Night',
    eventDate: '2026-01-30',
    eventTime: '18:00',
    eventLocation: 'The Hub Manila',
    eventImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
    attendeeName: 'Juan Dela Cruz',
    attendeeEmail: 'juan@email.com',
    ticketType: 'Free Entry',
    qrCode: 'EVT:evt-003:ATT:TKT-2026-DEF456:1705392000001',
    status: 'valid',
    registeredAt: '2026-01-12T14:00:00Z',
    checkedIn: false,
  },
  {
    id: 'TKT-2026-GHI789',
    eventId: 'evt-006',
    eventName: 'Indie Music Festival',
    eventDate: '2026-02-28',
    eventTime: '14:00',
    eventLocation: 'Circuit Makati Grounds',
    eventImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
    attendeeName: 'Juan Dela Cruz',
    attendeeEmail: 'juan@email.com',
    ticketType: 'General Admission',
    qrCode: 'EVT:evt-006:ATT:TKT-2026-GHI789:1705392000002',
    status: 'valid',
    registeredAt: '2026-01-14T10:15:00Z',
    checkedIn: false,
  },
];

// =============================================================================
// ALL REGISTRATIONS (Admin perspective)
// =============================================================================
export const mockAllRegistrations = [
  { id: 'reg-001', attendeeName: 'Juan Dela Cruz', email: 'juan@email.com', eventId: 'evt-001', eventName: 'Tech Innovation Summit 2026', ticketType: 'VIP', status: 'confirmed', checkedIn: false, registeredAt: '2025-12-01' },
  { id: 'reg-002', attendeeName: 'Maria Santos', email: 'maria@email.com', eventId: 'evt-001', eventName: 'Tech Innovation Summit 2026', ticketType: 'General', status: 'confirmed', checkedIn: false, registeredAt: '2025-12-05' },
  { id: 'reg-003', attendeeName: 'Pedro Reyes', email: 'pedro@email.com', eventId: 'evt-002', eventName: 'Web Development Workshop', ticketType: 'General', status: 'confirmed', checkedIn: false, registeredAt: '2025-12-10' },
  { id: 'reg-004', attendeeName: 'Ana Garcia', email: 'ana@email.com', eventId: 'evt-003', eventName: 'Startup Networking Night', ticketType: 'General', status: 'confirmed', checkedIn: true, registeredAt: '2025-12-15' },
  { id: 'reg-005', attendeeName: 'Carlos Mendoza', email: 'carlos@email.com', eventId: 'evt-004', eventName: 'AI & Machine Learning Conference', ticketType: 'Early Bird', status: 'confirmed', checkedIn: false, registeredAt: '2025-12-20' },
  { id: 'reg-006', attendeeName: 'Rosa Fernandez', email: 'rosa@email.com', eventId: 'evt-001', eventName: 'Tech Innovation Summit 2026', ticketType: 'General', status: 'cancelled', checkedIn: false, registeredAt: '2025-12-22' },
  { id: 'reg-007', attendeeName: 'Miguel Lopez', email: 'miguel@email.com', eventId: 'evt-005', eventName: 'Design Thinking Bootcamp', ticketType: 'General', status: 'confirmed', checkedIn: false, registeredAt: '2026-01-02' },
  { id: 'reg-008', attendeeName: 'Isabella Cruz', email: 'isabella@email.com', eventId: 'evt-004', eventName: 'AI & Machine Learning Conference', ticketType: 'VIP', status: 'confirmed', checkedIn: false, registeredAt: '2026-01-05' },
];

// =============================================================================
// SYSTEM STATISTICS (Admin Dashboard)
// =============================================================================
export const mockSystemStats = {
  totalUsers: 7,
  activeOrganizers: 3,
  totalEvents: 8,
  upcomingEvents: 6,
  completedEvents: 2,
  totalRegistrations: 815,
  totalRevenue: 1250000,
  averageAttendanceRate: 87,
  monthlyGrowth: {
    users: 12,
    events: 25,
    registrations: 18,
  },
};

// =============================================================================
// ACTIVITY LOGS (Admin)
// =============================================================================
export const mockActivityLogs = [
  { id: 'log-001', action: 'Event Created', user: 'Alex Organizer', details: 'Created "Tech Innovation Summit 2026"', timestamp: '2025-10-15T10:30:00Z' },
  { id: 'log-002', action: 'User Registered', user: 'David Brown', details: 'New organizer registration pending approval', timestamp: '2026-01-10T14:20:00Z' },
  { id: 'log-003', action: 'Event Completed', user: 'System', details: '"Startup Networking Night" marked as completed', timestamp: '2026-01-08T22:00:00Z' },
  { id: 'log-004', action: 'Check-in', user: 'Mike Johnson', details: '85 attendees checked in for "Startup Networking Night"', timestamp: '2026-01-08T18:30:00Z' },
  { id: 'log-005', action: 'Export Generated', user: 'James Wilson', details: 'Monthly attendance report exported', timestamp: '2026-01-01T09:00:00Z' },
  { id: 'log-006', action: 'User Deactivated', user: 'James Wilson', details: 'Emily Davis account set to inactive', timestamp: '2025-11-20T16:45:00Z' },
  { id: 'log-007', action: 'Event Updated', user: 'Sarah Chen', details: 'Updated "AI & Machine Learning Conference" details', timestamp: '2026-01-14T11:15:00Z' },
  { id: 'log-008', action: 'Bulk Registration', user: 'System', details: '50 new registrations for "Tech Innovation Summit 2026"', timestamp: '2026-01-13T08:00:00Z' },
];

// =============================================================================
// REPORT DATA (Admin)
// =============================================================================
export const mockReportData = {
  registrationsByMonth: [
    { month: 'Aug', count: 120 },
    { month: 'Sep', count: 185 },
    { month: 'Oct', count: 210 },
    { month: 'Nov', count: 165 },
    { month: 'Dec', count: 290 },
    { month: 'Jan', count: 345 },
  ],
  eventsByCategory: [
    { category: 'Technology', count: 3 },
    { category: 'Workshop', count: 3 },
    { category: 'Networking', count: 1 },
    { category: 'Seminar', count: 1 },
    { category: 'Training', count: 1 },
  ],
  revenueByMonth: [
    { month: 'Aug', revenue: 150000 },
    { month: 'Sep', revenue: 220000 },
    { month: 'Oct', revenue: 180000 },
    { month: 'Nov', revenue: 195000 },
    { month: 'Dec', revenue: 285000 },
    { month: 'Jan', revenue: 320000 },
  ],
  topOrganizers: [
    { name: 'Alex Organizer', events: 12, attendees: 1523, revenue: 650000 },
    { name: 'Sarah Chen', events: 8, attendees: 892, revenue: 420000 },
    { name: 'Emily Davis', events: 3, attendees: 245, revenue: 180000 },
  ],
};

// =============================================================================
// HELPER: Get default attendee user (for backwards compatibility)
// =============================================================================
export const mockUser = mockAttendeeUsers[0];

// =============================================================================
// DEFAULT EXPORT
// =============================================================================
export default {
  // Categories
  mockCategories,
  
  // Auth
  mockOrganizers,
  mockAdmins,
  mockAttendeeUsers,
  
  // Users (Admin view)
  mockUsers,
  
  // Events
  mockEvents,
  
  // Attendees & Registrations
  mockAttendees,
  mockTickets,
  mockAllRegistrations,
  
  // Statistics & Reports
  mockSystemStats,
  mockActivityLogs,
  mockReportData,
  
  // Backwards compatibility
  mockUser,
};
