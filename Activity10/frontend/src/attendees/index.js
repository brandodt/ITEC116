/**
 * Attendee Module Exports
 * Sky Blue/Violet color palette for friendly/social experience
 */

// Main App
export { default as AttendeeApp } from './AttendeeApp';

// Pages
export { default as EventDiscovery } from './pages/EventDiscovery';
export { default as EventDetails } from './pages/EventDetails';
export { default as MyTickets } from './pages/MyTickets';
export { default as Login } from './pages/Login';

// Components
export { default as AttendeeLayout } from './components/AttendeeLayout';
export { default as EventCard } from './components/EventCard';
export { default as TicketCard } from './components/TicketCard';
export { default as QRCodeModal } from './components/QRCodeModal';
export { default as RegistrationForm } from './components/RegistrationForm';
export { default as CategoryFilter } from './components/CategoryFilter';
export { default as StatsCard } from './components/StatsCard';
export * from './components/LoadingSkeleton';

// Context
export { AttendeeAuthProvider, useAttendeeAuth } from './contexts/AttendeeAuthContext';

// Services
export * from './services/attendeeService';

// Data
export * from './data/mockData';
