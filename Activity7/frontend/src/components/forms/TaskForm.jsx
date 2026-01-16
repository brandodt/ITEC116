import { useState } from 'react'

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

export default function TaskForm({
  initialTask = null,
  projects = [],
  users = [],
  onCancel,
  onSubmit,
}) {
  const [title, setTitle] = useState(initialTask?.title || '')
  const [description, setDescription] = useState(initialTask?.description || '')
  const [status, setStatus] = useState(initialTask?.status || 'todo')
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || '')
  const [projectId, setProjectId] = useState(initialTask?.projectId || '')
  const [assigneeUserId, setAssigneeUserId] = useState(initialTask?.assigneeUserId || '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError('Task title is required.')
      return
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      dueDate: dueDate || undefined,
      projectId: projectId || undefined,
      assigneeUserId: assigneeUserId || undefined,
    }

    try {
      setSubmitting(true)
      await onSubmit?.(payload)
    } catch (err) {
      setError(err?.message || 'Failed to save task.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-400 text-sm">{error}</div>}

      <div>
        <label className="block text-sm mb-1">Task Title</label>
        <input
          className="w-full bg-[#121212] border border-dark-border rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a2ff]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Implement login page"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Description (optional)</label>
        <textarea
          className="w-full bg-[#121212] border border-dark-border rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a2ff]"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task details..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Status</label>
          <select
            className="w-full bg-[#121212] border border-dark-border rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a2ff]"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Due Date</label>
          <input
            type="date"
            className="w-full bg-[#121212] border border-dark-border rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a2ff]"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Project</label>
        <select
          className="w-full bg-[#121212] border border-dark-border rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a2ff]"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        >
          <option value="">— None —</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">Assignee</label>
        <select
          className="w-full bg-[#121212] border border-dark-border rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a2ff]"
          value={assigneeUserId}
          onChange={(e) => setAssigneeUserId(e.target.value)}
        >
          <option value="">— Unassigned —</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          className="px-4 py-2 rounded bg-[#242424] text-gray-200 hover:bg-[#2c2c2c]"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-[#00a2ff] text-white hover:bg-blue-600 disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? 'Saving...' : initialTask ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  )
}
