import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle, Loader, AlertCircle, Calendar, RefreshCw } from 'react-feather';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { mockOrganizers } from '../../shared/data/mockData';

/**
 * Organizer Forgot Password Page
 * Password reset request for organizers
 * Emerald/Teal color palette
 */

// Get valid organizer emails from shared data
const validOrganizerEmails = mockOrganizers.map(o => o.email.toLowerCase());

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Validate email format
  const isValidEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if email exists using shared data
      if (validOrganizerEmails.includes(email.toLowerCase())) {
        setIsSuccess(true);
        toast.success('Password reset instructions sent!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        // Still show success for security (don't reveal if email exists)
        setIsSuccess(true);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend
  const handleResend = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Reset link sent again!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <ToastContainer theme="dark" />
      
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 lg:px-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">EventHub</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Reset Your Password
          </h1>
          <p className="text-lg text-emerald-100 mb-10 leading-relaxed">
            Don't worry, it happens to the best of us. We'll help you 
            get back into your organizer account in no time.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/90">
              <CheckCircle className="w-5 h-5 text-emerald-300" />
              <span>Enter your registered email</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <CheckCircle className="w-5 h-5 text-emerald-300" />
              <span>Check your inbox for reset link</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <CheckCircle className="w-5 h-5 text-emerald-300" />
              <span>Create a new secure password</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">EventHub Organizer</span>
          </div>

          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-8">
            {!isSuccess ? (
              <>
                {/* Form Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
                  <p className="text-slate-400">
                    Enter your email address and we'll send you instructions to reset your password.
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-3 p-4 mb-6 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError('');
                        }}
                        placeholder="organizer@example.com"
                        className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Reset Link
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success State */
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/25">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Check Your Email</h2>
                <p className="text-slate-400 mb-2">
                  We've sent password reset instructions to:
                </p>
                <p className="text-emerald-400 font-medium mb-6">{email}</p>
                <p className="text-sm text-slate-500 mb-8">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                
                <button
                  onClick={handleResend}
                  disabled={isLoading}
                  className="w-full py-3 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5" />
                      Resend Email
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <a 
                href="#organizer-login"
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </a>
            </div>
          </div>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <p className="text-xs text-emerald-400 font-medium mb-2">Demo Note:</p>
            <p className="text-xs text-slate-400">
              Valid organizer emails: {mockOrganizers.map((o, i) => (
                <span key={o.id}>
                  <span className="text-white font-mono">{o.email}</span>
                  {i < mockOrganizers.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
