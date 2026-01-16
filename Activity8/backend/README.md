# Activity 8 - Chatroom Backend

NestJS backend with REST API and WebSocket support for real-time chat functionality.

## Features

- **REST API** for chatrooms and messages
- **WebSocket Gateway** for real-time chat
- **MongoDB** for data persistence
- **Swagger** API documentation

## Installation

```bash
npm install
```

## Environment Setup

Copy `.env.example` to `.env` and configure:

```env
MONGODB_URI=mongodb://localhost:27017/chatroom
PORT=3000
```

## Running the App

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## API Documentation

Once running, visit: `http://localhost:3000/api/docs`

## Endpoints

### Chatrooms
- `GET /api/chatrooms` - Get all chatrooms
- `POST /api/chatrooms` - Create a chatroom
- `GET /api/chatrooms/:id` - Get chatroom by ID
- `PATCH /api/chatrooms/:id` - Update chatroom
- `DELETE /api/chatrooms/:id` - Delete chatroom

### Messages
- `GET /api/chatrooms/:chatroomId/messages` - Get all messages
- `POST /api/chatrooms/:chatroomId/messages` - Send a message
- `DELETE /api/chatrooms/:chatroomId/messages/:messageId` - Delete a message

## WebSocket Events

### Client → Server
- `joinRoom` - Join a chatroom
- `leaveRoom` - Leave a chatroom
- `sendMessage` - Send a message
- `setUsername` - Set display name

### Server → Client
- `newMessage` - New message received
- `userJoined` - User joined room
- `userLeft` - User left room
- `roomInfo` - Room information
