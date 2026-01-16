import { useState } from 'react'

export default function UserForm({ initialUser = null, onCancel, onSubmit }) {
  const [name, setName] = useState(initialUser?.name || '')
  const [email, setEmail] = useState(initialUser?.email || '')
  const [role, setRole] = useState(initialUser?.role || '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Name is required.')
      return
    }

    const payload = {
      name: name.trim(),
      email: email.trim() || undefined,
      role: role.trim() || undefined,
    }

    try {
      setSubmitting(true)
      await onSubmit?.(payload)
    } catch (err) {
      setError(err?.message || 'Failed to save user.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-400 text-sm">{error}</div>}

      <div>
        <label className="block text-sm mb-1">Name</label>
        <input
          className="w-full bg-[#121212] border border-dark-border rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a2ff]"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. John Doe"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Email (optional)</label>
        <input
          type="email"
          className="w-full bg-[#121212] border border-dark-border rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a2ff]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Role (optional)</label>
        <input
          className="w-full bg-[#121212] border border-dark-border rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a2ff]"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. Developer, Manager, QA"
        />
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
          {submitting ? 'Saving...' : initialUser ? 'Save Changes' : 'Add User'}
        </button>
      </div>
    </form>
  )
}
