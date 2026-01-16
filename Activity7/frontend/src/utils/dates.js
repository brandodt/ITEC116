function toMidnight(date) {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return null
  d.setHours(0, 0, 0, 0)
  return d
}

export function isOverdue(task) {
  if (!task?.dueDate) return false
  if (task.status === 'done') return false
  const due = toMidnight(task.dueDate)
  if (!due) return false
  const today = toMidnight(new Date())
  return due.getTime() < today.getTime()
}

export function daysUntil(dueDate) {
  const due = toMidnight(dueDate)
  if (!due) return null
  const today = toMidnight(new Date())
  return Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function countOverdue(tasks) {
  return (tasks || []).filter(isOverdue).length
}

export function countDueSoon(tasks, days = 7) {
  return (tasks || []).filter((t) => {
    if (!t?.dueDate) return false
    if (t.status === 'done') return false
    const n = daysUntil(t.dueDate)
    return n !== null && n >= 0 && n <= days
  }).length
}

export function sortTasksByDueDateAsc(tasks) {
  return [...(tasks || [])].sort((a, b) => {
    const ad = a?.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY
    const bd = b?.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY
    return ad - bd
  })
}

export function formatDueLabel(task) {
  if (!task?.dueDate) return 'No deadline'
  const n = daysUntil(task.dueDate)
  if (n === null) return task.dueDate
  if (task.status === 'done') return `Done • ${task.dueDate}`
  if (n < 0) return `Overdue • ${task.dueDate}`
  if (n === 0) return `Due today • ${task.dueDate}`
  if (n === 1) return `Due tomorrow • ${task.dueDate}`
  return `Due in ${n} days • ${task.dueDate}`
}
