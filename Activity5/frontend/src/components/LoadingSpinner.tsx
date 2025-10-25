import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex justify-center py-12">
            <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
        </div>
    );
};

export default LoadingSpinner;
