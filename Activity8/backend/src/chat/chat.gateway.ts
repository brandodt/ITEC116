import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface ConnectedUser {
  socketId: string;
  username: string;
  roomId: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers: Map<string, ConnectedUser> = new Map();
  private roomParticipants: Map<string, Set<string>> = new Map();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const user = this.connectedUsers.get(client.id);
    if (user) {
      this.leaveRoom(client, { roomId: user.roomId });
    }
    this.connectedUsers.delete(client.id);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; username?: string },
  ) {
    const { roomId, username } = data;

    // Leave previous room if any
    const previousUser = this.connectedUsers.get(client.id);
    if (previousUser && previousUser.roomId !== roomId) {
      this.leaveRoom(client, { roomId: previousUser.roomId });
    }

    // Join new room
    client.join(roomId);

    // Track user
    const user: ConnectedUser = {
      socketId: client.id,
      username: username || 'Anonymous',
      roomId,
    };
    this.connectedUsers.set(client.id, user);

    // Track room participants
    if (!this.roomParticipants.has(roomId)) {
      this.roomParticipants.set(roomId, new Set());
    }
    this.roomParticipants.get(roomId)!.add(client.id);

    const participantCount = this.roomParticipants.get(roomId)!.size;

    // Notify others
    client.to(roomId).emit('userJoined', {
      username: user.username,
      onlineCount: participantCount,
    });

    // Send room info to the joining user
    client.emit('roomInfo', {
      roomId,
      onlineCount: participantCount,
    });

    console.log(`User ${user.username} joined room ${roomId}`);
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string }) {
    const { roomId } = data;
    const user = this.connectedUsers.get(client.id);
    const roomParticipants = this.roomParticipants.get(roomId);

    if (user && roomParticipants) {
      roomParticipants.delete(client.id);
      client.leave(roomId);

      const participantCount = roomParticipants.size;

      // Notify others
      client.to(roomId).emit('userLeft', {
        username: user.username,
        onlineCount: participantCount,
      });

      console.log(`User ${user.username} left room ${roomId}`);
    }
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; content: string; sender: string; _id?: string; createdAt?: string },
  ) {
    const { roomId, content, sender, _id, createdAt } = data;
    const user = this.connectedUsers.get(client.id);

    if (user && user.roomId === roomId) {
      // Broadcast message to all users in the room (including sender)
      this.server.to(roomId).emit('newMessage', {
        _id,
        roomId,
        content,
        sender,
        createdAt: createdAt || new Date().toISOString(),
      });

      console.log(`Message from ${sender} in room ${roomId}: ${content}`);
    }
  }

  @SubscribeMessage('setUsername')
  handleSetUsername(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { username: string; roomId: string },
  ) {
    const user = this.connectedUsers.get(client.id);
    if (user) {
      user.username = data.username;
      this.connectedUsers.set(client.id, user);
      console.log(`User ${client.id} set username to ${data.username}`);
    }
  }
}
