import { BarChart2, Clipboard, Layers, Users } from 'react-feather'

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
  { id: 'projects', label: 'Projects', icon: Layers },
  { id: 'tasks', label: 'Tasks', icon: Clipboard },
  { id: 'users', label: 'Users', icon: Users },
]

export default function Navigation({
  activeTab,
  onTabChange,
  query,
  onQueryChange,
}) {
  return (
    <nav className="bg-[#121212] border-b border-gray-800 py-4 px-6 sticky top-0 z-40">
      <div className="container mx-auto flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
              A7
            </span>
            <div>
              <h1 className="text-2xl font-bold text-blue-500">Task Management</h1>
              <p className="text-xs text-gray-500">Project & Task Management System</p>
            </div>
          </div>

          <div className="relative w-full md:w-[360px]">
            <input
              type="text"
              placeholder="Search projects, users, tasks..."
              value={query}
              onChange={(e) => onQueryChange?.(e.target.value)}
              className="bg-[#0a0a0a] text-gray-200 w-full py-2.5 px-4 rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => {
            const Icon = t.icon
            const active = t.id === activeTab
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onTabChange?.(t.id)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors border ${
                  active
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-transparent border-gray-800 text-gray-300 hover:bg-blue-600/10 hover:border-blue-500 hover:text-blue-400'
                }`}
              >
                <Icon size={16} className={active ? 'text-white' : 'text-gray-400'} />
                {t.label}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
