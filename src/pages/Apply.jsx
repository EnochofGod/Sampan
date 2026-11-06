import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader'
import StatusMessage from '../components/ui/StatusMessage'

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'

export default function Apply() {
  const [params] = useSearchParams()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: params.get('course') || '',
    experience: '',
  })
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [message, setMessage] = useState('')

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok || data?.error) throw new Error(data?.message || 'Submission failed')
      setStatus('success')
      setMessage('Submitted successfully. We will contact you.')
      setFormData({ name: '', email: '', course: '', experience: '' })
    } catch (err) {
      setStatus('error')
      setMessage(err.message || 'Network error. Please retry.')
    }
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <PageHeader
        eyebrow="Application"
        title="Apply"
        description="Submit your application details below."
      />
      <div className="surface-card mt-8 max-w-2xl p-6 sm:p-8">
        {status === 'success' ? (
          <div className="mb-5">
            <StatusMessage tone="success">{message}</StatusMessage>
          </div>
        ) : null}
        {status === 'error' ? (
          <div className="mb-5">
            <StatusMessage tone="error">{message}</StatusMessage>
          </div>
        ) : null}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="field-label">Full name</label>
            <input id="name" name="name" className="field-input" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="email" className="field-label">Email</label>
            <input id="email" name="email" type="email" className="field-input" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="course" className="field-label">Course</label>
            <input id="course" name="course" className="field-input" value={formData.course} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="experience" className="field-label">Experience</label>
            <textarea id="experience" name="experience" className="field-input min-h-[120px]" value={formData.experience} onChange={handleChange} />
          </div>
          <button type="submit" disabled={status === 'loading'} className="btn-primary w-full sm:w-auto">
            {status === 'loading' ? 'Submitting…' : 'Submit application'}
          </button>
        </form>
      </div>
    </div>
  )
}
