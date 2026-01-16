import React, { useState } from 'react';
import { Mail, ArrowLeft, Tag, CheckCircle, AlertCircle } from 'react-feather';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Forgot Password Page
 * Email-based password reset (UI only, non-functional without backend)
 * Sky Blue/Violet color palette
 */

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      
      // Simulate API call (non-functional - no backend)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success state
      setIsSubmitted(true);
      toast.success('Reset instructions sent!');
    } catch (err) {
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Reset email resent!');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="#discover" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-violet-600 rounded-xl flex items-center justify-center">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
              EventHub
            </span>
          </a>
        </div>

        {/* Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
          {!isSubmitted ? (
            <>
              {/* Back Link */}
              <a
                href="#login"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </a>

              <h1 className="text-2xl font-bold text-white mb-2">
                Forgot Password?
              </h1>
              <p className="text-slate-400 mb-6">
                No worries! Enter your email address and we'll send you instructions to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 ${
                        error ? 'border-red-500' : 'border-slate-600'
                      }`}
                      placeholder="Enter your email address"
                    />
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-sky-500 to-violet-600 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-violet-700 transition-all shadow-lg shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Send Reset Instructions
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Remember your password?{' '}
                <a href="#login" className="text-sky-400 hover:text-sky-300">
                  Sign in
                </a>
              </p>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              
              <h2 className="text-xl font-bold text-white mb-2">
                Check Your Email
              </h2>
              <p className="text-slate-400 mb-6">
                We've sent password reset instructions to:
              </p>
              <p className="text-white font-medium bg-slate-900/50 py-2 px-4 rounded-lg mb-6 inline-block">
                {email}
              </p>
              
              <p className="text-sm text-slate-500 mb-6">
                Didn't receive the email? Check your spam folder or click below to resend.
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleResend}
                  disabled={isLoading}
                  className="w-full py-3 bg-slate-700 text-white font-medium rounded-xl hover:bg-slate-600 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                  ) : (
                    'Resend Email'
                  )}
                </button>
                
                <a
                  href="#login"
                  className="block w-full py-3 text-center text-slate-400 hover:text-white transition-colors"
                >
                  Back to Login
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Note */}
        <p className="text-center text-xs text-slate-600 mt-6">
          Note: This is a demo. Password reset emails are not actually sent.
        </p>
      </div>

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
    </div>
  );
};

export default ForgotPassword;
