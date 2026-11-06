import { useState } from 'react'
import { Search } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import StatusMessage from '../components/ui/StatusMessage'

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbw2f8SEWLaBj2xIlZxgvi7a0s49MeGswwgiVftPUgQVsgdsO6aYHXJyI7h9qmCVYNvxnQ/exec'

export default function Status() {
  const [id, setId] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const check = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?id=${encodeURIComponent(id)}`)
      const data = await res.json()
      if (data && data.error) {
        setError(typeof data.error === 'string' ? data.error : 'Unable to find that application.')
      } else {
        setResult(data)
      }
    } catch {
      setError('Lookup failed. Please check the application ID and try again.')
    } finally {
      setLoading(false)
    }
  }

  const statusLabel = result && (result.applicationStatus || result.status)
  const tone =
    statusLabel === 'Approved' ? 'success' : statusLabel === 'Rejected' ? 'error' : statusLabel ? 'warning' : 'info'

  return (
    <div className="container-page py-10 sm:py-14">
      <PageHeader
        eyebrow="Application status"
        title="Track your application"
        description="Enter your application ID to view the latest status information."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="min-w-0 space-y-4">
          <div className="surface-card p-5 sm:p-8">
            <form onSubmit={check} className="space-y-4">
              <div>
                <label htmlFor="appId" className="field-label">Application ID</label>
                <div className="relative">
                  <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
                  <input
                    id="appId"
                    className="field-input pl-10"
                    placeholder="Enter application ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full sm:w-auto" disabled={loading || !id.trim()}>
                {loading ? 'Checking…' : 'Check status'}
              </button>
            </form>
          </div>

          {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}

          {result ? (
            <div className="surface-card p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-base font-bold text-ink">Status details</h2>
                {statusLabel ? (
                  <span className={`badge ${tone === 'success' ? 'badge-success' : tone === 'error' ? 'badge-danger' : 'badge-warning'}`}>
                    {statusLabel}
                  </span>
                ) : null}
              </div>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                {Object.entries(result).map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-line-soft bg-surface px-4 py-3">
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-3">{k}</dt>
                    <dd className="mt-1 break-words text-sm font-medium text-ink">{String(v ?? '')}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>

        <aside className="surface-card p-6">
          <h2 className="text-sm font-bold text-ink">Need help?</h2>
          <p className="mt-2 text-sm leading-6 text-ink-2">
            Use the application ID you received when you submitted your form. If you cannot locate it, submit a new
            application or contact the institute for assistance.
          </p>
        </aside>
      </div>
    </div>
  )
}
