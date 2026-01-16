import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Camera, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Zap,
  User,
  Mail,
  Briefcase,
  RefreshCw,
  Video,
  VideoOff
} from 'react-feather';
import OrganizerLayout from '../components/OrganizerLayout';
import { InlineFeedback, Spinner } from '../components/Feedback';
import { verifyTicket } from '../services/eventService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Check-in Scanner Page
 * QR code scanning interface for event check-in
 * Uses Emerald/Teal color palette
 */

const CheckInScanner = () => {
  const [ticketCode, setTicketCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [recentCheckIns, setRecentCheckIns] = useState([]);
  const [cameraError, setCameraError] = useState(null);
  const [isInitializingCamera, setIsInitializingCamera] = useState(false);
  const inputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const scannerRef = useRef(null);
  const streamRef = useRef(null);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (scannerRef.current) {
      cancelAnimationFrame(scannerRef.current);
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  // Start camera for QR scanning
  const startCamera = async () => {
    setCameraError(null);
    setIsInitializingCamera(true);

    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Prefer back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsScanning(true);
        
        // Start scanning loop
        scanForQRCode();
      }
    } catch (error) {
      console.error('Camera error:', error);
      if (error.name === 'NotAllowedError') {
        setCameraError('Camera access denied. Please allow camera permissions.');
      } else if (error.name === 'NotFoundError') {
        setCameraError('No camera found on this device.');
      } else {
        setCameraError('Failed to access camera. Please try again.');
      }
    } finally {
      setIsInitializingCamera(false);
    }
  };

  // Scan for QR codes in video stream
  const scanForQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const scan = () => {
      if (!isScanning && !streamRef.current) return;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Use jsQR library if available, otherwise simulate detection
        if (typeof window.jsQR !== 'undefined') {
          const code = window.jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          });
          
          if (code) {
            handleQRCodeDetected(code.data);
            return; // Stop scanning after detection
          }
        } else {
          // Fallback: simple pattern detection for demo purposes
          // In production, include jsQR library
          const ticketPattern = /^TKT-[A-Z0-9]{6,}$/;
          // Simulate QR detection by checking every few seconds
          // This is just for demo - real implementation needs jsQR
        }
      }

      scannerRef.current = requestAnimationFrame(scan);
    };

    scan();
  };

  // Handle QR code detection
  const handleQRCodeDetected = async (data) => {
    // Stop scanning temporarily
    stopCamera();
    
    // Vibrate if supported (mobile feedback)
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    
    // Verify the ticket
    await handleVerifyTicket(data);
    
    // Show success animation briefly before allowing next scan
    setTimeout(() => {
      inputRef.current?.focus();
    }, 1000);
  };

  // Toggle camera
  const toggleCamera = () => {
    if (isScanning) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Verify ticket code
  const handleVerifyTicket = useCallback(async (code) => {
    if (!code.trim()) return;

    try {
      setIsVerifying(true);
      const result = await verifyTicket(code.trim());
      setLastResult(result);

      if (result.valid) {
        toast.success(`${result.attendee.name} checked in successfully!`);
        setRecentCheckIns(prev => [
          { ...result.attendee, checkInTime: new Date().toISOString() },
          ...prev.slice(0, 9) // Keep last 10
        ]);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      setLastResult({ valid: false, message: 'Verification failed. Please try again.' });
      toast.error('Verification failed');
    } finally {
      setIsVerifying(false);
      setTicketCode('');
      inputRef.current?.focus();
    }
  }, []);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    handleVerifyTicket(ticketCode);
  };

  // Handle input change (for barcode scanners that input directly)
  const handleInputChange = (e) => {
    const value = e.target.value;
    setTicketCode(value);
    
    // Auto-submit if code ends with newline (common for barcode scanners)
    if (value.includes('\n')) {
      handleVerifyTicket(value.replace('\n', ''));
    }
  };

  // Clear last result
  const handleClearResult = () => {
    setLastResult(null);
  };

  // Format time
  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <OrganizerLayout activePage="scanner">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <Camera className="w-6 h-6 text-emerald-500" />
          Check-in Scanner
        </h1>
        <p className="text-slate-400">
          Scan QR codes or enter ticket codes to check in attendees
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner Section */}
        <div className="space-y-6">
          {/* Manual Entry */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-teal-400" />
              Quick Check-in
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Enter Ticket Code
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={ticketCode}
                    onChange={handleInputChange}
                    placeholder="Scan or type ticket code..."
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-lg font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                    autoFocus
                    disabled={isVerifying}
                  />
                  {isVerifying && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Spinner size="sm" className="text-emerald-500" />
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={!ticketCode.trim() || isVerifying}
                className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <Spinner size="sm" className="text-white" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Verify & Check In
                  </>
                )}
              </button>
            </form>

            <p className="mt-4 text-xs text-slate-500 text-center">
              Tip: Use a barcode scanner for faster check-ins
            </p>
          </div>

          {/* Camera Scanner */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-400" />
              Camera Scanner
            </h2>
            
            <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden border-2 border-slate-600">
              {/* Video Element - Hidden Canvas for Processing */}
              <video
                ref={videoRef}
                className={`w-full h-full object-cover ${isScanning ? 'block' : 'hidden'}`}
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Scanning Overlay */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Scanning Guide Box */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-emerald-500/70 rounded-lg relative">
                      {/* Corner Markers */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                      {/* Scanning Line */}
                      <div className="absolute left-2 right-2 h-0.5 bg-emerald-400 animate-pulse top-1/2 -translate-y-1/2" 
                           style={{ animation: 'scan-line 2s ease-in-out infinite' }} />
                    </div>
                  </div>
                  {/* Status Badge */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 rounded-full text-xs text-emerald-400 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    Scanning for QR code...
                  </div>
                </div>
              )}
              
              {/* Placeholder when not scanning */}
              {!isScanning && !isInitializingCamera && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Camera className="w-12 h-12 text-slate-600 mb-3" />
                  <p className="text-slate-500 text-sm text-center px-4">
                    Click the button below to start camera scanning
                  </p>
                </div>
              )}
              
              {/* Loading state */}
              {isInitializingCamera && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
                  <Spinner size="md" className="text-emerald-500 mb-3" />
                  <p className="text-slate-400 text-sm">Initializing camera...</p>
                </div>
              )}
            </div>

            {/* Camera Error */}
            {cameraError && (
              <InlineFeedback 
                type="error" 
                message={cameraError} 
                className="mt-4"
              />
            )}

            {/* Camera Controls */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={toggleCamera}
                disabled={isInitializingCamera}
                className={`
                  flex items-center gap-2 px-6 py-2.5 rounded-lg transition-colors font-medium
                  ${isScanning 
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }
                  ${isInitializingCamera ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {isScanning ? (
                  <>
                    <VideoOff className="w-4 h-4" />
                    Stop Camera
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4" />
                    Start Camera
                  </>
                )}
              </button>
            </div>

            <p className="mt-4 text-xs text-slate-500 text-center">
              Position the QR code within the scanning area for best results
            </p>
            
            {/* Add scanning animation style */}
            <style>{`
              @keyframes scan-line {
                0%, 100% { transform: translateY(-20px); opacity: 0.5; }
                50% { transform: translateY(20px); opacity: 1; }
              }
            `}</style>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Last Scan Result */}
          {lastResult && (
            <div className={`
              bg-slate-800 rounded-xl border p-6
              ${lastResult.valid 
                ? 'border-emerald-500/50' 
                : 'border-red-500/50'
              }
            `}>
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Scan Result
                </h2>
                <button
                  onClick={handleClearResult}
                  className="text-slate-400 hover:text-white text-sm"
                >
                  Clear
                </button>
              </div>

              <div className={`
                flex items-center gap-4 p-4 rounded-lg mb-4
                ${lastResult.valid 
                  ? 'bg-emerald-500/20' 
                  : 'bg-red-500/20'
                }
              `}>
                {lastResult.valid ? (
                  <CheckCircle className="w-12 h-12 text-emerald-400" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-400" />
                )}
                <div>
                  <p className={`text-xl font-semibold ${
                    lastResult.valid ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {lastResult.valid ? 'Check-in Successful' : 'Check-in Failed'}
                  </p>
                  <p className="text-slate-400">{lastResult.message}</p>
                </div>
              </div>

              {lastResult.attendee && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{lastResult.attendee.name}</p>
                      <p className="text-sm text-slate-400">{lastResult.attendee.email}</p>
                    </div>
                  </div>
                  
                  {lastResult.attendee.company && (
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Briefcase className="w-4 h-4" />
                      {lastResult.attendee.company}
                    </div>
                  )}
                  
                  <div className="text-xs text-slate-500 font-mono">
                    Ticket: {lastResult.attendee.ticketCode}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recent Check-ins */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                Recent Check-ins
              </h2>
              <span className="text-sm text-slate-400">
                {recentCheckIns.length} today
              </span>
            </div>

            {recentCheckIns.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-slate-500" />
                </div>
                <p className="text-slate-500 text-sm">No check-ins yet</p>
                <p className="text-slate-600 text-xs mt-1">
                  Scan a ticket to get started
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {recentCheckIns.map((attendee, index) => (
                  <div 
                    key={`${attendee.id}-${index}`}
                    className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{attendee.name}</p>
                        <p className="text-xs text-slate-500">{attendee.ticketCode}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">
                      {formatTime(attendee.checkInTime)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 text-center">
              <p className="text-3xl font-bold text-emerald-400">{recentCheckIns.length}</p>
              <p className="text-sm text-slate-400">Checked In Today</p>
            </div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 text-center">
              <p className="text-3xl font-bold text-teal-400">
                {recentCheckIns.filter(a => {
                  const checkInTime = new Date(a.checkInTime);
                  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
                  return checkInTime > fiveMinutesAgo;
                }).length}
              </p>
              <p className="text-sm text-slate-400">Last 5 Minutes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="dark"
        toastClassName="!bg-slate-800 !border !border-slate-700"
      />
    </OrganizerLayout>
  );
};

export default CheckInScanner;
