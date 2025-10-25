import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { gsap } from 'gsap';

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const { login, register, loading, error, clearError } = useAuth();

    useEffect(() => {
        clearError();
        setLocalError('');
    }, [email, password, name, confirmPassword, clearError]);

    useEffect(() => {
        gsap.fromTo(
            '.auth-title',
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
        );
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLogin) {
            if (password !== confirmPassword) {
                setLocalError('Passwords do not match');
                return;
            }
            if (password.length < 6) {
                setLocalError('Password must be at least 6 characters long');
                return;
            }
        }

        try {
            if (isLogin) {
                await login({ email, password });
            } else {
                await register({ name, email, password });
            }
        } catch (err) {
            // Error handled by context
        }
    };

    const displayError = localError || error;

    return (
        <div className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-md mx-auto">
                <header className="text-center mb-8">
                    <h1 className="auth-title page-title">BlogName</h1>
                    <p className="text-light mt-4">
                        {isLogin
                            ? 'Welcome back! Sign in to continue.'
                            : 'Create an account to start blogging.'
                        }
                    </p>
                </header>

                <div className="card">
                    <h2 className="text-2xl font-semibold mb-6 text-center" style={{ color: "var(--color-primary)" }}>
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </h2>

                    {displayError && (
                        <div className="mb-4 p-3 rounded-lg bg-red-900/30 border-l-4 border-red-600">
                            <p className="text-sm text-light">{displayError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your full name"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                disabled={loading}
                            />
                        </div>

                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <button
                                type="submit"
                                className="primary-button w-full"
                                disabled={loading}
                            >
                                {loading ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Sign In' : 'Create Account')}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-light">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-primary hover:underline"
                                disabled={loading}
                            >
                                {isLogin ? 'Create Account' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
