import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { gsap } from 'gsap';

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        // Page title animation
        gsap.fromTo(
            '.auth-title',
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
        );

        gsap.fromTo(
            '.auth-subtitle',
            { opacity: 0 },
            { opacity: 1, duration: 1, delay: 0.5, ease: 'power2.out' }
        );
    }, []);

    return (
        <div className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-md mx-auto">
                <header className="text-center mb-8">
                    <h1 className="auth-title page-title">Personal Notes</h1>
                    <p className="auth-subtitle text-light mt-4">
                        {isLogin
                            ? 'Welcome back! Sign in to access your notes.'
                            : 'Create an account to start organizing your thoughts.'
                        }
                    </p>
                </header>

                {isLogin ? (
                    <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
                ) : (
                    <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
                )}

                <footer className="mt-8 text-center text-sm text-light">
                    <p>© {new Date().getFullYear()} Personal Notes. Keep your thoughts secure.</p>
                </footer>
            </div>
        </div>
    );
};

export default AuthPage;