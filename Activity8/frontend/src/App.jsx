import { useEffect, useMemo, useState, useCallback } from 'react'
import { ToastContainer, toast } from 'react-toastify'

import Navigation from './components/Navigation.jsx'
import Rooms from './pages/Rooms.jsx'
import Chat from './pages/Chat.jsx'
import * as Api from './data/Api.js'
import wsService from './data/WebSocketService.js'

const TABS = /** @type {const} */ ({
  rooms: 'rooms',
  chat: 'chat',
})

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS.rooms)
  const [query, setQuery] = useState('')
  const [chatrooms, setChatrooms] = useState([])
  const [messages, setMessages] = useState([])
  const [activeRoom, setActiveRoom] = useState(null)
  const [username, setUsername] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [onlineCount, setOnlineCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch chatrooms on mount
  useEffect(() => {
    fetchChatrooms()
  }, [])

  // WebSocket connection and event handling
  useEffect(() => {
    wsService.connect()

    const unsubConnected = wsService.on('connected', () => {
      setIsConnected(true)
      toast.success('Connected to chat server')
    })

    const unsubDisconnected = wsService.on('disconnected', () => {
      setIsConnected(false)
      toast.warning('Disconnected from chat server')
    })

    const unsubNewMessage = wsService.on('newMessage', (message) => {
      setMessages((prev) => [...prev, message])
    })

    const unsubUserJoined = wsService.on('userJoined', (data) => {
      toast.info(`${data.username} joined the room`)
      setOnlineCount(data.onlineCount || 0)
    })

    const unsubUserLeft = wsService.on('userLeft', (data) => {
      toast.info(`${data.username} left the room`)
      setOnlineCount(data.onlineCount || 0)
    })

    const unsubRoomInfo = wsService.on('roomInfo', (data) => {
      setOnlineCount(data.onlineCount || 0)
    })

    return () => {
      unsubConnected()
      unsubDisconnected()
      unsubNewMessage()
      unsubUserJoined()
      unsubUserLeft()
      unsubRoomInfo()
      wsService.disconnect()
    }
  }, [])

  const fetchChatrooms = async () => {
    try {
      setLoading(true)
      setError(null)
      const rooms = await Api.getAllChatrooms()
      setChatrooms(rooms)
    } catch (err) {
      console.error('Error fetching chatrooms:', err)
      setError('Could not connect to the backend. Please make sure the server is running.')
      toast.error('Failed to load chatrooms')
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (roomId) => {
    try {
      const msgs = await Api.getMessages(roomId)
      setMessages(msgs)
    } catch (err) {
      console.error('Error fetching messages:', err)
      toast.error('Failed to load messages')
    }
  }

  const handleJoinRoom = useCallback(async (room) => {
    setActiveRoom(room)
    setActiveTab(TABS.chat)
    await fetchMessages(room._id)
    wsService.joinRoom(room._id, username)
  }, [username])

  const handleLeaveRoom = useCallback(() => {
    if (activeRoom) {
      wsService.leaveRoom(activeRoom._id)
    }
    setActiveRoom(null)
    setMessages([])
    setActiveTab(TABS.rooms)
  }, [activeRoom])

  const handleSendMessage = useCallback(async (messageData) => {
    if (!activeRoom) return
    try {
      const newMessage = await Api.sendMessage(activeRoom._id, messageData)
      // Message will be added via WebSocket event
      wsService.sendMessage(activeRoom._id, newMessage)
    } catch (err) {
      console.error('Error sending message:', err)
      toast.error('Failed to send message')
    }
  }, [activeRoom])

  const handleSetUsername = useCallback((name) => {
    setUsername(name)
    if (activeRoom) {
      wsService.send('setUsername', { username: name, roomId: activeRoom._id })
    }
  }, [activeRoom])

  const actions = useMemo(() => ({
    createChatroom: async (payload) => {
      try {
        const newRoom = await Api.createChatroom(payload)
        setChatrooms((prev) => [newRoom, ...prev])
        toast.success('Room created successfully!')
      } catch (err) {
        console.error('Error creating room:', err)
        toast.error('Failed to create room')
      }
    },
    updateChatroom: async (roomId, payload) => {
      try {
        const updated = await Api.updateChatroom(roomId, payload)
        setChatrooms((prev) =>
          prev.map((r) => (r._id === roomId ? updated : r))
        )
        if (activeRoom?._id === roomId) {
          setActiveRoom(updated)
        }
        toast.success('Room updated successfully!')
      } catch (err) {
        console.error('Error updating room:', err)
        toast.error('Failed to update room')
      }
    },
    deleteChatroom: async (roomId) => {
      try {
        await Api.deleteChatroom(roomId)
        setChatrooms((prev) => prev.filter((r) => r._id !== roomId))
        if (activeRoom?._id === roomId) {
          handleLeaveRoom()
        }
        toast.success('Room deleted successfully!')
      } catch (err) {
        console.error('Error deleting room:', err)
        toast.error('Failed to delete room')
      }
    },
  }), [activeRoom, handleLeaveRoom])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading chatrooms...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-gray-200 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-200 mb-2">Connection Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchChatrooms}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeRoom={activeRoom}
        onlineCount={onlineCount}
        onSearch={setQuery}
      />

      <main className="container mx-auto px-4 sm:px-6 py-6">
        {activeTab === TABS.rooms && (
          <Rooms
            chatrooms={chatrooms}
            query={query}
            actions={actions}
            onJoinRoom={handleJoinRoom}
          />
        )}

        {activeTab === TABS.chat && (
          <Chat
            room={activeRoom}
            messages={messages}
            onSendMessage={handleSendMessage}
            onLeaveRoom={handleLeaveRoom}
            username={username}
            onSetUsername={handleSetUsername}
            isConnected={isConnected}
          />
        )}
      </main>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  )
}
