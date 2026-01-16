import { useEffect, useMemo, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'

import Navigation from './components/Navigation.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Projects from './pages/Projects.jsx'
import Tasks from './pages/Tasks.jsx'
import Users from './pages/Users.jsx'
import { createId } from './utils/ids.js'
import { loadState, saveState } from './utils/storage.js'
import {
  countDueSoon,
  countOverdue,
  sortTasksByDueDateAsc,
} from './utils/dates.js'

const TABS = /** @type {const} */ ({
  dashboard: 'dashboard',
  projects: 'projects',
  tasks: 'tasks',
  users: 'users',
})

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS.dashboard)
  const [query, setQuery] = useState('')
  const [state, setState] = useState(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  const projectsById = useMemo(() => {
    const map = new Map()
    for (const p of state.projects) map.set(p.id, p)
    return map
  }, [state.projects])

  const usersById = useMemo(() => {
    const map = new Map()
    for (const u of state.users) map.set(u.id, u)
    return map
  }, [state.users])

  const stats = useMemo(() => {
    return {
      projectCount: state.projects.length,
      userCount: state.users.length,
      taskCount: state.tasks.length,
      overdueCount: countOverdue(state.tasks),
      dueSoonCount: countDueSoon(state.tasks, 7),
    }
  }, [state.projects.length, state.users.length, state.tasks])

  const upcomingTasks = useMemo(() => {
    const tasksWithDue = state.tasks.filter((t) => Boolean(t.dueDate))
    return sortTasksByDueDateAsc(tasksWithDue).slice(0, 8)
  }, [state.tasks])

  const actions = useMemo(() => {
    return {
      // Projects
      createProject: (payload) => {
        const next = {
          id: createId('p'),
          createdAt: new Date().toISOString(),
          ...payload,
        }
        setState((prev) => ({ ...prev, projects: [next, ...prev.projects] }))
        toast.success('Project created (local only).')
      },
      updateProject: (projectId, payload) => {
        setState((prev) => ({
          ...prev,
          projects: prev.projects.map((p) =>
            p.id === projectId ? { ...p, ...payload } : p,
          ),
        }))
        toast.success('Project updated (local only).')
      },
      deleteProject: (projectId) => {
        setState((prev) => ({
          ...prev,
          projects: prev.projects.filter((p) => p.id !== projectId),
          tasks: prev.tasks.map((t) =>
            t.projectId === projectId ? { ...t, projectId: '' } : t,
          ),
        }))
        toast.success('Project deleted (local only).')
      },

      // Users
      createUser: (payload) => {
        const next = {
          id: createId('u'),
          createdAt: new Date().toISOString(),
          ...payload,
        }
        setState((prev) => ({ ...prev, users: [next, ...prev.users] }))
        toast.success('User created (local only).')
      },
      updateUser: (userId, payload) => {
        setState((prev) => ({
          ...prev,
          users: prev.users.map((u) => (u.id === userId ? { ...u, ...payload } : u)),
        }))
        toast.success('User updated (local only).')
      },
      deleteUser: (userId) => {
        setState((prev) => ({
          ...prev,
          users: prev.users.filter((u) => u.id !== userId),
          tasks: prev.tasks.map((t) =>
            t.assigneeUserId === userId ? { ...t, assigneeUserId: '' } : t,
          ),
        }))
        toast.success('User deleted (local only).')
      },

      // Tasks
      createTask: (payload) => {
        const next = {
          id: createId('t'),
          createdAt: new Date().toISOString(),
          status: 'todo',
          ...payload,
        }
        setState((prev) => ({ ...prev, tasks: [next, ...prev.tasks] }))
        toast.success('Task created (local only).')
      },
      updateTask: (taskId, payload) => {
        setState((prev) => ({
          ...prev,
          tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, ...payload } : t)),
        }))
        toast.success('Task updated (local only).')
      },
      deleteTask: (taskId) => {
        setState((prev) => ({
          ...prev,
          tasks: prev.tasks.filter((t) => t.id !== taskId),
        }))
        toast.success('Task deleted (local only).')
      },

      resetDemoData: () => {
        const next = loadState(true)
        setState(next)
        toast.info('Demo data reset.')
      },
    }
  }, [])

  return (
    <div className="min-h-screen bg-dark-primary text-dark-text flex flex-col">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        query={query}
        onQueryChange={setQuery}
        onResetDemo={() => {
          if (!window.confirm('Reset demo data? This clears local changes.')) return
          actions.resetDemoData()
        }}
      />

      <main className="container mx-auto w-full flex-1 px-4 py-6">
        {activeTab === TABS.dashboard && (
          <Dashboard
            stats={stats}
            tasks={state.tasks}
            projectsById={projectsById}
            usersById={usersById}
            upcomingTasks={upcomingTasks}
            onGoTo={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === TABS.projects && (
          <Projects
            projects={state.projects}
            tasks={state.tasks}
            query={query}
            actions={actions}
          />
        )}
        {activeTab === TABS.tasks && (
          <Tasks
            tasks={state.tasks}
            projects={state.projects}
            users={state.users}
            query={query}
            actions={actions}
          />
        )}
        {activeTab === TABS.users && (
          <Users
            users={state.users}
            tasks={state.tasks}
            query={query}
            actions={actions}
          />
        )}
      </main>

      <ToastContainer position="top-center" theme="dark" />
    </div>
  )
}
