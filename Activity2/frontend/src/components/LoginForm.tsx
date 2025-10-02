import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { gsap } from 'gsap';

interface LoginFormProps {
    onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error, clearError } = useAuth();

    useEffect(() => {
        // Clear error when component mounts or form data changes
        clearError();
    }, [email, password, clearError]);

    useEffect(() => {
        // Animation when component mounts
        gsap.fromTo(
            '.login-form',
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
        );
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password });
        } catch (err) {
            // Error is handled by the auth context
        }
    };

    return (
        <div className="login-form card max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center" style={{ color: "var(--color-primary)" }}>
                Sign In to Notes
            </h2>

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-900/30 border-l-4 border-red-600">
                    <p className="text-sm text-light">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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

                <div className="form-group">
                    <button
                        type="submit"
                        className="primary-button w-full"
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </div>
            </form>            <div className="mt-6 text-center">
                <p className="text-light">
                    Don't have an account?{' '}
                    <button
                        onClick={onSwitchToRegister}
                        className="text-primary hover:underline"
                        disabled={loading}
                    >
                        Create Account
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;