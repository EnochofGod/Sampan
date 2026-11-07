import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FileText, Send } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import StatusMessage from '../components/ui/StatusMessage'
import { useCourses } from '../lib/useCourses'
import { displayPrice } from '../lib/catalog'

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbw2f8SEWLaBj2xIlZxgvi7a0s49MeGswwgiVftPUgQVsgdsO6aYHXJyI7h9qmCVYNvxnQ/exec'

export default function ApplicationForm() {
  const [params] = useSearchParams()
  const preselected = params.get('course') || ''
  const { courses, loading: coursesLoading } = useCourses()
  const matched = useMemo(
    () => courses.find((c) => c.slug === preselected || c.id === preselected || c.courseId === preselected),
    [courses, preselected],
  )
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    program: matched ? matched.title : '',
    qualification: '',
  })
  const [status, setStatus] = useState({ loading: false, success: null, error: null })

  const selected = courses.find((c) => c.title === formData.program)
  const programValue = formData.program || (matched ? matched.title : '')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ loading: true, success: null, error: null })

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...formData, program: programValue }),
      })

      const result = await response.json()

      if (result.status === 'success' || response.ok) {
        setStatus({ loading: false, success: 'Application submitted successfully. Keep your application details for status tracking.', error: null })
        setFormData({ fullName: '', email: '', phone: '', program: matched ? matched.title : '', qualification: '' })
      } else {
        throw new Error(result.message || 'Submission failed')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
      setStatus({ loading: false, success: null, error: 'Unable to submit your application right now. Please try again.' })
    }
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <PageHeader
        eyebrow="Application"
        title="Submit your application"
        description="Provide your contact details and the program you want to pursue. You can check your application status after submission."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="surface-card min-w-0 p-5 sm:p-8">
          {status.success ? (
            <div className="mb-5">
              <StatusMessage tone="success">{status.success}</StatusMessage>
            </div>
          ) : null}
          {status.error ? (
            <div className="mb-5">
              <StatusMessage tone="error">{status.error}</StatusMessage>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="field-label">Full name</label>
                <input id="fullName" type="text" name="fullName" value={formData.fullName} onChange={handleChange} required autoComplete="name" className="field-input" />
              </div>
              <div>
                <label htmlFor="email" className="field-label">Email address</label>
                <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email" className="field-input" />
              </div>
              <div>
                <label htmlFor="phone" className="field-label">Phone number</label>
                <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} required autoComplete="tel" className="field-input" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="program" className="field-label">Course / program</label>
                <select id="program" name="program" value={programValue} onChange={handleChange} required className="field-input" disabled={coursesLoading}>
                  <option value="">{coursesLoading ? 'Loading programs…' : 'Select a program'}</option>
                  {courses.map((c) => (
                    <option key={c.courseId || c.id} value={c.title}>
                      {c.title}{c.price ? ` — ${displayPrice(c.price)}` : ''}
                    </option>
                  ))}
                </select>
                {!coursesLoading && courses.length === 0 ? (
                  <p className="mt-1.5 text-xs text-ink-3">No active programs are available right now.</p>
                ) : null}
              </div>
              <div className="sm:col-span-2 mt-2">
                <label htmlFor="qualification" className="field-label">Highest qualification</label>
                <select id="qualification" name="qualification" value={formData.qualification} onChange={handleChange} required className="field-input">
                  <option value="">Select qualification</option>
                  <option value="High School">High School</option>
                  <option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
                  <option value="Master's Degree">Master&apos;s Degree</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-line-soft pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-ink-3">By submitting, you confirm the information provided is accurate.</p>
              <button type="submit" disabled={status.loading || courses.length === 0} className="btn-primary w-full sm:w-auto">
                <Send size={16} />
                {status.loading ? 'Submitting…' : 'Submit application'}
              </button>
            </div>
          </form>
        </div>

        <aside className="space-y-4">
          <div className="surface-card p-6">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-burgundy" />
              <h2 className="text-sm font-bold text-ink">Before you submit</h2>
            </div>
            <ul className="mt-4 space-y-2.5 text-sm leading-6 text-ink-2">
              <li>Review the course prerequisites and fees.</li>
              <li>Use an email address you check regularly.</li>
              <li>Keep a record of your submission details for status checks.</li>
            </ul>
          </div>
          {selected || matched ? (
            <div className="rounded-2xl border border-burgundy/15 bg-rose-tint/50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-wine">Selected program</p>
              <p className="mt-2 text-sm font-bold text-ink">{(selected || matched).title}</p>
              <p className="mt-1 text-xs text-ink-2">
                {(selected || matched).duration ? `${(selected || matched).duration} · ` : ''}
                {(selected || matched).level ? `${(selected || matched).level} · ` : ''}
                {displayPrice((selected || matched).price)}
              </p>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  )
}
