/**
 * Shared Module Index
 * Export all shared components, data, and services
 */

// Components
export { default as LogoutConfirmModal } from './components/LogoutConfirmModal';
export { default as ConfirmModal } from './components/ConfirmModal';

// Services
export { default as api } from './services/api';
export * from './services/api';
export * from './services/authService';

// Data (keeping for backwards compatibility)
export * from './data/mockData';
