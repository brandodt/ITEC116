import { BarChart2, Clipboard, Layers, RefreshCw, Users } from 'react-feather'

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
  onResetDemo,
}) {
  return (
    <nav className="bg-dark-secondary py-4 px-6 shadow-lg">
      <div className="container mx-auto flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#00a2ff] text-white font-bold">
              A7
            </span>
            <div>
              <h1 className="text-2xl font-bold text-[#00a2ff]">Task Management</h1>
              <p className="text-xs text-gray-400">Static demo CRUD (backend later)</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-[360px]">
              <input
                type="text"
                placeholder="Search projects, users, tasks..."
                value={query}
                onChange={(e) => onQueryChange?.(e.target.value)}
                className="bg-[#1e1e1e] text-dark-text w-full py-2 px-4 rounded-lg border border-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-[#00a2ff] focus:border-transparent"
              />
            </div>

            <button
              type="button"
              onClick={onResetDemo}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-dark-border px-4 py-2 text-sm text-gray-200 hover:bg-dark-card"
              title="Reset demo data"
            >
              <RefreshCw size={16} />
              Reset
            </button>
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
                    ? 'bg-[#00a2ff] border-[#00a2ff] text-white'
                    : 'bg-transparent border-dark-border text-white hover:bg-[#00a2ff]/80 hover:border-[#00a2ff]/80 hover:text-white'
                }`}
              >
                <Icon size={16} className={active ? 'text-white' : 'text-gray-300 group-hover:text-white'} />
                {t.label}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
