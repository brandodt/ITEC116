/**
 * Mock Data for Attendee Module
 * Static data for development until NestJS backend is integrated
 */

export const mockCategories = [
  { id: 'technology', name: 'Technology', icon: '' },
  { id: 'workshop', name: 'Workshop', icon: '' },
  { id: 'networking', name: 'Networking', icon: '' },
  { id: 'conference', name: 'Conference', icon: '' },
  { id: 'music', name: 'Music & Arts', icon: '' },
  { id: 'sports', name: 'Sports', icon: '' },
  { id: 'education', name: 'Education', icon: '' },
  { id: 'business', name: 'Business', icon: '' },
];

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
    capacity: 500,
    registrations: 342,
    price: 2500,
    currency: 'PHP',
    ticketTypes: [
      { id: 'general', name: 'General Admission', price: 2500, available: 100 },
      { id: 'vip', name: 'VIP Access', price: 5000, available: 25 },
      { id: 'student', name: 'Student', price: 1500, available: 50 },
    ],
    organizer: 'TechPH Community',
    organizerLogo: 'https://ui-avatars.com/api/?name=TechPH&background=0ea5e9&color=fff',
    tags: ['AI', 'Innovation', 'Networking', 'Tech'],
    status: 'published',
    featured: true,
  },
  {
    id: 'evt-002',
    name: 'AI & Machine Learning Workshop',
    description: 'A hands-on workshop covering the fundamentals of AI and machine learning. Build your first ML model with Python and TensorFlow.',
    fullDescription: `
      <h3>Workshop Overview</h3>
      <p>Dive deep into the world of artificial intelligence and machine learning in this comprehensive, hands-on workshop designed for beginners and intermediate developers.</p>
      
      <h3>What You'll Learn</h3>
      <ul>
        <li>Introduction to AI/ML concepts</li>
        <li>Python for data science</li>
        <li>Building neural networks with TensorFlow</li>
        <li>Training and deploying ML models</li>
        <li>Real-world AI applications</li>
      </ul>
      
      <h3>Requirements</h3>
      <p>Bring your own laptop with Python 3.8+ installed. Basic programming knowledge recommended.</p>
    `,
    category: 'workshop',
    date: '2026-01-25',
    time: '13:00',
    endTime: '17:00',
    location: 'Co.Lab Coworking Space',
    address: '456 BGC, Taguig City',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    capacity: 50,
    registrations: 38,
    price: 1500,
    currency: 'PHP',
    ticketTypes: [
      { id: 'general', name: 'Workshop Pass', price: 1500, available: 12 },
    ],
    organizer: 'AI Philippines',
    organizerLogo: 'https://ui-avatars.com/api/?name=AI+PH&background=8b5cf6&color=fff',
    tags: ['AI', 'Machine Learning', 'Python', 'Workshop'],
    status: 'published',
    featured: false,
  },
  {
    id: 'evt-003',
    name: 'Startup Networking Night',
    description: 'Connect with fellow entrepreneurs, investors, and startup enthusiasts in an evening of networking and knowledge sharing.',
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
    capacity: 100,
    registrations: 89,
    price: 0,
    currency: 'PHP',
    ticketTypes: [
      { id: 'free', name: 'Free Entry', price: 0, available: 11 },
    ],
    organizer: 'StartupPH',
    organizerLogo: 'https://ui-avatars.com/api/?name=Startup&background=10b981&color=fff',
    tags: ['Networking', 'Startups', 'Business'],
    status: 'published',
    featured: true,
  },
  {
    id: 'evt-004',
    name: 'Web Development Bootcamp',
    description: 'Intensive 2-day bootcamp covering modern web development with React, Node.js, and cloud deployment.',
    fullDescription: `
      <h3>Bootcamp Details</h3>
      <p>Transform your web development skills in this intensive bootcamp. Learn modern frameworks and best practices from industry experts.</p>
      
      <h3>Curriculum</h3>
      <ul>
        <li>Day 1: React fundamentals, hooks, and state management</li>
        <li>Day 1: Building responsive UIs with Tailwind CSS</li>
        <li>Day 2: Node.js and Express backend development</li>
        <li>Day 2: Database integration and API design</li>
        <li>Day 2: Cloud deployment with AWS/Azure</li>
      </ul>
    `,
    category: 'workshop',
    date: '2026-02-08',
    time: '09:00',
    endTime: '17:00',
    location: 'Developer Academy PH',
    address: '321 Ortigas, Pasig City',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    capacity: 30,
    registrations: 28,
    price: 3500,
    currency: 'PHP',
    ticketTypes: [
      { id: 'bootcamp', name: 'Bootcamp Pass', price: 3500, available: 2 },
    ],
    organizer: 'DevAcademy',
    organizerLogo: 'https://ui-avatars.com/api/?name=Dev&background=f59e0b&color=fff',
    tags: ['React', 'Node.js', 'Web Development'],
    status: 'published',
    featured: false,
  },
  {
    id: 'evt-005',
    name: 'Digital Marketing Conference 2026',
    description: 'Learn the latest digital marketing strategies from top industry experts. SEO, social media, content marketing, and more.',
    fullDescription: `
      <h3>Conference Overview</h3>
      <p>Stay ahead in the digital marketing game with insights from the industry's best minds.</p>
      
      <h3>Topics Covered</h3>
      <ul>
        <li>SEO trends for 2026</li>
        <li>Social media algorithm updates</li>
        <li>Content marketing that converts</li>
        <li>Email marketing automation</li>
        <li>Analytics and ROI measurement</li>
      </ul>
    `,
    category: 'conference',
    date: '2026-03-10',
    time: '08:30',
    endTime: '17:30',
    location: 'SMX Convention Center',
    address: 'SM Aura, BGC, Taguig City',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
    capacity: 300,
    registrations: 156,
    price: 2000,
    currency: 'PHP',
    ticketTypes: [
      { id: 'general', name: 'General Pass', price: 2000, available: 100 },
      { id: 'premium', name: 'Premium (Front Row)', price: 3500, available: 20 },
    ],
    organizer: 'Marketing Guild PH',
    organizerLogo: 'https://ui-avatars.com/api/?name=MG&background=ec4899&color=fff',
    tags: ['Marketing', 'Digital', 'SEO', 'Social Media'],
    status: 'published',
    featured: false,
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
    capacity: 2000,
    registrations: 1456,
    price: 800,
    currency: 'PHP',
    ticketTypes: [
      { id: 'ga', name: 'General Admission', price: 800, available: 400 },
      { id: 'vip', name: 'VIP (Front Area)', price: 1500, available: 50 },
    ],
    organizer: 'IndieScene PH',
    organizerLogo: 'https://ui-avatars.com/api/?name=Indie&background=6366f1&color=fff',
    tags: ['Music', 'Festival', 'Indie', 'Live'],
    status: 'published',
    featured: true,
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
    capacity: 500,
    registrations: 234,
    price: 200,
    currency: 'PHP',
    ticketTypes: [
      { id: 'general', name: 'Regular Seat', price: 200, available: 200 },
      { id: 'courtside', name: 'Courtside', price: 500, available: 20 },
    ],
    organizer: 'Corporate Sports League',
    organizerLogo: 'https://ui-avatars.com/api/?name=CSL&background=ef4444&color=fff',
    tags: ['Sports', 'Basketball', 'Tournament'],
    status: 'published',
    featured: false,
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
    capacity: 40,
    registrations: 32,
    price: 4000,
    currency: 'PHP',
    ticketTypes: [
      { id: 'masterclass', name: 'Masterclass Pass', price: 4000, available: 8 },
    ],
    organizer: 'Data Science PH',
    organizerLogo: 'https://ui-avatars.com/api/?name=DS&background=14b8a6&color=fff',
    tags: ['Data Science', 'Deep Learning', 'NLP'],
    status: 'published',
    featured: false,
  },
];

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

export const mockUser = {
  id: 'user-001',
  firstName: 'Juan',
  lastName: 'Dela Cruz',
  email: 'juan@email.com',
  avatar: 'https://ui-avatars.com/api/?name=Juan+DC&background=0ea5e9&color=fff',
  role: 'attendee',
  phone: '+63 912 345 6789',
  createdAt: '2025-06-15T00:00:00Z',
};
