import { useMemo, useState } from 'react'
import { Home, PlusCircle, Edit2, Trash2, MessageSquare, Users } from 'react-feather'
import FormDrawer from '../components/FormDrawer.jsx'
import ChatroomForm from '../components/forms/ChatroomForm.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Badge from '../components/Badge.jsx'

export default function Rooms({ chatrooms, query, actions, onJoinRoom }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const filtered = useMemo(() => {
    const q = (query || '').toLowerCase()
    return chatrooms.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q),
    )
  }, [chatrooms, query])

  const openCreate = () => {
    setEditing(null)
    setDrawerOpen(true)
  }

  const openEdit = (room) => {
    setEditing(room)
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setEditing(null)
  }

  const handleSubmit = (payload) => {
    if (editing) {
      actions.updateChatroom(editing._id, payload)
    } else {
      actions.createChatroom(payload)
    }
    closeDrawer()
  }

  const handleDelete = (room) => {
    if (!window.confirm(`Delete room "${room.name}"? All messages will be lost.`))
      return
    actions.deleteChatroom(room._id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold flex items-center gap-2 text-dark-text">
          <Home className="text-blue-500" size={24} />
          Chat Rooms ({filtered.length})
        </h2>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
        >
          <PlusCircle size={18} />
          New Room
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No chat rooms found"
          description={query ? 'Try a different search term.' : 'Create a room to start chatting.'}
          action={
            !query && (
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
              >
                <PlusCircle size={16} />
                New Room
              </button>
            )
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((room) => (
            <div
              key={room._id}
              className="group bg-gradient-to-br from-[#151515] to-[#0f0f0f] border border-gray-800 rounded-xl p-5 shadow-lg flex flex-col hover:border-blue-500/50 hover:shadow-blue-500/10 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              onClick={() => onJoinRoom(room)}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-600/10 border border-blue-500/20 group-hover:bg-blue-600/20 transition-colors">
                    <MessageSquare size={18} className="text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">
                    {room.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => openEdit(room)}
                    className="p-1.5 rounded-lg hover:bg-blue-600/20 text-gray-400 hover:text-blue-400 transition-all"
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(room)}
                    className="p-1.5 rounded-lg hover:bg-red-600/20 text-gray-400 hover:text-red-400 transition-all"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {room.description && (
                <p className="text-sm text-gray-400 line-clamp-2 mb-4">{room.description}</p>
              )}
              <div className="mt-auto pt-4 border-t border-gray-800/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <div className="p-1 rounded bg-gray-800/50">
                        <MessageSquare size={10} />
                      </div>
                      <span className="font-medium">{room.messageCount || 0}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <div className="p-1 rounded bg-gray-800/50">
                        <Users size={10} />
                      </div>
                      <span className="font-medium">{room.participantCount || 0}</span>
                    </span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-medium group-hover:bg-blue-600 group-hover:text-white transition-all">
                    Join →
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <FormDrawer
        isOpen={drawerOpen}
        title={editing ? 'Edit Room' : 'Create Room'}
        onClose={closeDrawer}
      >
        <ChatroomForm
          initialData={editing}
          onSubmit={handleSubmit}
          onCancel={closeDrawer}
        />
      </FormDrawer>
    </div>
  )
}
