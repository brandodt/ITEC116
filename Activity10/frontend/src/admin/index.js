/**
 * Admin Module Exports
 * Centralized exports for the Admin module
 */

// Main App
export { default as AdminApp } from './AdminApp';

// Pages
export { default as Dashboard } from './pages/Dashboard';
export { default as EventsList } from './pages/EventsList';
export { default as ManageUsers } from './pages/ManageUsers';
export { default as Reports } from './pages/Reports';

// Components
export { default as AdminLayout } from './components/AdminLayout';
export { default as StatsCard } from './components/StatsCard';
export { default as UserTable } from './components/UserTable';
export { default as EventTable } from './components/EventTable';
export * from './components/LoadingSkeleton';
export * from './components/Feedback';

// Context
export { AdminAuthProvider, useAdminAuth } from './contexts/AdminAuthContext';

// Services
export * from './services/adminService';

// Data
export * from './data/mockData';
