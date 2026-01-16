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
    standardPrice: '',
    vipPrice: '',
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

  // Helper to convert date to YYYY-MM-DD format for HTML date input
  const formatDateForInput = (dateValue) => {
    if (!dateValue) return '';
    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return dateValue;
    }
    // Parse and convert to YYYY-MM-DD
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return '';
    }
  };

  // Initialize form with existing event data
  useEffect(() => {
    if (initialEvent) {
      // Get prices from ticketPrices object
      let standardPrice = '';
      let vipPrice = '';
      
      if (initialEvent.ticketPrices && typeof initialEvent.ticketPrices === 'object') {
        if (initialEvent.ticketPrices['Standard'] !== undefined) {
          standardPrice = initialEvent.ticketPrices['Standard'].toString();
        }
        if (initialEvent.ticketPrices['VIP'] !== undefined) {
          vipPrice = initialEvent.ticketPrices['VIP'].toString();
        }
      }
      
      // Fallback to old price field for backward compatibility
      if (!standardPrice && initialEvent.price !== undefined && initialEvent.price !== null) {
        standardPrice = initialEvent.price.toString();
      }

      setFormData({
        name: initialEvent.name || '',
        description: initialEvent.description || '',
        date: formatDateForInput(initialEvent.date),
        time: initialEvent.time || '',
        endTime: initialEvent.endTime || '',
        location: initialEvent.location || '',
        address: initialEvent.address || '',
        capacity: initialEvent.capacity?.toString() || '',
        category: initialEvent.category || '',
        coverImage: initialEvent.imageUrl || initialEvent.coverImage || '',
        organizerName: initialEvent.organizerName || '',
        standardPrice: standardPrice,
        vipPrice: vipPrice,
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

    // Validate Standard ticket price (required)
    if (data.standardPrice === '' || data.standardPrice === undefined) {
      newErrors.standardPrice = 'Standard ticket price is required';
    } else {
      const standardPriceNum = parseFloat(data.standardPrice);
      if (isNaN(standardPriceNum) || standardPriceNum < 0) {
        newErrors.standardPrice = 'Price must be 0 or greater';
      }
    }

    // Validate VIP ticket price (optional, but must be valid if provided)
    if (data.vipPrice !== '' && data.vipPrice !== undefined) {
      const vipPriceNum = parseFloat(data.vipPrice);
      if (isNaN(vipPriceNum) || vipPriceNum < 0) {
        newErrors.vipPrice = 'Price must be 0 or greater';
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

    // Prepare payload - remove organizerName as backend sets it from the logged-in user
    const { organizerName, standardPrice, vipPrice, ...eventData } = formData;
    const standardPriceValue = standardPrice !== '' ? parseFloat(standardPrice) : 0;
    const vipPriceValue = vipPrice !== '' ? parseFloat(vipPrice) : null;
    
    // Build ticket types and prices
    const ticketTypes = ['Standard'];
    const ticketPrices = { 'Standard': standardPriceValue };
    
    // Only add VIP if price is provided
    if (vipPriceValue !== null && vipPrice !== '') {
      ticketTypes.unshift('VIP'); // VIP first
      ticketPrices['VIP'] = vipPriceValue;
    }
    
    const payload = {
      ...eventData,
      capacity: parseInt(formData.capacity, 10),
      imageUrl: formData.coverImage || undefined,
      // Store minimum price for display and full ticketPrices for registration
      price: standardPriceValue,
      ticketPrices,
      ticketTypes,
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

      {/* Capacity, Price, and Category Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

        {/* Ticket Prices Section */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Ticket Types & Pricing
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Standard Ticket Price (Required) */}
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Standard Price <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₱</span>
                <input
                  type="number"
                  inputMode="decimal"
                  name="standardPrice"
                  value={formData.standardPrice}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={(e) => {
                    if (['e', 'E', '+', '-'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="0 for free"
                  min="0"
                  step="0.01"
                  className={`${getInputClasses('standardPrice')} pl-8`}
                  disabled={isSubmitting}
                />
              </div>
              {touched.standardPrice && errors.standardPrice && (
                <p className="mt-1.5 text-sm text-red-400">{errors.standardPrice}</p>
              )}
              <p className="mt-1 text-xs text-slate-500">Required - Enter 0 for free events</p>
            </div>

            {/* VIP Ticket Price (Optional) */}
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                VIP Price <span className="text-slate-500">(Optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₱</span>
                <input
                  type="number"
                  inputMode="decimal"
                  name="vipPrice"
                  value={formData.vipPrice}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={(e) => {
                    if (['e', 'E', '+', '-'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Leave empty if no VIP"
                  min="0"
                  step="0.01"
                  className={`${getInputClasses('vipPrice')} pl-8`}
                  disabled={isSubmitting}
                />
              </div>
              {touched.vipPrice && errors.vipPrice && (
                <p className="mt-1.5 text-sm text-red-400">{errors.vipPrice}</p>
              )}
              <p className="mt-1 text-xs text-slate-500">Optional - Leave empty for no VIP tickets</p>
            </div>
          </div>
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
