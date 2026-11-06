export const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbw2f8SEWLaBj2xIlZxgvi7a0s49MeGswwgiVftPUgQVsgdsO6aYHXJyI7h9qmCVYNvxnQ/exec'

export const ADMIN_KEY = 'SAMPAN_ADMIN_2026'

async function parseJson(res) {
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return { raw: text }
  }
}

function isOk(data) {
  if (!data) return false
  if (data.error) return false
  if (data.status && String(data.status).toLowerCase() === 'error') return false
  return true
}

export async function fetchCourses() {
  const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=getCourses`)
  const data = await parseJson(res)
  if (!res.ok) throw new Error(data?.message || data?.error || 'Failed to load courses')
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.courses)) return data.courses
  if (Array.isArray(data?.data)) return data.data
  if (data?.error || data?.message) throw new Error(data.error || data.message)
  return []
}

export async function saveCourse(courseData, adminKey = ADMIN_KEY) {
  const res = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action: 'saveCourse', adminKey, course: courseData, ...courseData }),
  })
  const data = await parseJson(res)
  if (!res.ok || !isOk(data)) throw new Error(data?.message || data?.error || 'Failed to save course')
  return data
}

export async function deleteCourse(courseId, adminKey = ADMIN_KEY) {
  const res = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action: 'deleteCourse', adminKey, courseId, id: courseId }),
  })
  const data = await parseJson(res)
  if (!res.ok || !isOk(data)) throw new Error(data?.message || data?.error || 'Failed to delete course')
  return data
}
