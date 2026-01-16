export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-4">
          <Icon size={28} className="text-slate-500" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-4">{description}</p>
      {action}
    </div>
  )
}
