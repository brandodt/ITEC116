import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Calendar,
  DollarSign,
  TrendingUp,
  Activity,
  UserPlus,
  Clock,
  CheckCircle,
  ArrowRight,
  AlertCircle
} from 'react-feather';
import AdminLayout from '../components/AdminLayout';
import StatsCard from '../components/StatsCard';
import { StatsCardSkeleton, ActivityLogSkeleton } from '../components/LoadingSkeleton';
import { StatusBadge } from '../components/Feedback';
import { fetchSystemStats, fetchActivityLogs, fetchAllEvents } from '../services/adminService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Admin Dashboard Page
 * Overview with system-wide statistics and recent activity
 * Indigo/Deep Slate color palette
 */

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load dashboard data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [statsData, logsData, eventsData] = await Promise.all([
        fetchSystemStats(),
        fetchActivityLogs(8),
        fetchAllEvents(),
      ]);
      setStats(statsData);
      setActivityLogs(logsData);
      setRecentEvents(eventsData.slice(0, 5));
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Load error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'Event Created':
        return <Calendar className="w-4 h-4 text-indigo-400" />;
      case 'User Registered':
        return <UserPlus className="w-4 h-4 text-emerald-400" />;
      case 'Event Completed':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'Check-in':
        return <Activity className="w-4 h-4 text-sky-400" />;
      case 'Export Generated':
        return <TrendingUp className="w-4 h-4 text-amber-400" />;
      case 'User Deactivated':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <AdminLayout activePage="dashboard">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard Overview</h1>
        <p className="text-slate-400">
          Welcome back! Here's what's happening with EventHub today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <StatsCard
              title="Total Users"
              value={stats?.totalUsers || 0}
              subtitle={`${stats?.activeOrganizers || 0} active organizers`}
              icon={Users}
              variant="primary"
              trend="up"
              trendValue={`+${stats?.monthlyGrowth?.users || 0}%`}
            />
            <StatsCard
              title="Total Events"
              value={stats?.totalEvents || 0}
              subtitle={`${stats?.upcomingEvents || 0} upcoming`}
              icon={Calendar}
              variant="info"
              trend="up"
              trendValue={`+${stats?.monthlyGrowth?.events || 0}%`}
            />
            <StatsCard
              title="Total Registrations"
              value={stats?.totalRegistrations || 0}
              subtitle="All time registrations"
              icon={Activity}
              variant="success"
              trend="up"
              trendValue={`+${stats?.monthlyGrowth?.registrations || 0}%`}
            />
            <StatsCard
              title="Total Revenue"
              value={`₱${(stats?.totalRevenue || 0).toLocaleString()}`}
              subtitle="Platform earnings"
              icon={DollarSign}
              variant="warning"
              trend="up"
              trendValue="+15%"
            />
          </>
        )}
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {isLoading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <StatsCard
              title="Completed Events"
              value={stats?.completedEvents || 0}
              icon={CheckCircle}
              variant="success"
            />
            <StatsCard
              title="Avg. Attendance Rate"
              value={`${stats?.averageAttendanceRate || 0}%`}
              icon={TrendingUp}
              variant="info"
            />
            <StatsCard
              title="Active Organizers"
              value={stats?.activeOrganizers || 0}
              icon={Users}
              variant="primary"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              Recent Activity
            </h2>
            <a 
              href="#admin-reports" 
              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          
          <div className="p-4">
            {isLoading ? (
              <ActivityLogSkeleton count={5} />
            ) : (
              <div className="space-y-3">
                {activityLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className="flex items-start gap-3 p-3 bg-slate-900/30 rounded-lg hover:bg-slate-900/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                      {getActionIcon(log.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium">{log.action}</p>
                      <p className="text-xs text-slate-400 truncate">{log.details}</p>
                    </div>
                    <span className="text-xs text-slate-500 flex-shrink-0">
                      {formatTimeAgo(log.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              Recent Events
            </h2>
            <a 
              href="#admin-events" 
              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          
          <div className="divide-y divide-slate-700/50">
            {isLoading ? (
              <div className="p-4">
                <ActivityLogSkeleton count={5} />
              </div>
            ) : (
              recentEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="p-4 hover:bg-slate-900/30 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{event.name}</p>
                      <p className="text-xs text-slate-400">
                        by {event.organizer} • {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">
                          {event.registrations}/{event.capacity}
                        </p>
                        <p className="text-xs text-slate-400">registrations</p>
                      </div>
                      <StatusBadge status={event.status} size="small" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-600/20 to-indigo-800/20 rounded-xl border border-indigo-500/30">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="#admin-users"
            className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
              <UserPlus className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-sm font-medium text-white">Add User</span>
          </a>
          <a
            href="#admin-events"
            className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
              <Calendar className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-sm font-medium text-white">View Events</span>
          </a>
          <a
            href="#admin-reports"
            className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-sm font-medium text-white">View Reports</span>
          </a>
          <a
            href="#admin-reports"
            className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center group-hover:bg-sky-500/30 transition-colors">
              <DollarSign className="w-5 h-5 text-sky-400" />
            </div>
            <span className="text-sm font-medium text-white">Export Data</span>
          </a>
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
    </AdminLayout>
  );
};

export default Dashboard;
