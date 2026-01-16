import React, { useState, useEffect } from 'react';
import { Check, X, Loader, Tag, Calendar, MapPin, ArrowRight } from 'react-feather';
import AttendeeLayout from '../components/AttendeeLayout';
import { confirmRegistration } from '../services/attendeeService';

/**
 * Confirm Registration Page
 * Handles guest ticket confirmation via email token
 */

const ConfirmRegistration = ({ token }) => {
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error', 'already-confirmed'
  const [ticket, setTicket] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const confirm = async () => {
      if (!token) {
        setStatus('error');
        setErrorMessage('Invalid confirmation link');
        return;
      }

      try {
        const result = await confirmRegistration(token);
        setTicket(result.ticket);
        
        if (result.message?.includes('already been confirmed')) {
          setStatus('already-confirmed');
        } else {
          setStatus('success');
        }
      } catch (error) {
        setStatus('error');
        setErrorMessage(error.message || 'Invalid or expired confirmation token');
      }
    };

    confirm();
  }, [token]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <AttendeeLayout activePage="discover">
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md w-full">
          {/* Loading State */}
          {status === 'loading' && (
            <div className="text-center p-8 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-sky-500/20 flex items-center justify-center">
                <Loader className="w-10 h-10 text-sky-400 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Confirming Your Registration
              </h2>
              <p className="text-slate-400">
                Please wait while we verify your ticket...
              </p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center p-8 bg-slate-800/50 rounded-2xl border border-emerald-500/30">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Registration Confirmed! 🎉
              </h2>
              <p className="text-slate-400 mb-6">
                Your ticket has been confirmed. You're all set!
              </p>

              {ticket && (
                <div className="bg-slate-900/50 rounded-xl p-4 mb-6 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center">
                      <Tag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{ticket.eventName}</h3>
                      <p className="text-sm text-slate-400">{ticket.ticketType}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="w-4 h-4 text-sky-400" />
                      <span>{formatDate(ticket.eventDate)} at {ticket.eventTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4 text-rose-400" />
                      <span>{ticket.eventLocation}</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-slate-800 rounded-lg">
                    <p className="text-xs text-slate-400 mb-1">Ticket Code</p>
                    <p className="font-mono text-lg text-emerald-400">{ticket.qrCode}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <a
                  href="#login"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-violet-600 text-white font-medium rounded-xl hover:from-sky-600 hover:to-violet-700 transition-all"
                >
                  Create Account to Manage Tickets
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#discover"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Browse More Events
                </a>
              </div>
            </div>
          )}

          {/* Already Confirmed State */}
          {status === 'already-confirmed' && (
            <div className="text-center p-8 bg-slate-800/50 rounded-2xl border border-sky-500/30">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-sky-500/20 flex items-center justify-center">
                <Check className="w-10 h-10 text-sky-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Already Confirmed
              </h2>
              <p className="text-slate-400 mb-6">
                This ticket has already been confirmed. You're all set!
              </p>

              {ticket && (
                <div className="bg-slate-900/50 rounded-xl p-4 mb-6 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center">
                      <Tag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{ticket.eventName}</h3>
                      <p className="text-sm text-slate-400">{ticket.ticketType}</p>
                    </div>
                  </div>
                  
                  <div className="mt-2 p-3 bg-slate-800 rounded-lg">
                    <p className="text-xs text-slate-400 mb-1">Ticket Code</p>
                    <p className="font-mono text-lg text-emerald-400">{ticket.qrCode}</p>
                  </div>
                </div>
              )}

              <a
                href="#discover"
                className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors"
              >
                Browse More Events
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="text-center p-8 bg-slate-800/50 rounded-2xl border border-red-500/30">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <X className="w-10 h-10 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Confirmation Failed
              </h2>
              <p className="text-slate-400 mb-6">
                {errorMessage}
              </p>
              
              <div className="flex flex-col gap-3">
                <a
                  href="#discover"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-violet-600 text-white font-medium rounded-xl hover:from-sky-600 hover:to-violet-700 transition-all"
                >
                  Browse Events
                  <ArrowRight className="w-4 h-4" />
                </a>
                <p className="text-sm text-slate-500">
                  If you believe this is an error, please try registering again.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AttendeeLayout>
  );
};

export default ConfirmRegistration;
