import { seedProjects, seedTasks, seedUsers } from '../data/seed.js'

const STORAGE_KEY = 'activity7-tms-v1'

export function loadState(forceSeed = false) {
  if (forceSeed) {
    return {
      projects: [...seedProjects],
      users: [...seedUsers],
      tasks: [...seedTasks],
    }
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return loadState(true)
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return loadState(true)
    const projects = Array.isArray(parsed.projects) ? parsed.projects : []
    const users = Array.isArray(parsed.users) ? parsed.users : []
    const tasks = Array.isArray(parsed.tasks) ? parsed.tasks : []

    if (projects.length === 0 && users.length === 0 && tasks.length === 0) {
      return loadState(true)
    }

    return { projects, users, tasks }
  } catch {
    return loadState(true)
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}
