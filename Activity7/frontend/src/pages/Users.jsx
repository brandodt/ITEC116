import { useMemo, useState } from 'react'
import { Users as UsersIcon, PlusCircle, Edit2, Trash2 } from 'react-feather'
import FormDrawer from '../components/FormDrawer.jsx'
import UserForm from '../components/forms/UserForm.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Badge from '../components/Badge.jsx'

export default function Users({ users, tasks, query, actions }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const filtered = useMemo(() => {
    const q = (query || '').toLowerCase()
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q),
    )
  }, [users, query])

  const taskCountByUser = useMemo(() => {
    const map = new Map()
    for (const t of tasks) {
      if (!t.assigneeUserId) continue
      map.set(t.assigneeUserId, (map.get(t.assigneeUserId) || 0) + 1)
    }
    return map
  }, [tasks])

  const openCreate = () => {
    setEditing(null)
    setDrawerOpen(true)
  }
  const openEdit = (u) => {
    setEditing(u)
    setDrawerOpen(true)
  }
  const closeDrawer = () => {
    setDrawerOpen(false)
    setEditing(null)
  }

  const handleSubmit = (payload) => {
    if (editing) {
      actions.updateUser(editing._id, payload)
    } else {
      actions.createUser(payload)
    }
    closeDrawer()
  }

  const handleDelete = (u) => {
    if (
      !window.confirm(
        `Delete user "${u.name}"? Assigned tasks will become unassigned.`,
      )
    )
      return
    actions.deleteUser(u._id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold flex items-center gap-2 text-dark-text">
          <UsersIcon className="text-blue-500" size={24} />
          Users ({filtered.length})
        </h2>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
        >
          <PlusCircle size={18} />
          Add User
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No users found"
          description={query ? 'Try a different search term.' : 'Add a user to get started.'}
          action={
            !query && (
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
              >
                <PlusCircle size={16} />
                New User
              </button>
            )
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((u) => {
            const taskCount = taskCountByUser.get(u._id) || 0
            return (
              <div
                key={u._id}
                className="bg-[#151515] border border-gray-800 rounded-lg p-4 shadow-lg flex flex-col"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-dark-text truncate">{u.name}</h3>
                    {u.email && <p className="text-xs text-gray-400">{u.email}</p>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(u)}
                      className="p-1 rounded hover:bg-[#0a0a0a] text-gray-400 hover:text-gray-200"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(u)}
                      className="p-1 rounded hover:bg-[#0a0a0a] text-red-400 hover:text-red-300"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {u.role && (
                  <div className="mt-2">
                    <Badge tone="neutral">{u.role}</Badge>
                  </div>
                )}
                <div className="mt-auto pt-4 text-xs text-gray-500">
                  {taskCount} assigned task{taskCount !== 1 ? 's' : ''}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <FormDrawer
        isOpen={drawerOpen}
        title={editing ? 'Edit User' : 'Add User'}
        onClose={closeDrawer}
      >
        <UserForm
          initialUser={editing}
          onCancel={closeDrawer}
          onSubmit={handleSubmit}
        />
      </FormDrawer>
    </div>
  )
}
