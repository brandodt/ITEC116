import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { gsap } from 'gsap';

interface RegisterFormProps {
    onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const { register, loading, error, clearError } = useAuth();

    useEffect(() => {
        // Clear errors when component mounts or form data changes
        clearError();
        setLocalError('');
    }, [name, email, password, confirmPassword, clearError]);

    useEffect(() => {
        // Animation when component mounts
        gsap.fromTo(
            '.register-form',
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
        );
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate passwords match
        if (password !== confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setLocalError('Password must be at least 6 characters long');
            return;
        }

        try {
            await register({ name, email, password });
        } catch (err) {
            // Error is handled by the auth context
        }
    };

    const displayError = localError || error;

    return (
        <div className="register-form card max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center" style={{ color: "var(--color-primary)" }}>
                Create Account
            </h2>

            {displayError && (
                <div className="mb-4 p-3 rounded-lg bg-red-900/30 border-l-4 border-red-600">
                    <p className="text-sm text-light">{displayError}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                        placeholder="Enter your password (min 6 characters)"
                        required
                        disabled={loading}
                    />
                </div>

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

                <div className="form-group">
                    <button
                        type="submit"
                        className="primary-button w-full"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </div>
            </form>            <div className="mt-6 text-center">
                <p className="text-light">
                    Already have an account?{' '}
                    <button
                        onClick={onSwitchToLogin}
                        className="text-primary hover:underline"
                        disabled={loading}
                    >
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterForm;