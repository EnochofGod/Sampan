import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

const empty = { id: '', title: '', price: '', description: '', status: 'Active' }

export default function CourseFormModal({ open, initial, onClose, onSave, saving }) {
  const [form, setForm] = useState(empty)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => {
      setForm(initial ? { ...empty, ...initial, status: initial.status || 'Active' } : empty)
      setErr('')
    }, 0)
    return () => clearTimeout(t)
  }, [open, initial])

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return setErr('Course title is required.')
    setErr('')
    await onSave({
      ...form,
      id: form.id || form.courseId || undefined,
      courseId: form.courseId || form.id || undefined,
      title: form.title.trim(),
      price: String(form.price ?? '').trim(),
      description: String(form.description ?? '').trim(),
      status: form.status || 'Active',
    })
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center overflow-y-auto bg-ink/35 p-3 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && !saving && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={initial ? 'Edit course' : 'Add course'}
            className="max-h-[calc(100vh-1.5rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-line bg-white p-5 shadow-[0_24px_60px_rgba(36,33,36,0.18)] sm:max-h-[90vh] sm:p-7"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-ink">{initial ? 'Edit course' : 'Add new course'}</h2>
                <p className="mt-1 text-sm text-ink-2">Update course details shown to applicants.</p>
              </div>
              <button type="button" className="btn-ghost -mr-2 -mt-1 px-2.5" onClick={onClose} disabled={saving} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submit} className="mt-5 space-y-4">
              <div>
                <label htmlFor="course-title" className="field-label">Course title</label>
                <input id="course-title" name="title" value={form.title} onChange={change} className="field-input" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="course-price" className="field-label">Price</label>
                  <input id="course-price" name="price" value={form.price} onChange={change} className="field-input" placeholder="$79 or ₦79,000" />
                </div>
                <div>
                  <label htmlFor="course-status" className="field-label">Status</label>
                  <select id="course-status" name="status" value={form.status} onChange={change} className="field-input">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="course-description" className="field-label">Description</label>
                <textarea id="course-description" name="description" value={form.description} onChange={change} className="field-input min-h-[110px]" />
              </div>
              {form.courseId || form.id ? (
                <p className="text-xs text-ink-3">Course ID: <span className="font-medium text-ink-2">{form.courseId || form.id}</span></p>
              ) : null}
              {err ? <p className="text-sm font-medium text-danger">{err}</p> : null}
              <div className="flex flex-col-reverse gap-2 border-t border-line-soft pt-4 sm:flex-row sm:justify-end">
                <button type="button" className="btn-secondary w-full sm:w-auto" onClick={onClose} disabled={saving}>Cancel</button>
                <button type="submit" className="btn-primary w-full sm:w-auto" disabled={saving}>{saving ? 'Saving…' : 'Save course'}</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
