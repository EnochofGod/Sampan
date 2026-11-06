import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutGrid, LogOut, Pencil, Plus, RefreshCw, Shield, TableProperties, Trash2 } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import StatusMessage from '../components/ui/StatusMessage'
import EmptyState from '../components/ui/EmptyState'
import CourseFormModal from '../components/admin/CourseFormModal'
import ConfirmDialog from '../components/admin/ConfirmDialog'
import { ADMIN_KEY, deleteCourse, fetchCourses, saveCourse } from '../lib/api'
import { displayPrice, mergeWithLocal, normalizeCourses } from '../lib/catalog'
import localCourses from '../data/courses'

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbw2f8SEWLaBj2xIlZxgvi7a0s49MeGswwgiVftPUgQVsgdsO6aYHXJyI7h9qmCVYNvxnQ/exec'

export default function Admin() {
  const [authed, setAuthed] = useState(sessionStorage.getItem('sampan_admin_auth') === 'true')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [tab, setTab] = useState('applications')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [actionError, setActionError] = useState('')
  const [courses, setCourses] = useState(() => normalizeCourses(localCourses))
  const [coursesLoading, setCoursesLoading] = useState(false)
  const [courseError, setCourseError] = useState('')
  const [courseNotice, setCourseNotice] = useState('')
  const [courseModal, setCourseModal] = useState({ open: false, initial: null })
  const [courseSaving, setCourseSaving] = useState(false)
  const [confirm, setConfirm] = useState({ open: false, course: null })
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()

  const login = () => {
    if (pass === ADMIN_KEY) {
      sessionStorage.setItem('sampan_admin_auth', 'true')
      setAuthed(true)
      setError('')
    } else {
      setError('Invalid passcode.')
    }
  }

  const logout = () => {
    sessionStorage.removeItem('sampan_admin_auth')
    setAuthed(false)
    navigate('/')
  }

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setActionError('')
    try {
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=getAll&adminKey=${ADMIN_KEY}`)
      const data = await res.json()
      setRows(Array.isArray(data) ? data : [])
    } catch {
      setRows([])
      setActionError('Unable to load applications. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadCourses = useCallback(async () => {
    setCoursesLoading(true)
    setCourseError('')
    try {
      const remote = await fetchCourses()
      setCourses(mergeWithLocal(remote))
    } catch (err) {
      setCourses(normalizeCourses(localCourses))
      setCourseError(err?.message || 'Unable to load live courses. Showing local catalog.')
    } finally {
      setCoursesLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authed) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional initial data load on auth
    void fetchAll()
    void loadCourses()
  }, [authed, fetchAll, loadCourses])

  const updateStatus = async (appId, newStatus) => {
    setActionError('')
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'updateStatus', appId, newStatus, adminKey: ADMIN_KEY }),
      })
      setRows((prev) => prev.map((r) => (r.appId === appId ? { ...r, applicationStatus: newStatus } : r)))
    } catch {
      setActionError('Unable to update status.')
    }
  }

  const onDeleteRow = async (appId) => {
    if (!window.confirm(`Delete ${appId}?`)) return
    setActionError('')
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'deleteApplication', appId, adminKey: ADMIN_KEY }),
      })
      setRows((prev) => prev.filter((r) => r.appId !== appId))
    } catch {
      setActionError('Unable to delete application.')
    }
  }

  const openAddCourse = () => {
    setCourseNotice('')
    setCourseError('')
    setCourseModal({ open: true, initial: null })
  }

  const openEditCourse = (course) => {
    setCourseNotice('')
    setCourseError('')
    setCourseModal({ open: true, initial: course })
  }

  const handleSaveCourse = async (payload) => {
    setCourseSaving(true)
    setCourseError('')
    try {
      await saveCourse(payload, ADMIN_KEY)
      setCourseNotice(payload.courseId || payload.id ? 'Course updated.' : 'Course added.')
      setCourseModal({ open: false, initial: null })
      await loadCourses()
    } catch (err) {
      setCourseError(err?.message || 'Unable to save course.')
    } finally {
      setCourseSaving(false)
    }
  }

  const handleDeleteCourse = async () => {
    const course = confirm.course
    if (!course) return
    setDeleting(true)
    setCourseError('')
    try {
      await deleteCourse(course.courseId || course.id, ADMIN_KEY)
      setCourseNotice('Course deleted.')
      setConfirm({ open: false, course: null })
      await loadCourses()
    } catch (err) {
      setCourseError(err?.message || 'Unable to delete course.')
    } finally {
      setDeleting(false)
    }
  }

  if (!authed) {
    return (
      <div className="fixed inset-0 z-[60] flex items-end justify-center overflow-y-auto bg-ink/35 p-3 backdrop-blur-sm sm:items-center sm:p-4">
        <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-5 shadow-[0_24px_60px_rgba(36,33,36,0.18)] sm:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-tint text-wine">
              <Shield size={18} />
            </span>
            <div>
              <h1 className="text-lg font-bold text-ink">Admin access</h1>
              <p className="text-sm text-ink-2">Enter the passcode to continue.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <label htmlFor="admin-pass" className="sr-only">Admin passcode</label>
            <input
              id="admin-pass"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && login()}
              placeholder="Admin passcode"
              className="field-input"
              autoComplete="current-password"
            />
            {error ? <p className="text-sm font-medium text-danger">{error}</p> : null}
            <button type="button" onClick={login} className="btn-primary w-full">
              Continue
            </button>
          </div>
        </div>
      </div>
    )
  }

  const refresh = tab === 'courses' ? loadCourses : fetchAll
  const refreshing = tab === 'courses' ? coursesLoading : loading

  return (
    <div className="container-page py-10 sm:py-14">
      <PageHeader
        eyebrow="Administration"
        title={tab === 'courses' ? 'Course catalog' : 'Application dashboard'}
        description={
          tab === 'courses'
            ? 'Manage courses and pricing shown on public pages and application forms.'
            : 'Review submitted applications, update status, and manage records.'
        }
        actions={
          <>
            {tab === 'courses' ? (
              <button type="button" onClick={openAddCourse} className="btn-primary">
                <Plus size={16} /> Add new course
              </button>
            ) : null}
            <button type="button" onClick={refresh} className="btn-secondary" disabled={refreshing}>
              <RefreshCw size={16} /> Refresh
            </button>
            <button type="button" onClick={logout} className="btn-ghost">
              <LogOut size={16} /> Logout
            </button>
          </>
        }
      />

      <div className="mt-6 flex w-full flex-col rounded-2xl border border-line bg-white p-1 shadow-[0_1px_2px_rgba(36,33,36,0.04)] sm:inline-flex sm:w-auto sm:flex-row">
        <button
          type="button"
          onClick={() => setTab('applications')}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors sm:w-auto ${tab === 'applications' ? 'bg-rose-tint text-wine' : 'text-ink-2 hover:text-ink'}`}
        >
          <TableProperties size={16} /> Applications
        </button>
        <button
          type="button"
          onClick={() => setTab('courses')}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors sm:w-auto ${tab === 'courses' ? 'bg-rose-tint text-wine' : 'text-ink-2 hover:text-ink'}`}
        >
          <LayoutGrid size={16} /> Course catalog
        </button>
      </div>

      {tab === 'applications' ? (
        <>
          {actionError ? <div className="mt-6"><StatusMessage tone="error">{actionError}</StatusMessage></div> : null}
          <div className="mt-8">
            {loading ? (
              <div className="surface-card p-10 text-center text-sm text-ink-2">Loading applications…</div>
            ) : rows.length === 0 ? (
              <EmptyState title="No applications found" description="New submissions will appear here when available." action={<button type="button" onClick={fetchAll} className="btn-secondary">Refresh</button>} />
            ) : (
              <>
                <div className="space-y-3 md:hidden">
                  {rows.map((r) => (
                    <article key={r.appId} className="surface-card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{r.appId}</p>
                          <p className="mt-1 text-sm font-bold text-ink">{r.fullName}</p>
                          <p className="text-sm text-ink-2">{r.email}</p>
                        </div>
                        <button type="button" onClick={() => onDeleteRow(r.appId)} className="btn-danger shrink-0 px-3 py-2.5" aria-label={`Delete ${r.appId}`}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <p className="mt-3 text-sm text-ink-2">{r.program}</p>
                      <label className="mt-3 block">
                        <span className="field-label">Status</span>
                        <select value={r.applicationStatus} onChange={(e) => updateStatus(r.appId, e.target.value)} className="field-input">
                          <option>Pending</option>
                          <option>Approved</option>
                          <option>Rejected</option>
                        </select>
                      </label>
                    </article>
                  ))}
                </div>
                <div className="surface-card hidden overflow-hidden md:block">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="border-b border-line bg-surface/70">
                        <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-3">
                          <th className="px-4 py-3">ID</th>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Program</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((r) => (
                          <tr key={r.appId} className="border-t border-line-soft align-top">
                            <td className="whitespace-nowrap px-4 py-3 font-medium text-ink">{r.appId}</td>
                            <td className="px-4 py-3 text-ink">{r.fullName}</td>
                            <td className="px-4 py-3 text-ink-2">{r.email}</td>
                            <td className="min-w-[14rem] px-4 py-3 text-ink-2">{r.program}</td>
                            <td className="px-4 py-3">
                              <select value={r.applicationStatus} onChange={(e) => updateStatus(r.appId, e.target.value)} className="field-input min-w-[8.5rem] py-2">
                                <option>Pending</option>
                                <option>Approved</option>
                                <option>Rejected</option>
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <button type="button" onClick={() => onDeleteRow(r.appId)} className="btn-danger w-full whitespace-nowrap sm:w-auto">
                                <Trash2 size={15} /> Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          {courseNotice ? <div className="mt-6"><StatusMessage tone="success">{courseNotice}</StatusMessage></div> : null}
          {courseError ? <div className="mt-6"><StatusMessage tone={courses.length ? 'warning' : 'error'}>{courseError}</StatusMessage></div> : null}
          <div className="mt-8">
            {coursesLoading ? (
              <div className="surface-card p-10 text-center text-sm text-ink-2">Loading courses…</div>
            ) : courses.length === 0 ? (
              <EmptyState title="No courses yet" description="Add a course to make it available on the public site and application form." action={<button type="button" onClick={openAddCourse} className="btn-primary"><Plus size={16} /> Add new course</button>} />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {courses.map((c) => (
                  <article key={c.courseId || c.id} className="surface-card flex h-full flex-col rounded-2xl p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-3">ID: {c.courseId || c.id}</p>
                        <h3 className="mt-1 text-base font-bold tracking-tight text-ink">{c.title}</h3>
                      </div>
                      <span className={`badge shrink-0 ${c.status === 'Inactive' ? 'badge-warning' : 'badge-success'}`}>{c.status || 'Active'}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-wine">{displayPrice(c.price)}</p>
                    <p className="mt-2 flex-1 text-sm leading-6 text-ink-2">{c.description || 'No description provided.'}</p>
                    <div className="mt-5 flex flex-wrap gap-2 border-t border-line-soft pt-4">
                      <button type="button" className="btn-secondary" onClick={() => openEditCourse(c)}>
                        <Pencil size={15} /> Edit
                      </button>
                      <button type="button" className="btn-danger" onClick={() => setConfirm({ open: true, course: c })}>
                        <Trash2 size={15} /> Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <CourseFormModal
        open={courseModal.open}
        initial={courseModal.initial}
        saving={courseSaving}
        onClose={() => !courseSaving && setCourseModal({ open: false, initial: null })}
        onSave={handleSaveCourse}
      />
      <ConfirmDialog
        open={confirm.open}
        title="Delete course?"
        description={confirm.course ? `This will remove “${confirm.course.title}” from the catalog.` : ''}
        confirmLabel="Delete course"
        busy={deleting}
        onClose={() => !deleting && setConfirm({ open: false, course: null })}
        onConfirm={handleDeleteCourse}
      />
    </div>
  )
}
