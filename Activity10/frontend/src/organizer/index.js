/**
 * Organizer Module Entry Point
 * Export all organizer-related components, pages, and utilities
 */

// Context Providers
export { AuthProvider, useAuth, ROLES } from './contexts/AuthContext';

// Layout Components
export { default as OrganizerLayout } from './components/OrganizerLayout';

// UI Components
export { default as EventCard } from './components/EventCard';
export { default as EventForm } from './components/EventForm';
export { default as AttendeeTable } from './components/AttendeeTable';
export { default as FormDrawer } from './components/FormDrawer';
export { default as StatsCard } from './components/StatsCard';
export { 
  Toast, 
  InlineFeedback, 
  EmptyState, 
  Spinner, 
  PageLoader 
} from './components/Feedback';
export { 
  EventCardSkeleton, 
  StatsCardSkeleton, 
  TableRowSkeleton,
  AttendeeTableSkeleton,
  DashboardSkeleton,
  FormSkeleton 
} from './components/LoadingSkeleton';

// Pages
export { default as Dashboard } from './pages/Dashboard';
export { default as EventsList } from './pages/EventsList';
export { default as AttendeeOverview } from './pages/AttendeeOverview';
export { default as CheckInScanner } from './pages/CheckInScanner';

// Services
export * from './services/eventService';

// Mock Data (for development)
export { mockEvents, mockAttendees, mockUser } from './data/mockData';
