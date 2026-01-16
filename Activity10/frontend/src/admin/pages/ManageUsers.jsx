import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users,
  UserPlus,
  RefreshCw,
  Download,
  X,
  Check,
  Mail,
  Shield
} from 'react-feather';
import AdminLayout from '../components/AdminLayout';
import UserTable from '../components/UserTable';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { EmptyState, ConfirmModal, Alert } from '../components/Feedback';
import { 
  fetchAllUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  toggleUserStatus,
  exportToCSV 
} from '../services/adminService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Manage Users Page (Admin)
 * Add, edit, and manage organizers & staff
 * Indigo/Deep Slate color palette
 */

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'organizer',
    status: 'active',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load users
  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
      console.error('Load error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle add user
  const handleAddUser = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'organizer',
      status: 'active',
    });
    setFormErrors({});
    setShowAddModal(true);
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setFormErrors({});
    setShowAddModal(true);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      if (selectedUser) {
        await updateUser(selectedUser.id, formData);
        toast.success('User updated successfully');
      } else {
        await createUser(formData);
        toast.success('User created successfully');
      }
      setShowAddModal(false);
      loadUsers();
    } catch (error) {
      toast.error(selectedUser ? 'Failed to update user' : 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (user) => {
    try {
      await toggleUserStatus(user.id);
      toast.success(`User ${user.status === 'active' ? 'deactivated' : 'activated'}`);
      loadUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  // Handle delete user
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id);
      toast.success('User deleted successfully');
      loadUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
    setSelectedUser(null);
  };

  // Handle export
  const handleExport = async () => {
    try {
      setIsExporting(true);
      const csvData = await exportToCSV('users');
      
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Users exported successfully');
    } catch (error) {
      toast.error('Failed to export users');
    } finally {
      setIsExporting(false);
    }
  };

  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const organizers = users.filter(u => u.role === 'organizer').length;
  const pendingUsers = users.filter(u => u.status === 'pending').length;

  return (
    <AdminLayout activePage="users">
      {/* Page Header */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            Manage Users
          </h1>
          <p className="text-slate-400">
            Add and manage organizers, staff, and administrators
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50"
          >
            <Download className={`w-4 h-4 ${isExporting ? 'animate-pulse' : ''}`} />
            Export
          </button>
          <button
            onClick={handleAddUser}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/25"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Pending Users Alert */}
      {pendingUsers > 0 && (
        <div className="mb-6">
          <Alert
            type="warning"
            title="Pending Approvals"
            message={`There are ${pendingUsers} user(s) waiting for approval.`}
            action={() => {/* Filter to pending */}}
            actionLabel="Review Now"
          />
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <p className="text-sm text-slate-400 mb-1">Total Users</p>
          <p className="text-2xl font-bold text-white">{totalUsers}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <p className="text-sm text-slate-400 mb-1">Active</p>
          <p className="text-2xl font-bold text-emerald-400">{activeUsers}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <p className="text-sm text-slate-400 mb-1">Organizers</p>
          <p className="text-2xl font-bold text-indigo-400">{organizers}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <p className="text-sm text-slate-400 mb-1">Pending</p>
          <p className="text-2xl font-bold text-amber-400">{pendingUsers}</p>
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <TableSkeleton rows={6} cols={7} />
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users yet"
          description="Start by adding your first organizer or staff member."
          action={handleAddUser}
          actionLabel="Add User"
        />
      ) : (
        <UserTable
          users={users}
          onView={handleEditUser}
          onEdit={handleEditUser}
          onDelete={handleDeleteClick}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Add/Edit User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative bg-slate-800 rounded-2xl border border-slate-700 p-6 max-w-md w-full shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                {selectedUser ? 'Edit User' : 'Add New User'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className={`w-full px-4 py-2.5 bg-slate-900/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                    formErrors.name ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="Enter full name"
                />
                {formErrors.name && (
                  <p className="mt-1 text-xs text-red-400">{formErrors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                      formErrors.email ? 'border-red-500' : 'border-slate-600'
                    }`}
                    placeholder="user@example.com"
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-xs text-red-400">{formErrors.email}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Role
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="organizer">Organizer</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {selectedUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete "${selectedUser?.name}"? This action cannot be undone.`}
        confirmLabel="Delete User"
        variant="danger"
      />

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="!bg-slate-800 !border !border-slate-700"
      />
    </AdminLayout>
  );
};

export default ManageUsers;
