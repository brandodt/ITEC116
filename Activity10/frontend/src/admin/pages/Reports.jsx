import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart2,
  Download,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  RefreshCw,
  FileText
} from 'react-feather';
import AdminLayout from '../components/AdminLayout';
import StatsCard from '../components/StatsCard';
import { StatsCardSkeleton, ChartSkeleton } from '../components/LoadingSkeleton';
import { ProgressBar } from '../components/Feedback';
import { fetchReportData, fetchSystemStats, exportToCSV } from '../services/adminService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Reports Page (Admin)
 * Attendance stats, revenue reports, and data exports
 * Indigo/Deep Slate color palette
 */

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [exportType, setExportType] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Load report data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [reports, systemStats] = await Promise.all([
        fetchReportData(),
        fetchSystemStats(),
      ]);
      setReportData(reports);
      setStats(systemStats);
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

  // Handle export
  const handleExport = async (type) => {
    try {
      setExportType(type);
      setIsExporting(true);
      const csvData = await exportToCSV(type);
      
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} exported successfully`);
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
      setExportType('');
    }
  };

  // Simple bar chart component
  const SimpleBarChart = ({ data, dataKey, labelKey, color = 'indigo' }) => {
    if (!data || data.length === 0) return null;
    
    const maxValue = Math.max(...data.map(d => d[dataKey]));
    const colors = {
      indigo: 'from-indigo-500 to-indigo-600',
      emerald: 'from-emerald-500 to-teal-500',
      amber: 'from-amber-500 to-orange-500',
    };
    
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="w-12 text-xs text-slate-400 text-right">
              {item[labelKey]}
            </span>
            <div className="flex-1 h-6 bg-slate-700/50 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${colors[color]} rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                style={{ width: `${(item[dataKey] / maxValue) * 100}%` }}
              >
                <span className="text-xs text-white font-medium">
                  {typeof item[dataKey] === 'number' && item[dataKey] > 999 
                    ? `${(item[dataKey] / 1000).toFixed(0)}k`
                    : item[dataKey]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <AdminLayout activePage="reports">
      {/* Page Header */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-indigo-400" />
            Reports & Analytics
          </h1>
          <p className="text-slate-400">
            View attendance stats, revenue reports, and export data
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Stats */}
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
              title="Total Revenue"
              value={`₱${(stats?.totalRevenue || 0).toLocaleString()}`}
              icon={DollarSign}
              variant="warning"
              trend="up"
              trendValue="+15%"
            />
            <StatsCard
              title="Total Registrations"
              value={stats?.totalRegistrations || 0}
              icon={Users}
              variant="success"
              trend="up"
              trendValue={`+${stats?.monthlyGrowth?.registrations || 0}%`}
            />
            <StatsCard
              title="Attendance Rate"
              value={`${stats?.averageAttendanceRate || 0}%`}
              icon={TrendingUp}
              variant="primary"
            />
            <StatsCard
              title="Total Events"
              value={stats?.totalEvents || 0}
              icon={Calendar}
              variant="info"
              trend="up"
              trendValue={`+${stats?.monthlyGrowth?.events || 0}%`}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Registrations by Month */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              Registrations by Month
            </h3>
          </div>
          {isLoading ? (
            <ChartSkeleton height={200} />
          ) : (
            <SimpleBarChart 
              data={reportData?.registrationsByMonth} 
              dataKey="count" 
              labelKey="month"
              color="emerald"
            />
          )}
        </div>

        {/* Revenue by Month */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-400" />
              Revenue by Month
            </h3>
          </div>
          {isLoading ? (
            <ChartSkeleton height={200} />
          ) : (
            <SimpleBarChart 
              data={reportData?.revenueByMonth} 
              dataKey="revenue" 
              labelKey="month"
              color="amber"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Events by Category */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              Events by Category
            </h3>
          </div>
          {isLoading ? (
            <ChartSkeleton height={160} />
          ) : (
            <div className="space-y-4">
              {reportData?.eventsByCategory?.map((cat, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-300">{cat.category}</span>
                    <span className="text-white font-medium">{cat.count} events</span>
                  </div>
                  <ProgressBar 
                    value={cat.count} 
                    max={Math.max(...reportData.eventsByCategory.map(c => c.count))} 
                    showPercentage={false}
                    variant="indigo"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Organizers */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-400" />
              Top Organizers
            </h3>
          </div>
          {isLoading ? (
            <ChartSkeleton height={160} />
          ) : (
            <div className="space-y-4">
              {reportData?.topOrganizers?.map((org, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-slate-900/30 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
                    <span className="text-white font-semibold">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{org.name}</p>
                    <p className="text-xs text-slate-400">
                      {org.events} events • {org.attendees} attendees
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-amber-400">
                      ₱{org.revenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-gradient-to-r from-indigo-600/20 to-indigo-800/20 rounded-xl border border-indigo-500/30 p-6">
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <Download className="w-5 h-5 text-indigo-400" />
          Export Data
        </h3>
        <p className="text-slate-400 text-sm mb-6">
          Download reports and data in CSV format for further analysis.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => handleExport('users')}
            disabled={isExporting}
            className="flex items-center justify-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors group disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">Users</p>
              <p className="text-xs text-slate-400">Export all users</p>
            </div>
            {isExporting && exportType === 'users' && (
              <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin ml-auto" />
            )}
          </button>

          <button
            onClick={() => handleExport('events')}
            disabled={isExporting}
            className="flex items-center justify-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors group disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
              <Calendar className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">Events</p>
              <p className="text-xs text-slate-400">Export all events</p>
            </div>
            {isExporting && exportType === 'events' && (
              <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin ml-auto" />
            )}
          </button>

          <button
            onClick={() => handleExport('registrations')}
            disabled={isExporting}
            className="flex items-center justify-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors group disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
              <FileText className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">Registrations</p>
              <p className="text-xs text-slate-400">Export all registrations</p>
            </div>
            {isExporting && exportType === 'registrations' && (
              <RefreshCw className="w-4 h-4 text-amber-400 animate-spin ml-auto" />
            )}
          </button>
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

export default Reports;
