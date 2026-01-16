import { useState } from 'react'

export default function ChatroomForm({ initialData, onSubmit, onCancel }) {
  const [name, setName] = useState(initialData?.name || '')
  const [description, setDescription] = useState(initialData?.description || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), description: description.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Room Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter room name"
          className="w-full bg-[#0a0a0a] text-gray-200 py-2 px-3 rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500 transition-colors"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter room description (optional)"
          rows={3}
          className="w-full bg-[#0a0a0a] text-gray-200 py-2 px-3 rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500 transition-colors resize-none"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
        >
          {initialData ? 'Update Room' : 'Create Room'}
        </button>
      </div>
    </form>
  )
}
