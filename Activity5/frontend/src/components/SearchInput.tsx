import React from 'react';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    placeholder = 'Search posts...'
}) => {
    return (
        <div className="relative">
            <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                />
            </svg>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-[#1a1a1a] text-gray-300 pl-10 pr-4 py-2 rounded-lg border border-gray-800 focus:outline-none focus:border-primary w-64 transition-all"
            />
        </div>
    );
};

export default SearchInput;
