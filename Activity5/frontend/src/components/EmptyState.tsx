import React from 'react';

interface EmptyStateProps {
    message: string;
    icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, icon }) => {
    return (
        <div className="text-center text-gray-400 py-12">
            {icon && <div className="mb-4 flex justify-center">{icon}</div>}
            <p className="text-xl">{message}</p>
        </div>
    );
};

export default EmptyState;
