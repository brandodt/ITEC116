export default function EmptyState({ title, description, action }) {
  return (
    <div className="bg-[#151515] border border-gray-800 rounded-lg p-6 text-center text-gray-300">
      <div className="text-lg font-semibold text-dark-text">{title}</div>
      {description && <div className="mt-2 text-sm text-gray-400">{description}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
