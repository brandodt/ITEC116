import { MessageSquare, Users, Home, Search } from 'react-feather'
import { useState } from 'react'

const tabs = [
  { id: 'rooms', label: 'Chat Rooms', icon: Home },
  { id: 'chat', label: 'Active Chat', icon: MessageSquare },
]

export default function Navigation({
  activeTab,
  onTabChange,
  activeRoom,
  onlineCount = 0,
  onSearch,
}) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    onSearch?.(e.target.value)
  }

  return (
    <nav className="bg-gradient-to-r from-[#121212] to-[#1a1a1a] border-b border-gray-800 py-4 px-6 sticky top-0 z-40 backdrop-blur-sm">
      <div className="container mx-auto flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-500/30">
                💬
              </span>
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-[#121212] animate-pulse"></span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Chatroom</h1>
              <p className="text-xs text-gray-500">Real-time Messaging</p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {activeRoom && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-gray-800">
                <MessageSquare size={14} className="text-blue-500" />
                <span className="text-sm text-gray-200 font-medium">{activeRoom.name}</span>
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-gray-800">
              <div className="relative">
                <Users size={14} className="text-green-500" />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              </div>
              <span className="text-sm text-gray-200 font-medium">{onlineCount}</span>
              <span className="text-xs text-gray-500">online</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => {
              const Icon = t.icon
              const active = t.id === activeTab
              const disabled = t.id === 'chat' && !activeRoom
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => !disabled && onTabChange?.(t.id)}
                  disabled={disabled}
                  className={`group inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 border ${
                    active
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                      : disabled
                        ? 'bg-transparent border-gray-800 text-gray-600 cursor-not-allowed opacity-50'
                        : 'bg-transparent border-gray-800 text-gray-300 hover:bg-blue-600/10 hover:border-blue-500 hover:text-blue-400 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10'
                  }`}
                >
                  <Icon size={16} className={`transition-transform duration-200 ${
                    active ? 'text-white' : disabled ? 'text-gray-600' : 'text-gray-400 group-hover:scale-110'
                  }`} />
                  {t.label}
                </button>
              )
            })}
          </div>

          {activeTab === 'rooms' && (
            <div className="relative flex-1 sm:max-w-xs">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search rooms..."
                className="w-full bg-[#0a0a0a] text-gray-200 pl-10 pr-4 py-2 rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
