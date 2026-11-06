import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full border-t border-line bg-white">
      <div className="container-page py-10 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-burgundy text-white">
                <Compass size={16} strokeWidth={2.2} />
              </span>
              <span className="text-sm font-extrabold tracking-tight text-ink sm:text-base">Sampan Certification Institute</span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-6 text-ink-2">
              Accredited professional certification programs designed for working professionals who want clear, credible
              career advancement.
            </p>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-3">Explore</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/courses" className="text-ink-2 hover:text-burgundy">Courses</Link></li>
              <li><Link to="/apply" className="text-ink-2 hover:text-burgundy">Apply</Link></li>
              <li><Link to="/status" className="text-ink-2 hover:text-burgundy">Application Status</Link></li>
              <li><Link to="/admin" className="text-ink-2 hover:text-burgundy">Admin</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-3">Legal</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/privacy" className="text-ink-2 hover:text-burgundy">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-ink-2 hover:text-burgundy">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-line-soft pt-6 text-xs text-ink-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Sampan Certification Institute. All rights reserved.</span>
          <span>Professional certifications, delivered with clarity.</span>
        </div>
      </div>
    </footer>
  )
}
