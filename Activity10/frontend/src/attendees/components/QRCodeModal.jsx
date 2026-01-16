import React, { useEffect, useRef } from 'react';
import { X, Download, Share2, Tag, Calendar, MapPin, Clock, User } from 'react-feather';

/**
 * QR Code Modal Component
 * Displays ticket QR code in a modal with download option
 */

const QRCodeModal = ({ ticket, isOpen, onClose }) => {
  const modalRef = useRef(null);
  const canvasRef = useRef(null);

  // Generate a simple QR-like pattern (placeholder - in production use a QR library)
  useEffect(() => {
    if (!isOpen || !canvasRef.current || !ticket) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = 200;
    canvas.width = size;
    canvas.height = size;

    // Create QR-like pattern based on ticket data
    const data = ticket.qrCode || ticket.id;
    const moduleSize = 8;
    const modules = Math.floor(size / moduleSize);

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Black modules (simplified QR pattern)
    ctx.fillStyle = '#0f172a';
    
    // Position patterns (corners)
    const drawPositionPattern = (x, y, s) => {
      ctx.fillRect(x, y, s * 7, s);
      ctx.fillRect(x, y, s, s * 7);
      ctx.fillRect(x + s * 6, y, s, s * 7);
      ctx.fillRect(x, y + s * 6, s * 7, s);
      ctx.fillRect(x + s * 2, y + s * 2, s * 3, s * 3);
    };

    drawPositionPattern(0, 0, moduleSize);
    drawPositionPattern(size - moduleSize * 7, 0, moduleSize);
    drawPositionPattern(0, size - moduleSize * 7, moduleSize);

    // Data pattern (pseudo-random based on ticket data)
    for (let i = 9; i < modules - 1; i++) {
      for (let j = 9; j < modules - 1; j++) {
        const charCode = data.charCodeAt((i * j) % data.length) || 0;
        if ((charCode + i + j) % 3 === 0) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize - 1, moduleSize - 1);
        }
      }
    }

    // Add timing patterns
    for (let i = 8; i < modules - 8; i++) {
      if (i % 2 === 0) {
        ctx.fillRect(i * moduleSize, 6 * moduleSize, moduleSize, moduleSize);
        ctx.fillRect(6 * moduleSize, i * moduleSize, moduleSize, moduleSize);
      }
    }
  }, [isOpen, ticket]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `ticket-${ticket.qrCode || ticket.id}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Ticket for ${ticket.eventName}`,
          text: `My ticket for ${ticket.eventName} on ${ticket.eventDate}`,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!isOpen || !ticket) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl animate-slide-in-top"
      >
        {/* Header */}
        <div className="relative p-4 bg-gradient-to-r from-sky-500 to-violet-600 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1">
            <Tag className="w-5 h-5" />
            <span className="font-medium">{ticket.ticketType}</span>
          </div>
          <h2 className="text-xl font-bold pr-8 line-clamp-2">{ticket.eventName}</h2>
        </div>

        {/* QR Code */}
        <div className="p-6 flex flex-col items-center">
          <div className="p-4 bg-white rounded-2xl shadow-lg mb-4">
            <canvas ref={canvasRef} className="w-48 h-48" />
          </div>
          
          <p className="text-xs text-slate-500 font-mono mb-4 text-center break-all">
            {ticket.qrCode || ticket.id}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              Save
            </button>
            {navigator.share && (
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            )}
          </div>
        </div>

        {/* Event Details */}
        <div className="px-6 pb-6">
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <span className="text-slate-300">{formatDate(ticket.eventDate)}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <span className="text-slate-300">{ticket.eventTime}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <span className="text-slate-300">{ticket.eventLocation}</span>
            </div>
            <div className="flex items-center gap-3 text-sm pt-2 border-t border-slate-700/50">
              <User className="w-4 h-4 text-violet-400 flex-shrink-0" />
              <span className="text-slate-300">{ticket.attendeeName}</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-6 pb-4">
          <p className="text-xs text-center text-slate-500">
            Present this QR code at the venue for check-in
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
