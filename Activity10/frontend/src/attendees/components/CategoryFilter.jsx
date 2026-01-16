import React from 'react';

/**
 * Category Filter Component
 * Horizontal scrollable category pills for filtering events
 */

const CategoryFilter = ({ categories, selectedCategory, onSelect }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {/* All Category */}
      <button
        onClick={() => onSelect('all')}
        className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
          selectedCategory === 'all'
            ? 'bg-gradient-to-r from-sky-500 to-violet-600 text-white shadow-lg shadow-sky-500/25'
            : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
        }`}
      >
        <span>All Events</span>
      </button>

      {categories?.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === category.id
              ? 'bg-gradient-to-r from-sky-500 to-violet-600 text-white shadow-lg shadow-sky-500/25'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
