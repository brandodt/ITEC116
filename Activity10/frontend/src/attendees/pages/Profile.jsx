import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Edit2, 
  Save, 
  Camera,
  Lock,
  Bell,
  LogOut,
  Tag,
  AlertCircle
} from 'react-feather';
import AttendeeLayout from '../components/AttendeeLayout';
import { ConfirmModal } from '../../shared';
import { useAttendeeAuth } from '../contexts/AttendeeAuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Profile Page for Attendees
 * View and edit profile, change password, manage preferences
 * Sky Blue/Violet color palette
 */

const Profile = () => {
  const { user, updateProfile, logout } = useAttendeeAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Profile form state
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');

  // Notification preferences
  const [notifications, setNotifications] = useState({
    eventReminders: true,
    ticketUpdates: true,
    promotions: false,
    newsletter: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    if (passwordError) setPasswordError('');
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update context (if updateProfile exists)
      if (updateProfile) {
        updateProfile(formData);
      }
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!passwordForm.currentPassword) {
      setPasswordError('Current password is required');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error('Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Notification preferences saved!');
    } catch (err) {
      toast.error('Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    logout();
    window.location.hash = 'discover';
  };

  const inputClasses = "w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500";
  const disabledInputClasses = "w-full px-4 py-2.5 bg-slate-800/30 border border-slate-700 rounded-lg text-slate-400 cursor-not-allowed";

  return (
    <AttendeeLayout activePage="profile">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-slate-400">Manage your account settings and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden mb-6">
          {/* Profile Header */}
          <div className="relative h-32 bg-gradient-to-r from-sky-600 to-violet-600">
            <div className="absolute -bottom-12 left-6">
              <div className="relative">
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=0ea5e9&color=fff&size=96`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-slate-800 object-cover"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-2 bg-sky-600 rounded-full text-white hover:bg-sky-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="pt-16 px-6 pb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {formData.firstName} {formData.lastName}
                </h2>
                <p className="text-slate-400">{formData.email}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-600/20 text-sky-400 rounded-lg hover:bg-sky-600/30 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save
                  </button>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b border-slate-700 -mx-6 px-6">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'security', label: 'Security', icon: Lock },
                { id: 'notifications', label: 'Notifications', icon: Bell },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-sky-500 text-sky-400'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`${isEditing ? inputClasses : disabledInputClasses} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`${isEditing ? inputClasses : disabledInputClasses} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`${isEditing ? inputClasses : disabledInputClasses} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder={isEditing ? "Enter phone number" : "Not set"}
                      className={`${isEditing ? inputClasses : disabledInputClasses} pl-10`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="max-w-md">
                <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
                
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className={inputClasses}
                      placeholder="Enter current password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className={inputClasses}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className={inputClasses}
                      placeholder="Confirm new password"
                    />
                  </div>

                  {passwordError && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {passwordError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                    Change Password
                  </button>
                </form>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Email Notifications</h3>
                
                <div className="space-y-4 mb-6">
                  {[
                    { key: 'eventReminders', label: 'Event Reminders', desc: 'Get notified before events you registered for' },
                    { key: 'ticketUpdates', label: 'Ticket Updates', desc: 'Receive updates about your tickets and check-ins' },
                    { key: 'promotions', label: 'Promotions', desc: 'Get notified about special offers and discounts' },
                    { key: 'newsletter', label: 'Newsletter', desc: 'Receive our weekly newsletter with event recommendations' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-sm text-slate-400">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          notifications[item.key] ? 'bg-sky-600' : 'bg-slate-600'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            notifications[item.key] ? 'left-7' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSaveNotifications}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Preferences
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-red-500/30 p-6">
          <p className="text-sm text-slate-400 mb-4">
            Once you log out, you'll need to sign in again to access your tickets.
          </p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Sign Out?"
        message="Are you sure you want to sign out? You'll need to log in again to access your tickets."
        confirmText="Sign Out"
        cancelText="Cancel"
        type="logout"
        theme="sky"
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
    </AttendeeLayout>
  );
};

export default Profile;
