export default function StatusMessage({ tone = 'info', children }) {
  const tones = {
    success: 'border-success/20 bg-success-bg text-success',
    error: 'border-danger/20 bg-danger-bg text-danger',
    warning: 'border-warning/20 bg-warning-bg text-warning',
    info: 'border-info/20 bg-info-bg text-info',
  }
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${tones[tone] || tones.info}`} role="status">
      {children}
    </div>
  )
}