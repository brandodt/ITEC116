import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Tag, 
  CreditCard,
  Check,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  AlertTriangle
} from 'react-feather';
import { checkExistingRegistration } from '../services/attendeeService';

/**
 * Multi-Step Registration Form Component
 * Three-step registration flow with validation
 */

const RegistrationForm = ({ event, ticketTypes, onSubmit, onCancel, isSubmitting }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ticketType: ticketTypes?.[0]?.id || 'general',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  const steps = [
    { id: 1, name: 'Personal Info', icon: User },
    { id: 2, name: 'Ticket Selection', icon: Tag },
    { id: 3, name: 'Confirmation', icon: Check },
  ];

  // Check for duplicate registration when email changes
  useEffect(() => {
    const checkDuplicate = async () => {
      if (formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && event?.id) {
        setIsCheckingDuplicate(true);
        try {
          const existing = await checkExistingRegistration(event.id, formData.email);
          if (existing) {
            setDuplicateWarning(`This email is already registered for this event (Ticket: ${existing.id})`);
          } else {
            setDuplicateWarning(null);
          }
        } catch (error) {
          console.error('Error checking duplicate:', error);
        } finally {
          setIsCheckingDuplicate(false);
        }
      } else {
        setDuplicateWarning(null);
      }
    };

    // Debounce the check
    const timeoutId = setTimeout(checkDuplicate, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.email, event?.id]);

  const validateStep = async (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      if (formData.phone && !/^[\d\s+()-]*$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
      
      // Check for duplicate registration
      if (!newErrors.email && duplicateWarning) {
        newErrors.email = 'You are already registered for this event';
      }
    }

    if (step === 2) {
      if (!formData.ticketType) {
        newErrors.ticketType = 'Please select a ticket type';
      }
    }

    if (step === 3) {
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (await validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (await validateStep(3)) {
      const selectedTicket = ticketTypes?.find(t => t.id === formData.ticketType);
      onSubmit({
        ...formData,
        ticketType: selectedTicket?.name || 'General Admission',
        ticketPrice: selectedTicket?.price || 0,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const selectedTicket = ticketTypes?.find(t => t.id === formData.ticketType);

  return (
    <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
      {/* Progress Steps */}
      <div className="px-6 py-4 bg-slate-800 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isActive
                      ? 'bg-gradient-to-r from-sky-500 to-violet-600 text-white'
                      : 'bg-slate-700 text-slate-400'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`hidden sm:block text-sm font-medium ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 sm:mx-4 ${
                    currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-700'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-semibold text-white mb-4">
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 ${
                      errors.firstName ? 'border-red-500' : 'border-slate-600'
                    }`}
                    placeholder="Juan"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Last Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 ${
                      errors.lastName ? 'border-red-500' : 'border-slate-600'
                    }`}
                    placeholder="Dela Cruz"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 ${
                    errors.email ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="juan@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
              {!errors.email && duplicateWarning && (
                <div className="mt-2 p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg">
                  <p className="text-xs text-amber-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{duplicateWarning}. <a href="#my-tickets" className="underline hover:text-amber-300">View your tickets</a></span>
                  </p>
                </div>
              )}
              {isCheckingDuplicate && (
                <p className="mt-1 text-xs text-slate-400 flex items-center gap-1">
                  <span className="w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin" />
                  Checking registration...
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9+\s\-]*"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    // Allow only numbers, +, space, hyphen, and control keys
                    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
                    const isNumber = /[0-9]/.test(e.key);
                    const isAllowedChar = ['+', '-', ' '].includes(e.key);
                    if (!isNumber && !isAllowedChar && !allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
                      e.preventDefault();
                    }
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 ${
                    errors.phone ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="+63 912 345 6789"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.phone}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Ticket Selection */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-semibold text-white mb-4">
              Select Your Ticket
            </h3>

            <div className="space-y-3">
              {ticketTypes?.map((ticket) => {
                const isSelected = formData.ticketType === ticket.id;
                const isAvailable = ticket.available > 0;

                return (
                  <label
                    key={ticket.id}
                    className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      !isAvailable
                        ? 'opacity-50 cursor-not-allowed border-slate-700 bg-slate-800/30'
                        : isSelected
                        ? 'border-sky-500 bg-sky-500/10'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="ticketType"
                      value={ticket.id}
                      checked={isSelected}
                      onChange={handleChange}
                      disabled={!isAvailable}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? 'border-sky-500 bg-sky-500'
                            : 'border-slate-500'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div>
                          <p className="font-medium text-white">{ticket.name}</p>
                          <p className="text-sm text-slate-400">
                            {isAvailable ? `${ticket.available} available` : 'Sold out'}
                          </p>
                        </div>
                      </div>
                      <p className={`text-lg font-bold ${
                        ticket.price === 0 ? 'text-emerald-400' : 'text-white'
                      }`}>
                        {ticket.price === 0 ? 'Free' : `₱${ticket.price.toLocaleString()}`}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>

            {errors.ticketType && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.ticketType}
              </p>
            )}
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-semibold text-white mb-4">
              Confirm Your Registration
            </h3>

            {/* Order Summary */}
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 space-y-3">
              <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                Order Summary
              </h4>
              
              <div className="flex justify-between items-start py-2 border-b border-slate-700/50">
                <div>
                  <p className="font-medium text-white">{event?.name}</p>
                  <p className="text-sm text-slate-400">{selectedTicket?.name}</p>
                </div>
                <p className="font-bold text-white">
                  {selectedTicket?.price === 0 ? 'Free' : `₱${selectedTicket?.price?.toLocaleString()}`}
                </p>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Attendee</span>
                  <span className="text-white">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email</span>
                  <span className="text-white">{formData.email}</span>
                </div>
                {formData.phone && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phone</span>
                    <span className="text-white">{formData.phone}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-700/50">
                <span className="text-lg font-semibold text-white">Total</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
                  {selectedTicket?.price === 0 ? 'Free' : `₱${selectedTicket?.price?.toLocaleString()}`}
                </span>
              </div>
            </div>

            {/* Terms Agreement */}
            <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
              errors.agreeToTerms
                ? 'border-red-500 bg-red-500/10'
                : formData.agreeToTerms
                ? 'border-sky-500/50 bg-sky-500/5'
                : 'border-slate-700 hover:border-slate-600'
            }`}>
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mt-0.5 w-5 h-5 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500/50"
              />
              <span className="text-sm text-slate-300">
                I agree to the <a href="#" className="text-sky-400 hover:underline">Terms of Service</a> and <a href="#" className="text-sky-400 hover:underline">Privacy Policy</a>. I understand that my ticket is non-transferable and the refund policy applies.
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.agreeToTerms}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="px-6 py-4 bg-slate-800 border-t border-slate-700/50 flex items-center justify-between">
        <button
          onClick={currentStep === 1 ? onCancel : handleBack}
          className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {currentStep === 1 ? 'Cancel' : 'Back'}
        </button>

        {currentStep < 3 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-sky-500 to-violet-600 text-white font-medium rounded-lg hover:from-sky-600 hover:to-violet-700 transition-all shadow-lg shadow-sky-500/25"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-sky-500 to-violet-600 text-white font-medium rounded-lg hover:from-sky-600 hover:to-violet-700 transition-all shadow-lg shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Complete Registration
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default RegistrationForm;
