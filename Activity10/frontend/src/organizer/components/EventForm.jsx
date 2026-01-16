import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Clock, Users, AlertCircle, Image, Upload, X, User } from 'react-feather';
import { Spinner, InlineFeedback } from './Feedback';

/**
 * Event Form Component
 * Create and edit event form with validation
 * Uses Emerald/Teal color palette
 */

const EventForm = ({ 
  initialEvent = null, 
  onSubmit, 
  onCancel,
  isSubmitting = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    endTime: '',
    location: '',
    address: '',
    capacity: '',
    category: '',
    coverImage: '',
    organizerName: '',
  });

  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Get today's date for min date validation
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Initialize form with existing event data
  useEffect(() => {
    if (initialEvent) {
      setFormData({
        name: initialEvent.name || '',
        description: initialEvent.description || '',
        date: initialEvent.date || '',
        time: initialEvent.time || '',
        endTime: initialEvent.endTime || '',
        location: initialEvent.location || '',
        address: initialEvent.address || '',
        capacity: initialEvent.capacity?.toString() || '',
        category: initialEvent.category || '',
        coverImage: initialEvent.imageUrl || initialEvent.coverImage || '',
        organizerName: initialEvent.organizerName || '',
      });
      if (initialEvent.imageUrl || initialEvent.coverImage) {
        setImagePreview(initialEvent.imageUrl || initialEvent.coverImage);
      }
    }
  }, [initialEvent]);

  // Validation rules
  const validate = (data) => {
    const newErrors = {};

    if (!data.name.trim()) {
      newErrors.name = 'Event name is required';
    } else if (data.name.length < 3) {
      newErrors.name = 'Event name must be at least 3 characters';
    } else if (data.name.length > 100) {
      newErrors.name = 'Event name must be less than 100 characters';
    }

    if (!data.date) {
      newErrors.date = 'Event date is required';
    } else {
      const eventDate = new Date(data.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today && !initialEvent) {
        newErrors.date = 'Event date cannot be in the past';
      }
    }

    if (!data.time) {
      newErrors.time = 'Start time is required';
    }

    if (data.endTime && data.time) {
      if (data.endTime <= data.time) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    if (!data.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!data.capacity) {
      newErrors.capacity = 'Capacity is required';
    } else {
      const cap = parseInt(data.capacity, 10);
      if (isNaN(cap) || cap < 1) {
        newErrors.capacity = 'Capacity must be at least 1';
      } else if (cap > 100000) {
        newErrors.capacity = 'Capacity cannot exceed 100,000';
      }
    }

    return newErrors;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handle blur for touched state
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate single field
    const fieldErrors = validate(formData);
    if (fieldErrors[name]) {
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, coverImage: 'Please select an image file' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, coverImage: 'Image must be less than 5MB' }));
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData(prev => ({ ...prev, coverImage: reader.result }));
      setErrors(prev => ({ ...prev, coverImage: null }));
    };
    reader.readAsDataURL(file);
  };

  // Handle image URL input
  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, coverImage: url }));
    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
    if (errors.coverImage) {
      setErrors(prev => ({ ...prev, coverImage: null }));
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, coverImage: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Prepare payload
    const payload = {
      ...formData,
      capacity: parseInt(formData.capacity, 10),
    };

    try {
      await onSubmit?.(payload);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to save event' });
    }
  };

  // Input field classes
  const getInputClasses = (fieldName) => {
    const base = `
      w-full px-4 py-2.5 rounded-lg border bg-slate-900/50 text-white
      placeholder-slate-500 transition-all duration-200
      focus:outline-none focus:ring-2
    `;
    
    if (touched[fieldName] && errors[fieldName]) {
      return `${base} border-red-500 focus:ring-red-500/50 focus:border-red-500`;
    }
    
    return `${base} border-slate-600 focus:ring-emerald-500/50 focus:border-emerald-500`;
  };

  const categories = [
    'Conference',
    'Workshop',
    'Networking',
    'Seminar',
    'Bootcamp',
    'Meetup',
    'Webinar',
    'Other',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Submit Error */}
      {errors.submit && (
        <InlineFeedback type="error" message={errors.submit} />
      )}

      {/* Event Name */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Event Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter event name"
          className={getInputClasses('name')}
          disabled={isSubmitting}
        />
        {touched.name && errors.name && (
          <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.name}
          </p>
        )}
      </div>

      {/* Organizer Name */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          <User className="w-4 h-4 inline mr-1" />
          Organized By
        </label>
        <input
          type="text"
          name="organizerName"
          value={formData.organizerName}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g., Tech Community, Your Company Name"
          className={getInputClasses('organizerName')}
          disabled={isSubmitting}
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          <Image className="w-4 h-4 inline mr-1" />
          Cover Image
        </label>
        
        {imagePreview ? (
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={imagePreview}
              alt="Event cover preview"
              className="w-full h-48 object-cover rounded-lg"
              onError={() => {
                setImagePreview(null);
                setErrors(prev => ({ ...prev, coverImage: 'Invalid image URL' }));
              }}
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Upload Button */}
            <div
              onClick={() => !isSubmitting && fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:border-emerald-500/50 hover:bg-slate-800/30 transition-colors"
            >
              <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm text-slate-400">
                Click to upload an image
              </p>
              <p className="text-xs text-slate-500 mt-1">
                PNG, JPG up to 5MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isSubmitting}
            />
            
            {/* Or use URL */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-700" />
              <span className="text-xs text-slate-500">or paste image URL</span>
              <div className="flex-1 h-px bg-slate-700" />
            </div>
            
            <input
              type="url"
              name="coverImageUrl"
              value={formData.coverImage}
              onChange={handleImageUrlChange}
              placeholder="https://example.com/image.jpg"
              className={getInputClasses('coverImage')}
              disabled={isSubmitting}
            />
          </div>
        )}
        
        {errors.coverImage && (
          <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.coverImage}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Describe your event..."
          rows={4}
          className={getInputClasses('description')}
          disabled={isSubmitting}
        />
      </div>

      {/* Date and Time Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Date <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            onBlur={handleBlur}
            min={!initialEvent ? getTodayDate() : undefined}
            className={getInputClasses('date')}
            disabled={isSubmitting}
          />
          {touched.date && errors.date && (
            <p className="mt-1.5 text-sm text-red-400">{errors.date}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Start Time <span className="text-red-400">*</span>
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getInputClasses('time')}
            disabled={isSubmitting}
          />
          {touched.time && errors.time && (
            <p className="mt-1.5 text-sm text-red-400">{errors.time}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            End Time
          </label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getInputClasses('endTime')}
            disabled={isSubmitting}
          />
          {touched.endTime && errors.endTime && (
            <p className="mt-1.5 text-sm text-red-400">{errors.endTime}</p>
          )}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          <MapPin className="w-4 h-4 inline mr-1" />
          Venue/Location <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g., Grand Convention Center, Hall A"
          className={getInputClasses('location')}
          disabled={isSubmitting}
        />
        {touched.location && errors.location && (
          <p className="mt-1.5 text-sm text-red-400">{errors.location}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Full Address
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Street address, city, postal code"
          className={getInputClasses('address')}
          disabled={isSubmitting}
        />
      </div>

      {/* Capacity and Category Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            <Users className="w-4 h-4 inline mr-1" />
            Capacity <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            placeholder="Maximum attendees"
            min="1"
            className={getInputClasses('capacity')}
            disabled={isSubmitting}
          />
          {touched.capacity && errors.capacity && (
            <p className="mt-1.5 text-sm text-red-400">{errors.capacity}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={getInputClasses('category')}
            disabled={isSubmitting}
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 pb-16 border-t border-slate-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-sm font-medium text-slate-400 bg-slate-700 rounded-lg hover:bg-slate-600 hover:text-white transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" className="text-white" />
              Saving...
            </>
          ) : (
            initialEvent ? 'Update Event' : 'Create Event'
          )}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
