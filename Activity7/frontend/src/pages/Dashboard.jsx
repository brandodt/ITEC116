import { Calendar, CheckCircle } from 'react-feather'
import StatCard from '../components/StatCard.jsx'
import Badge from '../components/Badge.jsx'
import { formatDueLabel, isOverdue } from '../utils/dates.js'

export default function Dashboard({
  stats,
  upcomingTasks,
  completedTasks,
  projectsById,
  usersById,
}) {
  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h2 className="text-3xl font-semibold text-gray-200 mb-6">Dashboard</h2>
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
        {/* Upcoming deadlines */}
        <div className="bg-[#151515] border border-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-200 mb-6 flex items-center gap-2">
            <Calendar size={22} className="text-blue-500" />
            Upcoming Deadlines
          </h3>
          {upcomingTasks.length === 0 ? (
            <p className="text-gray-500 text-base">No tasks with deadlines.</p>
          ) : (
            <ul className="space-y-3 max-h-96 overflow-auto pr-1">
              {upcomingTasks.map((t) => {
                const project = projectsById?.get(t.projectId)
                const user = usersById?.get(t.assigneeUserId)
                const overdue = isOverdue(t)
                return (
                  <li
                    key={t._id}
                    className="flex flex-col gap-1 border-b border-gray-800 pb-3 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-base text-gray-200 font-medium truncate">
                        {t.title}
                      </span>
                      <Badge tone={overdue ? 'danger' : t.status === 'done' ? 'success' : 'neutral'}>
                        {t.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{project?.name || 'No project'}</span>
                      <span className={overdue ? 'text-red-400' : ''}>
                        {formatDueLabel(t)}
                      </span>
                    </div>
                    {user && (
                      <span className="text-sm text-gray-600">Assigned: {user.name}</span>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Completed Tasks */}
        <div className="bg-[#151515] border border-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-200 mb-6 flex items-center gap-2">
            <CheckCircle size={22} className="text-green-500" />
            Completed Tasks
          </h3>
          {completedTasks.length === 0 ? (
            <p className="text-gray-500 text-base">No completed tasks yet.</p>
          ) : (
            <ul className="space-y-3 max-h-96 overflow-auto pr-1">
              {completedTasks.map((t) => {
                const project = projectsById?.get(t.projectId)
                const user = usersById?.get(t.assigneeUserId)
                return (
                  <li
                    key={t._id}
                    className="flex flex-col gap-1 border-b border-gray-800 pb-3 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-base text-gray-200 font-medium truncate">
                        {t.title}
                      </span>
                      <Badge tone="success">Done</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{project?.name || 'No project'}</span>
                      {t.dueDate && (
                        <span>{formatDueLabel(t)}</span>
                      )}
                    </div>
                    {user && (
                      <span className="text-sm text-gray-600">Assigned: {user.name}</span>
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
