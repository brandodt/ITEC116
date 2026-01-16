import { Calendar, Clipboard, Layers, Users as UsersIcon } from 'react-feather'
import StatCard from '../components/StatCard.jsx'
import Badge from '../components/Badge.jsx'
import { formatDueLabel, isOverdue } from '../utils/dates.js'

export default function Dashboard({
  stats,
  upcomingTasks,
  projectsById,
  usersById,
  onGoTo,
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-dark-text mb-4">Dashboard</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Projects"
            value={stats.projectCount}
            subtitle="Active projects"
            accent="blue"
          />
          <StatCard
            title="Users"
            value={stats.userCount}
            subtitle="Team members"
            accent="green"
          />
          <StatCard
            title="Tasks"
            value={stats.taskCount}
            subtitle="All tasks"
            accent="blue"
          />
          <StatCard
            title="Overdue"
            value={stats.overdueCount}
            subtitle={`${stats.dueSoonCount} due soon`}
            accent={stats.overdueCount > 0 ? 'red' : 'green'}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick links */}
        <div className="bg-dark-secondary border border-dark-border rounded-lg p-4 shadow-lg">
          <h3 className="text-lg font-semibold text-dark-text mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onGoTo?.('projects')}
              className="inline-flex items-center gap-2 bg-[#00a2ff] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Layers size={16} />
              Manage Projects
            </button>
            <button
              onClick={() => onGoTo?.('tasks')}
              className="inline-flex items-center gap-2 bg-dark-card border border-dark-border text-white px-4 py-2 rounded-lg hover:bg-[#00a2ff]/80 hover:border-[#00a2ff]/80 transition-colors"
            >
              <Clipboard size={16} />
              View Tasks
            </button>
            <button
              onClick={() => onGoTo?.('users')}
              className="inline-flex items-center gap-2 bg-dark-card border border-dark-border text-white px-4 py-2 rounded-lg hover:bg-[#00a2ff]/80 hover:border-[#00a2ff]/80 transition-colors"
            >
              <UsersIcon size={16} />
              Manage Users
            </button>
          </div>
        </div>

        {/* Upcoming deadlines */}
        <div className="bg-dark-secondary border border-dark-border rounded-lg p-4 shadow-lg">
          <h3 className="text-lg font-semibold text-dark-text mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-[#00a2ff]" />
            Upcoming Deadlines
          </h3>
          {upcomingTasks.length === 0 ? (
            <p className="text-gray-400 text-sm">No tasks with deadlines.</p>
          ) : (
            <ul className="space-y-3 max-h-64 overflow-auto pr-1">
              {upcomingTasks.map((t) => {
                const project = projectsById?.get(t.projectId)
                const user = usersById?.get(t.assigneeUserId)
                const overdue = isOverdue(t)
                return (
                  <li
                    key={t.id}
                    className="flex flex-col gap-1 border-b border-dark-border pb-2 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-dark-text font-medium truncate">
                        {t.title}
                      </span>
                      <Badge tone={overdue ? 'danger' : t.status === 'done' ? 'success' : 'neutral'}>
                        {t.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{project?.name || 'No project'}</span>
                      <span className={overdue ? 'text-red-400' : ''}>
                        {formatDueLabel(t)}
                      </span>
                    </div>
                    {user && (
                      <span className="text-xs text-gray-500">Assigned: {user.name}</span>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
