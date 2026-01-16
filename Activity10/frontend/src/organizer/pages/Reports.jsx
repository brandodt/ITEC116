import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  Calendar,
  Users,
  TrendingUp,
  PieChart,
  BarChart2,
  Filter,
  RefreshCw
} from 'react-feather';
import OrganizerLayout from '../components/OrganizerLayout';
import StatsCard from '../components/StatsCard';
import { DashboardSkeleton } from '../components/LoadingSkeleton';
import { fetchEvents, fetchDashboardStats } from '../services/eventService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Reports Page
 * Event analytics and export functionality for organizers
 * Uses Emerald/Teal color palette
 */

const Reports = () => {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedEvent, setSelectedEvent] = useState('all');

  // Load data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [eventsData, statsData] = await Promise.all([
        fetchEvents(),
        fetchDashboardStats(),
      ]);
      setEvents(eventsData);
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to load report data');
      console.error('Load error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Generate report data from real events
  const reportData = useMemo(() => {
    // Filter events based on selected period
    const now = new Date();
    let filteredEvents = [...events];
    
    if (selectedPeriod === '7days') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredEvents = events.filter(e => new Date(e.createdAt || e.date) >= weekAgo);
    } else if (selectedPeriod === '30days') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filteredEvents = events.filter(e => new Date(e.createdAt || e.date) >= monthAgo);
    } else if (selectedPeriod === '90days') {
      const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      filteredEvents = events.filter(e => new Date(e.createdAt || e.date) >= quarterAgo);
    }

    // Generate registrations by day (last 7 days)
    const registrationsByDay = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      // Sum registrations for events on this day (simplified - using total registrations divided by days)
      const dayEvents = filteredEvents.filter(e => {
        const eventDate = new Date(e.createdAt || e.date).toISOString().split('T')[0];
        return eventDate === dateStr;
      });
      const count = dayEvents.reduce((sum, e) => sum + (e.registeredCount || e.registrations || 0), 0);
      registrationsByDay.push({ date: dateStr, count });
    }

    // Generate category breakdown
    const categoryMap = {};
    let totalRegistrations = 0;
    filteredEvents.forEach(e => {
      const category = e.category || 'Other';
      const regs = e.registeredCount || e.registrations || 0;
      categoryMap[category] = (categoryMap[category] || 0) + regs;
      totalRegistrations += regs;
    });
    
    const categoryBreakdown = Object.entries(categoryMap)
      .map(([category, count]) => ({
        category,
        count,
        percentage: totalRegistrations > 0 ? Math.round((count / totalRegistrations) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top events by registrations
    const topEvents = [...filteredEvents]
      .sort((a, b) => (b.registeredCount || b.registrations || 0) - (a.registeredCount || a.registrations || 0))
      .slice(0, 5)
      .map(e => ({
        name: e.name,
        registrations: e.registeredCount || e.registrations || 0,
        checkIns: e.checkedInCount || 0,
        rate: (e.registeredCount || e.registrations) > 0 
          ? Math.round(((e.checkedInCount || 0) / (e.registeredCount || e.registrations || 1)) * 100)
          : 0
      }));

    return { registrationsByDay, categoryBreakdown, topEvents };
  }, [events, selectedPeriod]);

  // Export to CSV
  const handleExportCSV = (reportType) => {
    let csvContent = '';
    let filename = '';

    switch (reportType) {
      case 'registrations':
        csvContent = 'Date,Registrations\n' + 
          reportData.registrationsByDay.map(d => `${d.date},${d.count}`).join('\n');
        filename = 'registrations-report.csv';
        break;
      case 'categories':
        csvContent = 'Category,Count,Percentage\n' + 
          reportData.categoryBreakdown.map(c => `${c.category},${c.count},${c.percentage}%`).join('\n');
        filename = 'category-report.csv';
        break;
      case 'events':
        csvContent = 'Event,Registrations,Check-ins,Rate\n' + 
          reportData.topEvents.map(e => `"${e.name}",${e.registrations},${e.checkIns},${e.rate}%`).join('\n');
        filename = 'events-report.csv';
        break;
      default:
        return;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`${filename} downloaded successfully!`);
  };

  // Calculate max for bar chart scaling
  const maxRegistration = Math.max(...reportData.registrationsByDay.map(d => d.count), 1);

  if (isLoading) {
    return (
      <OrganizerLayout activePage="reports">
        <DashboardSkeleton />
      </OrganizerLayout>
    );
  }

  return (
    <OrganizerLayout activePage="reports">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-500" />
            Reports & Analytics
          </h1>
          <p className="text-slate-400">
            View statistics and export data for your events
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-400">Filters:</span>
          </div>
          
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>

          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="all">All Events</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>{event.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Events"
          value={stats?.totalEvents || 0}
          subtitle="All time"
          icon={Calendar}
          variant="default"
        />
        <StatsCard
          title="Total Registrations"
          value={stats?.totalRegistrations || 0}
          subtitle="Across all events"
          icon={Users}
          variant="teal"
        />
        <StatsCard
          title="Check-in Rate"
          value={`${stats?.checkInRate || 0}%`}
          subtitle="Overall attendance"
          icon={TrendingUp}
          variant="success"
        />
        <StatsCard
          title="Avg. per Event"
          value={stats?.totalEvents > 0 ? Math.round(stats?.totalRegistrations / stats?.totalEvents) : 0}
          subtitle="Registrations"
          icon={BarChart2}
          variant="info"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Registration Trend Chart */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Registration Trend
            </h3>
            <button
              onClick={() => handleExportCSV('registrations')}
              className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          
          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-48">
            {reportData.registrationsByDay.map((day, index) => {
              const height = maxRegistration > 0 ? (day.count / maxRegistration) * 100 : 0;
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-slate-400">{day.count}</span>
                  <div 
                    className="w-full bg-gradient-to-t from-emerald-600 to-teal-500 rounded-t-lg transition-all duration-500 hover:from-emerald-500 hover:to-teal-400"
                    style={{ height: `${Math.max(height, 2)}%`, minHeight: '8px' }}
                  />
                  <span className="text-xs text-slate-500">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-teal-500" />
              Category Breakdown
            </h3>
            <button
              onClick={() => handleExportCSV('categories')}
              className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          
          <div className="space-y-3">
            {reportData.categoryBreakdown.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">No category data available</p>
            ) : (
              reportData.categoryBreakdown.map((cat, index) => {
                const colors = [
                  'from-emerald-500 to-emerald-600',
                  'from-teal-500 to-teal-600',
                  'from-cyan-500 to-cyan-600',
                  'from-green-500 to-green-600',
                  'from-slate-500 to-slate-600',
                ];
                return (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-300">{cat.category}</span>
                      <span className="text-slate-400">{cat.count} ({cat.percentage}%)</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${colors[index % colors.length]} rounded-full transition-all duration-500`}
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Top Events Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-500" />
            Top Events by Registrations
          </h3>
          <button
            onClick={() => handleExportCSV('events')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-emerald-400 hover:text-emerald-300 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-700">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Event Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Registrations
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Check-ins
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {reportData.topEvents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                    No events with registrations yet
                  </td>
                </tr>
              ) : (
                reportData.topEvents.map((event, index) => (
                  <tr 
                    key={event.name}
                    className={`border-b border-slate-700/50 ${index % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-800/10'} hover:bg-slate-700/30 transition-colors`}
                  >
                    <td className="px-4 py-3">
                      <span className={`
                        inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                        ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' : 
                          index === 1 ? 'bg-slate-400/20 text-slate-300' :
                          index === 2 ? 'bg-amber-600/20 text-amber-500' :
                          'bg-slate-600/20 text-slate-400'}
                      `}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white font-medium">{event.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-emerald-400 font-semibold">{event.registrations}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-400">{event.checkIns}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-400">{event.rate}%</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
    </OrganizerLayout>
  );
};

export default Reports;
