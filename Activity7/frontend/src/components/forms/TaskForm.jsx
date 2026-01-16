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
      status,
    }

    // Only add optional fields if they have values
    if (description.trim()) payload.description = description.trim()
    if (dueDate) payload.dueDate = dueDate
    if (projectId) payload.projectId = projectId
    if (assigneeUserId) payload.assigneeUserId = assigneeUserId

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
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="text-red-400 text-base">{error}</div>}

      <div>
        <label className="block text-base font-medium mb-2">Task Title</label>
        <input
          className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-gray-100 text-base focus:outline-none focus:border-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Implement login page"
          required
        />
      </div>

      <div>
        <label className="block text-base font-medium mb-2">Description (optional)</label>
        <textarea
          className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-gray-100 text-base focus:outline-none focus:border-blue-500"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task details..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-base font-medium mb-2">Status</label>
          <select
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-gray-100 text-base focus:outline-none focus:border-blue-500"
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
          <label className="block text-base font-medium mb-2">Due Date</label>
          <input
            type="date"
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-gray-100 text-base focus:outline-none focus:border-blue-500 cursor-pointer"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            max="2030-12-31"
          />
        </div>
      </div>

      <div>
        <label className="block text-base font-medium mb-2">Project</label>
        <select
          className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-gray-100 text-base focus:outline-none focus:border-blue-500"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        >
          <option value="">— None —</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-base font-medium mb-2">Assignee</label>
        <select
          className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-gray-100 text-base focus:outline-none focus:border-blue-500"
          value={assigneeUserId}
          onChange={(e) => setAssigneeUserId(e.target.value)}
        >
          <option value="">— Unassigned —</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          className="px-4 py-2 rounded bg-[#151515] text-gray-200 hover:bg-[#1f1f1f] border border-gray-800"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? 'Saving...' : initialTask ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  )
}
