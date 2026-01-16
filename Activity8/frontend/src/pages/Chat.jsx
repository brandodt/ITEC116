import { useState, useEffect, useRef } from 'react'
import { Send, ArrowLeft, User, Clock, MessageSquare } from 'react-feather'
import Badge from '../components/Badge.jsx'

export default function Chat({
  room,
  messages,
  onSendMessage,
  onLeaveRoom,
  username,
  onSetUsername,
  isConnected,
}) {
  const [newMessage, setNewMessage] = useState('')
  const [tempUsername, setTempUsername] = useState(username || '')
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !username) return
    onSendMessage({ content: newMessage.trim(), sender: username })
    setNewMessage('')
  }

  const handleSetUsername = (e) => {
    e.preventDefault()
    if (!tempUsername.trim()) return
    onSetUsername(tempUsername.trim())
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    }
    return date.toLocaleDateString()
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.createdAt)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {})

  if (!room) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-gray-400">
          <p>No room selected</p>
          <p className="text-sm mt-2">Select a room from the Chat Rooms tab</p>
        </div>
      </div>
    )
  }

  // Username prompt
  if (!username) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <div className="bg-[#151515] border border-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <User size={22} className="text-blue-500" />
            Enter Your Name
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Choose a display name to join the chat room "{room.name}"
          </p>
          <form onSubmit={handleSetUsername} className="space-y-4">
            <input
              type="text"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              placeholder="Your display name"
              className="w-full bg-[#0a0a0a] text-gray-200 py-2 px-3 rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />
            <button
              type="submit"
              disabled={!tempUsername.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Join Chat
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-w-5xl mx-auto">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-[#151515] to-[#1a1a1a] border border-gray-800 rounded-t-xl p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onLeaveRoom}
            className="p-2 rounded-lg hover:bg-red-600/20 text-gray-400 hover:text-red-400 transition-all hover:scale-110"
            title="Leave room"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
              {room.name}
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30">Active</span>
            </h3>
            {room.description && (
              <p className="text-sm text-gray-500">{room.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone={isConnected ? 'success' : 'danger'}>
            <span className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </Badge>
          <div className="px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-gray-800 flex items-center gap-2">
            <User size={14} className="text-blue-500" />
            <span className="text-sm text-gray-200 font-medium">{username}</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 bg-gradient-to-b from-[#0a0a0a] to-[#050505] border-x border-gray-800 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-800">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-3">
            <div className="p-4 rounded-full bg-gray-800/30 border border-gray-700">
              <MessageSquare size={32} className="text-gray-600" />
            </div>
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="space-y-3">
              {/* Date divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
                <div className="px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700 backdrop-blur-sm">
                  <span className="text-xs text-gray-400 flex items-center gap-1.5 font-medium">
                    <Clock size={12} />
                    {date}
                  </span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
              </div>

              {/* Messages for this date */}
              {dateMessages.map((msg, index) => {
                const isOwnMessage = msg.sender === username
                return (
                  <div
                    key={msg._id || index}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                  >
                    <div
                      className={`group max-w-[75%] sm:max-w-[60%] rounded-2xl p-3.5 shadow-lg transition-all hover:scale-[1.02] ${
                        isOwnMessage
                          ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-br-md shadow-blue-500/30'
                          : 'bg-gradient-to-br from-[#1a1a1a] to-[#151515] border border-gray-800 text-gray-200 rounded-bl-md'
                      }`}
                    >
                      {!isOwnMessage && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                            {msg.sender.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs text-blue-400 font-semibold">
                            {msg.sender}
                          </span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                      <div
                        className={`flex items-center gap-1 text-xs mt-2 ${
                          isOwnMessage ? 'text-blue-100 justify-end' : 'text-gray-500 justify-start'
                        }`}
                      >
                        <Clock size={10} />
                        <span>{formatTime(msg.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-r from-[#151515] to-[#1a1a1a] border border-gray-800 rounded-b-xl p-4 shadow-lg"
      >
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-[#0a0a0a] text-gray-200 py-3 px-4 rounded-xl border border-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-600"
            disabled={!isConnected}
            autoFocus
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !isConnected}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95"
          >
            <Send size={18} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        {!isConnected && (
          <div className="flex items-center gap-2 mt-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse"></div>
            <span>Disconnected from server. Trying to reconnect...</span>
          </div>
        )}
      </form>
    </div>
  )
}
