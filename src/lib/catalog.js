import localCourses from '../data/courses'

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function normalizeCourse(raw, index = 0) {
  if (!raw || typeof raw !== 'object') return null
  const title = raw.title || raw.name || raw.courseTitle || raw.program || ''
  const id = raw.id || raw.courseId || raw.ID || slugify(title) || `course-${index + 1}`
  const slug = raw.slug || slugify(title) || String(id)
  const statusRaw = raw.status ?? raw.Status ?? raw.active ?? raw.isActive
  let status = 'Active'
  if (typeof statusRaw === 'boolean') status = statusRaw ? 'Active' : 'Inactive'
  else if (statusRaw != null && String(statusRaw).trim()) {
    const s = String(statusRaw).toLowerCase()
    status = s === 'inactive' || s === 'false' || s === '0' || s === 'no' ? 'Inactive' : 'Active'
  }
  const price = raw.price ?? raw.Price ?? raw.fee ?? raw.amount ?? ''
  return {
    ...raw,
    id: String(id),
    courseId: raw.courseId || raw.id || String(id),
    slug,
    title: String(title || 'Untitled course'),
    description: raw.description ?? raw.Description ?? '',
    price: price === 0 || price ? String(price) : '',
    status,
    category: raw.category || raw.Category || 'Program',
    duration: raw.duration || raw.Duration || '',
    level: raw.level || raw.Level || '',
    curriculum: Array.isArray(raw.curriculum) ? raw.curriculum : [],
    prerequisites: Array.isArray(raw.prerequisites) ? raw.prerequisites : [],
    fees: raw.fees || raw.Fees || '',
  }
}

export function normalizeCourses(list) {
  if (!Array.isArray(list)) return []
  return list.map(normalizeCourse).filter(Boolean)
}

export function mergeWithLocal(remote) {
  const normalizedRemote = normalizeCourses(remote)
  if (normalizedRemote.length === 0) return normalizeCourses(localCourses)
  const byKey = new Map()
  normalizeCourses(localCourses).forEach((c) => byKey.set(c.slug || c.id, c))
  normalizedRemote.forEach((c) => {
    const key = c.slug || c.id
    byKey.set(key, { ...(byKey.get(key) || {}), ...c })
  })
  return [...byKey.values()]
}

export function activeCourses(courses) {
  return normalizeCourses(courses).filter((c) => c.status !== 'Inactive')
}

export function displayPrice(value) {
  if (value === null || value === undefined || value === '') return '—'
  const s = String(value).trim()
  if (/[$₦€£]|USD|NGN/i.test(s)) return s
  if (/^\d+(\.\d+)?$/.test(s)) return `$${s}`
  return s
}
