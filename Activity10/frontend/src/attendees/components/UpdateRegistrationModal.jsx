import React, { useState, useEffect } from 'react';
import { X, Edit3, User, Mail, Phone, Tag, Check, AlertCircle, Loader } from 'react-feather';

// Simple Spinner component
const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };
  
  return (
    <Loader className={`animate-spin ${sizes[size]} ${className}`} />
  );
};

/**
 * Update Registration Modal
 * Allows attendees to update their registration details
 * Sky Blue/Violet color palette
 */

const UpdateRegistrationModal = ({ ticket, isOpen, onClose, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    attendeeName: '',
    attendeeEmail: '',
    phone: ''
  });

  // Populate form when ticket changes
  useEffect(() => {
    if (ticket) {
      setFormData({
        attendeeName: ticket.attendeeName || '',
        attendeeEmail: ticket.attendeeEmail || '',
        phone: ticket.phone || ''
      });
      setError('');
      setSuccess(false);
    }
  }, [ticket]);

  // Handle close with animation
  const handleClose = () => {
    setError('');
    setSuccess(false);
    onClose();
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Basic validation
    if (!formData.attendeeName.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.attendeeEmail.trim()) {
      setError('Email is required');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.attendeeEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      await onUpdate(ticket.id, formData);
      setSuccess(true);
      
      // Close after brief success message
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update registration');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-violet-600 rounded-lg flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Update Registration</h2>
              <p className="text-sm text-slate-400">{ticket?.eventName}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-3 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
              <Check className="w-5 h-5 text-emerald-400" />
              <p className="text-emerald-400 font-medium">Registration updated successfully!</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Full Name *
            </label>
            <input
              type="text"
              name="attendeeName"
              value={formData.attendeeName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500"
              disabled={isLoading || success}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address *
            </label>
            <input
              type="email"
              name="attendeeEmail"
              value={formData.attendeeEmail}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500"
              disabled={isLoading || success}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number (optional)"
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500"
              disabled={isLoading || success}
            />
          </div>

          {/* Ticket Type (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Ticket Type
            </label>
            <div className="w-full px-4 py-3 bg-slate-900/30 border border-slate-700 rounded-lg text-slate-300 flex items-center justify-between">
              <span>{ticket?.ticketType || 'General Admission'}</span>
              <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded">Cannot be changed</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
            <button
              type="submit"
              disabled={isLoading || success}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-violet-600 text-white font-medium rounded-lg hover:from-sky-600 hover:to-violet-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-500/25"
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" className="text-white" />
                  Updating...
                </>
              ) : success ? (
                <>
                  <Check className="w-5 h-5" />
                  Updated!
                </>
              ) : (
                <>
                  <Edit3 className="w-5 h-5" />
                  Update Registration
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-6 py-3 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Info Note */}
        <div className="px-6 pb-6">
          <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-lg">
            <p className="text-xs text-slate-400">
              <strong className="text-sky-400">Note:</strong> Changes to your registration will be reflected immediately. 
              Your QR code will remain the same.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateRegistrationModal;
