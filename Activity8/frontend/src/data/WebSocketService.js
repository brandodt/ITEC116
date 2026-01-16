import { io } from 'socket.io-client';

// WebSocket service for real-time chat functionality using Socket.io
class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.currentRoom = null;
  }

  connect() {
    if (this.socket?.connected) {
      return;
    }

    // Connect to the backend server
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    
    this.socket = io(backendUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('[Socket.io] Connected');
      this.emit('connected', {});
      
      // Rejoin room if we were in one
      if (this.currentRoom) {
        this.joinRoom(this.currentRoom);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('[Socket.io] Disconnected');
      this.emit('disconnected', {});
    });

    this.socket.on('connect_error', (error) => {
      console.error('[Socket.io] Connection error:', error);
      this.emit('error', { error });
    });

    // Listen for all custom events
    this.socket.onAny((event, data) => {
      this.emit(event, data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(roomId, username) {
    this.currentRoom = roomId;
    this.socket?.emit('joinRoom', { roomId, username });
  }

  leaveRoom(roomId) {
    this.currentRoom = null;
    this.socket?.emit('leaveRoom', { roomId });
  }

  sendMessage(roomId, message) {
    this.socket?.emit('sendMessage', { roomId, ...message });
  }

  send(event, data) {
    this.socket?.emit(event, data);
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  off(event, callback) {
    this.listeners.get(event)?.delete(callback);
  }

  emit(event, data) {
    this.listeners.get(event)?.forEach((callback) => {
      try {
        callback(data);
      } catch (err) {
        console.error('[Socket.io] Listener error:', err);
      }
    });
  }
}

// Singleton instance
export const wsService = new WebSocketService();
export default wsService;
