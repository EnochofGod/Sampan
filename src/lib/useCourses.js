import { useCallback, useEffect, useState } from 'react'
import { fetchCourses } from './api'
import { mergeWithLocal, normalizeCourses } from './catalog'
import localCourses from '../data/courses'

export function useCourses({ includeInactive = false } = {}) {
  const [courses, setCourses] = useState(() => normalizeCourses(localCourses))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [source, setSource] = useState('local')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const remote = await fetchCourses()
      setCourses(mergeWithLocal(remote))
      setSource('remote')
    } catch (err) {
      setCourses(normalizeCourses(localCourses))
      setSource('local')
      setError(err?.message || 'Unable to load live courses.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional initial catalog fetch
    void refresh()
  }, [refresh])

  const visible = includeInactive ? courses : courses.filter((c) => c.status !== 'Inactive')

  return { courses: visible, allCourses: courses, loading, error, source, refresh, setCourses }
}
