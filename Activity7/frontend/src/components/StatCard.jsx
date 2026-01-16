export default function StatCard({ title, value, subtitle, accent = 'blue' }) {
  const accentClass =
    accent === 'red'
      ? 'text-red-300'
      : accent === 'yellow'
        ? 'text-yellow-300'
        : accent === 'green'
          ? 'text-green-300'
          : 'text-[#00a2ff]'

  return (
    <div className="bg-dark-secondary border border-dark-border rounded-lg p-4 shadow-lg">
      <div className="text-sm text-gray-400">{title}</div>
      <div className={`mt-1 text-3xl font-semibold ${accentClass}`}>{value}</div>
      {subtitle && <div className="mt-1 text-xs text-gray-500">{subtitle}</div>}
    </div>
  )
}
