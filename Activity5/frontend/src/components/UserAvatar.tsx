import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface UserAvatarProps {
    name: string;
    size?: 'sm' | 'md' | 'lg';
    onLogout?: () => void;
    showDropdown?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ name, size = 'md', onLogout, showDropdown = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const sizes = {
        sm: 'w-6 h-6 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base'
    };

    const initial = name?.[0]?.toUpperCase() || 'U';

    useEffect(() => {
        if (isOpen && dropdownRef.current) {
            gsap.fromTo(
                dropdownRef.current,
                { opacity: 0, y: -10, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: 'power2.out' }
            );
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleLogout = () => {
        setIsOpen(false);
        onLogout?.();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className={`${sizes[size]} bg-primary rounded-full flex items-center justify-center flex-shrink-0 ${showDropdown ? 'cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all' : ''}`}
                onClick={() => showDropdown && setIsOpen(!isOpen)}
            >
                <span className="text-white font-semibold">
                    {initial}
                </span>
            </div>

            {showDropdown && isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded-lg shadow-xl border border-gray-800 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-800">
                        <p className="text-sm font-semibold text-gray-200 truncate" title={name}>
                            {name}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                        </svg>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserAvatar;
