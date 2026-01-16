import { useState } from 'react'

export default function ProjectForm({ initialProject = null, onCancel, onSubmit }) {
  const [name, setName] = useState(initialProject?.name || '')
  const [description, setDescription] = useState(initialProject?.description || '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Project name is required.')
      return
    }

    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
    }

    try {
      setSubmitting(true)
      await onSubmit?.(payload)
    } catch (err) {
      setError(err?.message || 'Failed to save project.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-400 text-sm">{error}</div>}

      <div>
        <label className="block text-sm mb-1 text-gray-300">Project Name</label>
        <input
          className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-gray-100 focus:outline-none focus:border-blue-500 transition-colors"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Website Redesign"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1 text-gray-300">Description (optional)</label>
        <textarea
          className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-gray-100 focus:outline-none focus:border-blue-500 transition-colors resize-none"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description of the project"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          className="px-4 py-2.5 rounded bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors font-medium"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors font-medium"
          disabled={submitting}
        >
          {submitting ? 'Saving...' : initialProject ? 'Save Changes' : 'Create Project'}
        </button>
      </div>
    </form>
  )
}
