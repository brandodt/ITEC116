import { useEffect, useMemo, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'

import Navigation from './components/Navigation.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Projects from './pages/Projects.jsx'
import Tasks from './pages/Tasks.jsx'
import Users from './pages/Users.jsx'
import * as Api from './data/Api.js'
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
  const [state, setState] = useState({ projects: [], users: [], tasks: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [projects, users, tasks] = await Promise.all([
        Api.getAllProjects(),
        Api.getAllUsers(),
        Api.getAllTasks(),
      ])
      setState({ projects, users, tasks })
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Could not connect to the backend. Please make sure the server is running.')
      toast.error('Failed to load data from server')
    } finally {
      setLoading(false)
    }
  }

  const projectsById = useMemo(() => {
    const map = new Map()
    for (const p of state.projects) map.set(p._id, p)
    return map
  }, [state.projects])

  const usersById = useMemo(() => {
    const map = new Map()
    for (const u of state.users) map.set(u._id, u)
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
    const tasksWithDue = state.tasks.filter((t) => Boolean(t.dueDate) && t.status !== 'done')
    return sortTasksByDueDateAsc(tasksWithDue).slice(0, 8)
  }, [state.tasks])

  const completedTasks = useMemo(() => {
    return state.tasks.filter((t) => t.status === 'done').slice(0, 8)
  }, [state.tasks])

  const actions = useMemo(() => {
    return {
      // Projects
      createProject: async (payload) => {
        try {
          const newProject = await Api.createProject(payload)
          setState((prev) => ({ ...prev, projects: [newProject, ...prev.projects] }))
          toast.success('Project created successfully!')
        } catch (err) {
          console.error('Error creating project:', err)
          toast.error('Failed to create project')
        }
      },
      updateProject: async (projectId, payload) => {
        try {
          const updated = await Api.updateProject(projectId, payload)
          setState((prev) => ({
            ...prev,
            projects: prev.projects.map((p) =>
              p._id === projectId ? updated : p,
            ),
          }))
          toast.success('Project updated successfully!')
        } catch (err) {
          console.error('Error updating project:', err)
          toast.error('Failed to update project')
        }
      },
      deleteProject: async (projectId) => {
        try {
          await Api.deleteProject(projectId)
          setState((prev) => ({
            ...prev,
            projects: prev.projects.filter((p) => p._id !== projectId),
          }))
          toast.success('Project deleted successfully!')
        } catch (err) {
          console.error('Error deleting project:', err)
          toast.error('Failed to delete project')
        }
      },

      // Users
      createUser: async (payload) => {
        try {
          const newUser = await Api.createUser(payload)
          setState((prev) => ({ ...prev, users: [newUser, ...prev.users] }))
          toast.success('User created successfully!')
        } catch (err) {
          console.error('Error creating user:', err)
          toast.error('Failed to create user')
        }
      },
      updateUser: async (userId, payload) => {
        try {
          const updated = await Api.updateUser(userId, payload)
          setState((prev) => ({
            ...prev,
            users: prev.users.map((u) => (u._id === userId ? updated : u)),
          }))
          toast.success('User updated successfully!')
        } catch (err) {
          console.error('Error updating user:', err)
          toast.error('Failed to update user')
        }
      },
      deleteUser: async (userId) => {
        try {
          await Api.deleteUser(userId)
          setState((prev) => ({
            ...prev,
            users: prev.users.filter((u) => u._id !== userId),
          }))
          toast.success('User deleted successfully!')
        } catch (err) {
          console.error('Error deleting user:', err)
          toast.error('Failed to delete user')
        }
      },

      // Tasks
      createTask: async (payload) => {
        try {
          const newTask = await Api.createTask(payload)
          setState((prev) => ({ ...prev, tasks: [newTask, ...prev.tasks] }))
          toast.success('Task created successfully!')
        } catch (err) {
          console.error('Error creating task:', err)
          toast.error('Failed to create task')
        }
      },
      updateTask: async (taskId, payload) => {
        try {
          const updated = await Api.updateTask(taskId, payload)
          setState((prev) => ({
            ...prev,
            tasks: prev.tasks.map((t) => (t._id === taskId ? updated : t)),
          }))
          toast.success('Task updated successfully!')
        } catch (err) {
          console.error('Error updating task:', err)
          toast.error('Failed to update task')
        }
      },
      deleteTask: async (taskId) => {
        try {
          await Api.deleteTask(taskId)
          setState((prev) => ({
            ...prev,
            tasks: prev.tasks.filter((t) => t._id !== taskId),
          }))
          toast.success('Task deleted successfully!')
        } catch (err) {
          console.error('Error deleting task:', err)
          toast.error('Failed to delete task')
        }
      },

      resetDemoData: () => {
        fetchAllData()
        toast.info('Data refreshed from server')
      },
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading data from server...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 flex flex-col">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        query={query}
        onQueryChange={setQuery}
      />

      {error && (
        <div className="bg-red-900/30 border-l-4 border-red-600 p-4 mx-4 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v4a1 1 0 11-2 0V9zm1-5a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto w-full flex-1 px-4 py-6">
        {activeTab === TABS.dashboard && (
          <Dashboard
            stats={stats}
            tasks={state.tasks}
            projectsById={projectsById}
            usersById={usersById}
            upcomingTasks={upcomingTasks}
            completedTasks={completedTasks}
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
