import React, { useState, useEffect, useCallback } from 'react';
import { Search, Calendar, Filter, TrendingUp } from 'react-feather';
import AttendeeLayout from '../components/AttendeeLayout';
import EventCard from '../components/EventCard';
import CategoryFilter from '../components/CategoryFilter';
import { EventGridSkeleton, CategoryFilterSkeleton } from '../components/LoadingSkeleton';
import { fetchPublicEvents, fetchCategories } from '../services/attendeeService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Event Discovery Page
 * Public page for browsing and discovering events
 * Sky Blue/Violet color palette
 */

const EventDiscovery = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Initial page load
  const [isSearching, setIsSearching] = useState(false); // For search/filter updates
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load categories once on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    loadCategories();
  }, []);

  // Load events when filters change
  const loadEvents = useCallback(async (showFullLoader = false) => {
    try {
      if (showFullLoader) {
        setIsLoading(true);
      } else {
        setIsSearching(true);
      }
      const eventsData = await fetchPublicEvents({
        category: selectedCategory,
        dateRange: selectedDateRange,
        search: debouncedSearch,
      });
      setEvents(eventsData);
    } catch (error) {
      toast.error('Failed to load events');
      console.error('Load error:', error);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, [selectedCategory, selectedDateRange, debouncedSearch]);

  // Initial load
  useEffect(() => {
    loadEvents(true);
  }, []);

  // Reload events when filters change (not initial load)
  useEffect(() => {
    if (!isLoading) {
      loadEvents(false);
    }
  }, [selectedCategory, selectedDateRange, debouncedSearch]);

  // Handle event click - navigate to details
  const handleEventClick = (event) => {
    window.location.hash = `event/${event.id}`;
  };

  // Featured events (top 3)
  const featuredEvents = events.filter(e => e.featured).slice(0, 3);
  const regularEvents = events.filter(e => !featuredEvents.includes(e));

  return (
    <AttendeeLayout activePage="discover">
      {/* Hero Section */}
      <div className="relative mb-8 -mx-4 px-4 py-12 bg-gradient-to-br from-sky-600/20 via-violet-600/20 to-slate-900 rounded-b-3xl overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="relative max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Discover Amazing Events
          </h1>
          <p className="text-slate-300 mb-6">
            Find and register for the best events in your area
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, venues, or topics..."
              className="w-full pl-12 pr-4 py-3 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            >
              <option value="all">Any Date</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2">
          {isSearching && (
            <span className="w-4 h-4 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
          )}
          <span className="text-sm text-slate-400">
            {events.length} events found
          </span>
        </div>
      </div>

      {/* Featured Events */}
      {featuredEvents.length > 0 && !isLoading && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-400" />
            Featured Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={handleEventClick}
                variant="featured"
              />
            ))}
          </div>
        </div>
      )}

      {/* All Events Grid */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">
          {selectedCategory === 'all' ? 'All Events' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Events`}
        </h2>

        {isLoading ? (
          <EventGridSkeleton count={6} />
        ) : regularEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
              <Calendar className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No events found</h3>
            <p className="text-slate-400">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={handleEventClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="!bg-slate-800 !border !border-slate-700"
      />
    </AttendeeLayout>
  );
};

export default EventDiscovery;
