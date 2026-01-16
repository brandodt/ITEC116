import { useMemo, useState } from 'react'
import { Layers, PlusCircle, Edit2, Trash2 } from 'react-feather'
import FormDrawer from '../components/FormDrawer.jsx'
import ProjectForm from '../components/forms/ProjectForm.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function Projects({ projects, tasks, query, actions }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const filtered = useMemo(() => {
    const q = (query || '').toLowerCase()
    return projects.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q),
    )
  }, [projects, query])

  const taskCountByProject = useMemo(() => {
    const map = new Map()
    for (const t of tasks) {
      if (!t.projectId) continue
      map.set(t.projectId, (map.get(t.projectId) || 0) + 1)
    }
    return map
  }, [tasks])

  const openCreate = () => {
    setEditing(null)
    setDrawerOpen(true)
  }
  const openEdit = (p) => {
    setEditing(p)
    setDrawerOpen(true)
  }
  const closeDrawer = () => {
    setDrawerOpen(false)
    setEditing(null)
  }

  const handleSubmit = (payload) => {
    if (editing) {
      actions.updateProject(editing._id, payload)
    } else {
      actions.createProject(payload)
    }
    closeDrawer()
  }

  const handleDelete = (p) => {
    if (!window.confirm(`Delete project "${p.name}"? Related tasks won't be deleted but will become unlinked.`))
      return
    actions.deleteProject(p._id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold flex items-center gap-2 text-dark-text">
          <Layers className="text-blue-500" size={24} />
          Projects ({filtered.length})
        </h2>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
        >
          <PlusCircle size={18} />
          Add Project
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No projects found"
          description={query ? 'Try a different search term.' : 'Create a project to get started.'}
          action={
            !query && (
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
              >
                <PlusCircle size={16} />
                New Project
              </button>
            )
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const taskCount = taskCountByProject.get(p._id) || 0
            return (
              <div
                key={p._id}
                className="bg-[#151515] border border-gray-800 rounded-lg p-4 shadow-lg flex flex-col"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold text-dark-text truncate">{p.name}</h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(p)}
                      className="p-1 rounded hover:bg-[#0a0a0a] text-gray-400 hover:text-gray-200"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      className="p-1 rounded hover:bg-[#0a0a0a] text-red-400 hover:text-red-300"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {p.description && (
                  <p className="mt-2 text-sm text-gray-400 line-clamp-2">{p.description}</p>
                )}
                <div className="mt-auto pt-4 text-xs text-gray-500">
                  {taskCount} task{taskCount !== 1 ? 's' : ''}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <FormDrawer
        isOpen={drawerOpen}
        title={editing ? 'Edit Project' : 'Add Project'}
        onClose={closeDrawer}
      >
        <ProjectForm
          initialProject={editing}
          onCancel={closeDrawer}
          onSubmit={handleSubmit}
        />
      </FormDrawer>
    </div>
  )
}
