import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SearchInput from './SearchInput';
import Button from './Button';
import UserAvatar from './UserAvatar';

interface NavbarProps {
    searchQuery?: string;
    onSearchChange?: (value: string) => void;
    onCreatePost?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ searchQuery, onSearchChange, onCreatePost }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    return (
        <nav className="bg-[#121212] border-b border-gray-800 py-4 px-6 sticky top-0 z-40">
            <div className="container mx-auto flex justify-between items-center max-w-7xl">
                <h1
                    className="text-2xl font-bold text-primary cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    BlogName
                </h1>
                <div className="flex items-center gap-4">
                    {onSearchChange && (
                        <SearchInput
                            value={searchQuery || ''}
                            onChange={onSearchChange}
                        />
                    )}
                    {user ? (
                        <>
                            {onCreatePost && (
                                <Button
                                    onClick={onCreatePost}
                                    icon={
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    }
                                >
                                    New Post
                                </Button>
                            )}
                            <UserAvatar
                                name={user.name}
                                onLogout={handleLogout}
                                showDropdown={true}
                            />
                        </>
                    ) : (
                        <Button
                            onClick={() => navigate('/auth')}
                            icon={
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            }
                        >
                            Login
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
