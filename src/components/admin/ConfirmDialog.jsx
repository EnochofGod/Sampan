import { AnimatePresence, motion } from 'framer-motion'

export default function ConfirmDialog({ open, title, description, confirmLabel = 'Confirm', tone = 'danger', onConfirm, onClose, busy }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center overflow-y-auto bg-ink/35 p-3 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-label={title}
            className="w-full max-w-md rounded-2xl border border-line bg-white p-5 shadow-[0_24px_60px_rgba(36,33,36,0.18)] sm:p-6"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.16 }}
          >
            <h2 className="text-base font-bold text-ink sm:text-lg">{title}</h2>
            {description ? <p className="mt-2 text-sm leading-6 text-ink-2">{description}</p> : null}
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" className="btn-secondary w-full sm:w-auto" onClick={onClose} disabled={busy}>Cancel</button>
              <button type="button" className={`${tone === 'danger' ? 'btn-danger' : 'btn-primary'} w-full sm:w-auto`} onClick={onConfirm} disabled={busy}>
                {busy ? 'Working…' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
