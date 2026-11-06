import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Compass, Menu, X } from 'lucide-react'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/courses', label: 'Courses' },
  { to: '/status', label: 'Check Status' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur-md">
    
      <div className="container-page flex items-center justify-between gap-3 py-3 sm:gap-4 sm:py-4">
        <Link to="/" className="flex min-w-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-burgundy text-white shadow-[0_1px_2px_rgba(75,13,27,0.2)] sm:h-11 sm:w-11">
            <Compass size={19} strokeWidth={2.2} />
          </span>
          <span className="min-w-0 text-sm font-extrabold leading-tight tracking-tight text-ink sm:text-base lg:text-lg">
            Sampan Certification Institute
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `rounded-xl px-4 py-2.5 text-base font-semibold transition-colors ${
                  isActive ? 'bg-rose-tint text-wine' : 'text-ink-2 hover:bg-surface hover:text-ink'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/apply" className="btn-primary">
            Start Application
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-line bg-white md:hidden">
          <nav className="container-page flex flex-col gap-1 py-3" aria-label="Mobile">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3.5 text-base font-semibold ${
                    isActive ? 'bg-rose-tint text-wine' : 'text-ink-2 hover:bg-surface'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/apply" onClick={() => setOpen(false)} className="btn-primary mt-2 w-full">
              Start Application
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
