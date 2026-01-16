import React, { useState, useEffect, useCallback } from 'react';
import { Tag, Calendar, CheckCircle, Clock, Search } from 'react-feather';
import AttendeeLayout from '../components/AttendeeLayout';
import TicketCard from '../components/TicketCard';
import StatsCard from '../components/StatsCard';
import QRCodeModal from '../components/QRCodeModal';
import UpdateRegistrationModal from '../components/UpdateRegistrationModal';
import { TicketListSkeleton, StatsCardSkeleton } from '../components/LoadingSkeleton';
import { ConfirmModal } from '../../shared';
import { fetchMyTickets, fetchAttendeeStats, cancelTicket, updateRegistration } from '../services/attendeeService';
import { useAttendeeAuth } from '../contexts/AttendeeAuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * My Tickets Page (Attendee Dashboard)
 * Private page for viewing registered event tickets
 */

const MyTickets = () => {
  const { user, isAuthenticated } = useAttendeeAuth();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [ticketToUpdate, setTicketToUpdate] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [ticketToCancel, setTicketToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Load tickets
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [ticketsData, statsData] = await Promise.all([
        fetchMyTickets(),
        fetchAttendeeStats(),
      ]);
      setTickets(ticketsData);
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to load tickets');
      console.error('Load error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  // Handle view QR code
  const handleViewQR = (ticket) => {
    setSelectedTicket(ticket);
    setIsQRModalOpen(true);
  };

  // Handle cancel ticket - show confirmation modal
  const handleCancelTicket = (ticket) => {
    setTicketToCancel(ticket);
    setIsCancelModalOpen(true);
  };

  // Confirm cancel ticket
  const confirmCancelTicket = async () => {
    if (!ticketToCancel) return;

    try {
      setIsCancelling(true);
      await cancelTicket(ticketToCancel.id);
      toast.success('Ticket cancelled successfully');
      setIsCancelModalOpen(false);
      setTicketToCancel(null);
      loadData(); // Refresh list
    } catch (error) {
      toast.error('Failed to cancel ticket');
    } finally {
      setIsCancelling(false);
    }
  };

  // Close cancel modal
  const closeCancelModal = () => {
    if (!isCancelling) {
      setIsCancelModalOpen(false);
      setTicketToCancel(null);
    }
  };

  // Handle update ticket
  const handleUpdateTicket = (ticket) => {
    setTicketToUpdate(ticket);
    setIsUpdateModalOpen(true);
  };

  // Handle update submit
  const handleUpdateSubmit = async (ticketId, updateData) => {
    await updateRegistration(ticketId, updateData);
    toast.success('Registration updated successfully');
    loadData(); // Refresh list
  };

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.eventName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'upcoming') {
      return matchesSearch && ticket.status === 'valid' && new Date(ticket.eventDate) >= new Date();
    }
    if (filterStatus === 'past') {
      return matchesSearch && new Date(ticket.eventDate) < new Date();
    }
    if (filterStatus === 'cancelled') {
      return matchesSearch && ticket.status === 'cancelled';
    }
    return matchesSearch;
  });

  // Separate upcoming and past
  const upcomingTickets = filteredTickets.filter(t => 
    t.status === 'valid' && new Date(t.eventDate) >= new Date()
  );
  const pastTickets = filteredTickets.filter(t => 
    new Date(t.eventDate) < new Date() || t.status === 'cancelled'
  );

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <AttendeeLayout activePage="my-tickets">
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
            <Tag className="w-10 h-10 text-slate-600" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Sign in to view your tickets</h2>
          <p className="text-slate-400 mb-6">
            You need to be logged in to see your registered events
          </p>
          <a
            href="#login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-violet-600 text-white font-medium rounded-xl hover:from-sky-600 hover:to-violet-700 transition-all shadow-lg shadow-sky-500/25"
          >
            Sign In
          </a>
        </div>
      </AttendeeLayout>
    );
  }

  return (
    <AttendeeLayout activePage="my-tickets">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">My Tickets</h1>
        <p className="text-slate-400">
          Manage your event registrations and access QR codes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
              title="Total Tickets"
              value={stats?.totalTickets || 0}
              icon={Tag}
              variant="primary"
            />
            <StatsCard
              title="Upcoming"
              value={stats?.upcomingEvents || 0}
              icon={Calendar}
              variant="violet"
            />
            <StatsCard
              title="Attended"
              value={stats?.checkedInEvents || 0}
              icon={CheckCircle}
              variant="success"
            />
            <StatsCard
              title="Past Events"
              value={stats?.pastEvents || 0}
              icon={Clock}
              variant="warning"
            />
          </>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
        >
          <option value="all">All Tickets</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Tickets List */}
      {isLoading ? (
        <TicketListSkeleton count={3} />
      ) : filteredTickets.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
            <Tag className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No tickets found</h3>
          <p className="text-slate-400 mb-6">
            {searchQuery 
              ? 'Try adjusting your search' 
              : "You haven't registered for any events yet"}
          </p>
          <a
            href="#discover"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-violet-600 text-white font-medium rounded-xl hover:from-sky-600 hover:to-violet-700 transition-all shadow-lg shadow-sky-500/25"
          >
            Discover Events
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Upcoming Tickets */}
          {upcomingTickets.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-400" />
                Upcoming Events ({upcomingTickets.length})
              </h2>
              <div className="space-y-4">
                {upcomingTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onViewQR={handleViewQR}
                    onCancel={handleCancelTicket}
                    onUpdate={handleUpdateTicket}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Past Tickets */}
          {pastTickets.length > 0 && filterStatus !== 'upcoming' && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" />
                Past & Cancelled ({pastTickets.length})
              </h2>
              <div className="space-y-4">
                {pastTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onViewQR={handleViewQR}
                    onCancel={handleCancelTicket}
                    onUpdate={handleUpdateTicket}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* QR Code Modal */}
      <QRCodeModal
        ticket={selectedTicket}
        isOpen={isQRModalOpen}
        onClose={() => {
          setIsQRModalOpen(false);
          setSelectedTicket(null);
        }}
      />

      {/* Update Registration Modal */}
      <UpdateRegistrationModal
        ticket={ticketToUpdate}
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setTicketToUpdate(null);
        }}
        onUpdate={handleUpdateSubmit}
      />

      {/* Cancel Ticket Confirmation Modal */}
      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={closeCancelModal}
        onConfirm={confirmCancelTicket}
        title="Cancel Ticket?"
        message="Are you sure you want to cancel this ticket? This action cannot be undone."
        itemName={ticketToCancel?.eventName}
        confirmText="Cancel Ticket"
        cancelText="Keep Ticket"
        type="cancel"
        theme="sky"
        isLoading={isCancelling}
      />

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

export default MyTickets;
