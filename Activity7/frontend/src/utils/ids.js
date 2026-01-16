export function createId(prefix) {
  const rand = Math.random().toString(16).slice(2, 8)
  return `${prefix}-${Date.now()}-${rand}`
}
