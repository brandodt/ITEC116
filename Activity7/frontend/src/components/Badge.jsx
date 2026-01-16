export default function Badge({ children, tone = 'neutral' }) {
  const cls =
    tone === 'success'
      ? 'bg-green-500/15 text-green-300 border-green-500/30'
      : tone === 'warning'
        ? 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30'
        : tone === 'danger'
          ? 'bg-red-500/15 text-red-300 border-red-500/30'
          : 'bg-gray-500/15 text-gray-200 border-gray-500/30'

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${cls}`}>
      {children}
    </span>
  )
}
