export const seedProjects = [
  {
    id: 'p-1',
    name: 'Website Redesign',
    description: 'Refresh landing page and improve navigation.',
    createdAt: '2026-01-05T10:00:00.000Z',
  },
  {
    id: 'p-2',
    name: 'Mobile App v2',
    description: 'Add offline mode and performance improvements.',
    createdAt: '2026-01-08T15:30:00.000Z',
  },
]

export const seedUsers = [
  {
    id: 'u-1',
    name: 'Alex Rivera',
    email: 'alex@demo.local',
    role: 'Manager',
    createdAt: '2026-01-02T09:00:00.000Z',
  },
  {
    id: 'u-2',
    name: 'Sam Lee',
    email: 'sam@demo.local',
    role: 'Developer',
    createdAt: '2026-01-03T11:15:00.000Z',
  },
  {
    id: 'u-3',
    name: 'Jamie Cruz',
    email: 'jamie@demo.local',
    role: 'QA',
    createdAt: '2026-01-04T13:45:00.000Z',
  },
]

export const seedTasks = [
  {
    id: 't-1',
    title: 'Create project wireframes',
    description: 'Initial layout and user flow for key pages.',
    status: 'in_progress',
    dueDate: '2026-01-18',
    projectId: 'p-1',
    assigneeUserId: 'u-2',
    createdAt: '2026-01-09T08:00:00.000Z',
  },
  {
    id: 't-2',
    title: 'Set up CI pipeline',
    description: 'Lint + build checks on every push.',
    status: 'todo',
    dueDate: '2026-01-20',
    projectId: 'p-1',
    assigneeUserId: 'u-3',
    createdAt: '2026-01-10T08:30:00.000Z',
  },
  {
    id: 't-3',
    title: 'Offline cache strategy',
    description: 'Define caching rules and storage limits.',
    status: 'todo',
    dueDate: '2026-01-16',
    projectId: 'p-2',
    assigneeUserId: 'u-2',
    createdAt: '2026-01-11T12:00:00.000Z',
  },
  {
    id: 't-4',
    title: 'Regression test plan',
    description: 'Checklist for critical user paths before release.',
    status: 'done',
    dueDate: '2026-01-12',
    projectId: 'p-2',
    assigneeUserId: 'u-3',
    createdAt: '2026-01-06T14:00:00.000Z',
  },
]
