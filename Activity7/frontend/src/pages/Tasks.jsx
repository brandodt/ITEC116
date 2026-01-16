import { useMemo, useState } from 'react'
import { Clipboard, PlusCircle, Edit2, Trash2 } from 'react-feather'
import FormDrawer from '../components/FormDrawer.jsx'
import TaskForm from '../components/forms/TaskForm.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Badge from '../components/Badge.jsx'
import { formatDueLabel, isOverdue } from '../utils/dates.js'

const statusLabel = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
}

export default function Tasks({ tasks, projects, users, query, actions }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  const projectsById = useMemo(() => {
    const map = new Map()
    for (const p of projects) map.set(p._id, p)
    return map
  }, [projects])

  const usersById = useMemo(() => {
    const map = new Map()
    for (const u of users) map.set(u._id, u)
    return map
  }, [users])

  const filtered = useMemo(() => {
    const q = (query || '').toLowerCase()
    return tasks.filter((t) => {
      const matchQuery =
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
      const matchStatus = filterStatus === 'all' || t.status === filterStatus
      return matchQuery && matchStatus
    })
  }, [tasks, query, filterStatus])

  const openCreate = () => {
    setEditing(null)
    setDrawerOpen(true)
  }
  const openEdit = (t) => {
    setEditing(t)
    setDrawerOpen(true)
  }
  const closeDrawer = () => {
    setDrawerOpen(false)
    setEditing(null)
  }

  const handleSubmit = (payload) => {
    if (editing) {
      actions.updateTask(editing._id, payload)
    } else {
      actions.createTask(payload)
    }
    closeDrawer()
  }

  const handleDelete = (t) => {
    if (!window.confirm(`Delete task "${t.title}"?`)) return
    actions.deleteTask(t._id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2 text-dark-text">
          <Clipboard className="text-blue-500" size={24} />
          Tasks ({filtered.length})
        </h2>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
          >
            <PlusCircle size={18} />
            Add Task
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description={
            query || filterStatus !== 'all'
              ? 'Try adjusting your filters.'
              : 'Create a task to get started.'
          }
          action={
            !query &&
            filterStatus === 'all' && (
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
              >
                <PlusCircle size={16} />
                New Task
              </button>
            )
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => {
            const project = projectsById.get(t.projectId)
            const user = usersById.get(t.assigneeUserId)
            const overdue = isOverdue(t)
            const statusTone =
              t.status === 'done' ? 'success' : t.status === 'in_progress' ? 'warning' : 'neutral'

            return (
              <div
                key={t._id}
                className="bg-[#151515] border border-gray-800 rounded-lg p-4 shadow-lg flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-dark-text">{t.title}</h3>
                    <Badge tone={statusTone}>{statusLabel[t.status] || t.status}</Badge>
                    {overdue && <Badge tone="danger">Overdue</Badge>}
                  </div>
                  {t.description && (
                    <p className="text-sm text-gray-400 line-clamp-2">{t.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-1">
                    {project && <span>📂 {project.name}</span>}
                    {user && <span>👤 {user.name}</span>}
                    <span className={overdue ? 'text-red-400' : ''}>{formatDueLabel(t)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(t)}
                    className="p-2 rounded hover:bg-[#0a0a0a] text-gray-400 hover:text-gray-200"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(t)}
                    className="p-2 rounded hover:bg-[#0a0a0a] text-red-400 hover:text-red-300"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <FormDrawer
        isOpen={drawerOpen}
        title={editing ? 'Edit Task' : 'Add Task'}
        onClose={closeDrawer}
      >
        <TaskForm
          initialTask={editing}
          projects={projects}
          users={users}
          onCancel={closeDrawer}
          onSubmit={handleSubmit}
        />
      </FormDrawer>
    </div>
  )
}
