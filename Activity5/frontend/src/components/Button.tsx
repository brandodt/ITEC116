import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    icon,
    children,
    className = '',
    ...props
}) => {
    const baseStyles = 'rounded-lg transition-all font-medium flex items-center justify-center gap-2';

    const variants = {
        primary: 'bg-primary hover:bg-opacity-90 text-white',
        secondary: 'bg-gray-800 hover:bg-gray-700 text-gray-200',
        ghost: 'hover:bg-primary/10 text-primary border border-transparent hover:border-primary/20'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {icon}
            {children}
        </button>
    );
};

export default Button;
