import React, { useState, useEffect, useCallback } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Tag, ArrowRight, CheckCircle, XCircle, AlertCircle } from 'react-feather';
import { useAttendeeAuth } from '../contexts/AttendeeAuthContext';
import { checkEmailExists } from '../../shared/services/authService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Login/Register Page
 * Authentication page for attendees with real-time validation
 */

const Login = ({ mode = 'login' }) => {
  const { login, register } = useAttendeeAuth();
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  
  // Real-time email validation state
  const [emailStatus, setEmailStatus] = useState({ checking: false, exists: null, isActive: null });
  const [passwordStrength, setPasswordStrength] = useState({ valid: false, errors: [] });

  // Debounced email check
  useEffect(() => {
    const checkEmail = async () => {
      const email = formData.email.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setEmailStatus({ checking: false, exists: null, isActive: null });
        return;
      }

      setEmailStatus({ checking: true, exists: null, isActive: null });
      try {
        const result = await checkEmailExists(email);
        setEmailStatus({ checking: false, exists: result.exists, isActive: result.isActive });
      } catch {
        setEmailStatus({ checking: false, exists: null, isActive: null });
      }
    };

    const timeoutId = setTimeout(checkEmail, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.email]);

  // Real-time password validation
  useEffect(() => {
    const password = formData.password;
    if (!password) {
      setPasswordStrength({ valid: false, errors: [] });
      return;
    }
    const errors = [];
    if (password.length < 8) errors.push('8+ chars');
    if (!/[A-Z]/.test(password)) errors.push('uppercase');
    if (!/[a-z]/.test(password)) errors.push('lowercase');
    if (!/[0-9]/.test(password)) errors.push('number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('special char');
    setPasswordStrength({ valid: errors.length === 0, errors });
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Password validation helper
  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('One number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('One special character');
    return errors;
  };

  const validate = () => {
    const newErrors = {};

    if (!isLogin) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      // Check if email already exists for registration
      if (emailStatus.exists) {
        newErrors.email = 'This email is already registered. Please login instead.';
      }
    } else {
      // Check if email doesn't exist for login
      if (emailStatus.exists === false) {
        newErrors.email = 'No account found with this email. Please register.';
      }
      if (emailStatus.exists && emailStatus.isActive === false) {
        newErrors.email = 'This account is disabled. Please contact support.';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isLogin) {
      // Strong password validation for registration
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        newErrors.password = `Password must have: ${passwordErrors.join(', ')}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsLoading(true);

      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Welcome back!');
      } else {
        await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        });
        toast.success('Account created successfully!');
      }

      // Redirect to discover page
      setTimeout(() => {
        window.location.hash = 'discover';
      }, 500);
    } catch (error) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
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

        {/* Form Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-slate-400 text-center mb-6">
            {isLogin
              ? 'Sign in to access your tickets'
              : 'Join us to discover amazing events'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields (Register only) */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    First Name
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
                    <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Last Name
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
                    <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>
                  )}
                </div>
              </div>
            )}

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
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2.5 bg-slate-900/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 ${
                    errors.email ? 'border-red-500' : 
                    emailStatus.checking ? 'border-slate-600' :
                    emailStatus.exists === null ? 'border-slate-600' :
                    (isLogin ? (emailStatus.exists ? 'border-emerald-500' : 'border-red-500') : 
                              (emailStatus.exists ? 'border-red-500' : 'border-emerald-500'))
                  }`}
                  placeholder="juan@email.com"
                />
                {/* Email status indicator */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {emailStatus.checking && (
                    <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin block" />
                  )}
                  {!emailStatus.checking && emailStatus.exists !== null && formData.email && (
                    isLogin ? (
                      emailStatus.exists ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )
                    ) : (
                      emailStatus.exists ? (
                        <XCircle className="w-4 h-4 text-red-400" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      )
                    )
                  )}
                </div>
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
              {/* Real-time email status messages */}
              {!errors.email && !emailStatus.checking && emailStatus.exists !== null && formData.email && (
                <p className={`mt-1 text-xs flex items-center gap-1 ${
                  isLogin 
                    ? (emailStatus.exists ? 'text-emerald-400' : 'text-amber-400')
                    : (emailStatus.exists ? 'text-amber-400' : 'text-emerald-400')
                }`}>
                  {isLogin ? (
                    emailStatus.exists ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Account found
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        No account with this email. <button type="button" onClick={() => setIsLogin(false)} className="underline hover:text-amber-300">Register instead?</button>
                      </>
                    )
                  ) : (
                    emailStatus.exists ? (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        Email already registered. <button type="button" onClick={() => setIsLogin(true)} className="underline hover:text-amber-300">Login instead?</button>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Email available
                      </>
                    )
                  )}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-2.5 bg-slate-900/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 ${
                    errors.password ? 'border-red-500' : 
                    (!isLogin && formData.password) ? (passwordStrength.valid ? 'border-emerald-500' : 'border-amber-500') : 
                    'border-slate-600'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
              {/* Password strength indicator for registration */}
              {!isLogin && formData.password && !errors.password && (
                <div className="mt-2">
                  {/* Strength bar */}
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i <= (5 - passwordStrength.errors.length)
                            ? passwordStrength.valid
                              ? 'bg-emerald-500'
                              : passwordStrength.errors.length <= 2
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                            : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs flex items-center gap-1 ${
                    passwordStrength.valid ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {passwordStrength.valid ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Strong password
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        Missing: {passwordStrength.errors.join(', ')}
                      </>
                    )}
                  </p>
                </div>
              )}
              {!isLogin && !formData.password && (
                <p className="mt-1 text-xs text-slate-500">
                  Min 8 chars, uppercase, lowercase, number & special character
                </p>
              )}
            </div>

            {/* Confirm Password (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-slate-600'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Forgot Password (Login only) */}
            {isLogin && (
              <div className="text-right">
                <a href="#forgot-password" className="text-sm text-sky-400 hover:text-sky-300">
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-sky-500 to-violet-600 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-violet-700 transition-all shadow-lg shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-slate-400">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-sky-400 hover:text-sky-300 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Continue as Guest */}
          <div className="mt-4 text-center">
            <a
              href="#discover"
              className="text-sm text-slate-500 hover:text-slate-400"
            >
              Continue browsing as guest
            </a>
          </div>
        </div>
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

export default Login;
