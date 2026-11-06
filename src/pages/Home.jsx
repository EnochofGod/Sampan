import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react'
import { useCourses } from '../lib/useCourses'
import { displayPrice } from '../lib/catalog'

const benefits = [
  {
    icon: BadgeCheck,
    title: 'Recognized credentials',
    text: 'Programs structured around clear outcomes and assessment standards for professional credibility.',
  },
  {
    icon: Briefcase,
    title: 'Built for working professionals',
    text: 'Focused learning paths that fit demanding schedules without sacrificing depth.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparent process',
    text: 'Apply online, track your application status, and stay informed at every step.',
  },
]

const steps = [
  { icon: BookOpen, title: 'Choose a program', text: 'Review curriculum, prerequisites, and fees in the course catalog.' },
  { icon: ClipboardCheck, title: 'Submit your application', text: 'Complete the online form with your details and selected program.' },
  { icon: CalendarDays, title: 'Track your status', text: 'Use your application ID to check progress whenever you need.' },
]

const faqs = [
  {
    q: 'Who are Sampan programs designed for?',
    a: 'Our certifications are designed for working professionals seeking practical, career-relevant credentials in project management, data, and security.',
  },
  {
    q: 'How do I apply?',
    a: 'Select a course, review its requirements, and submit the online application form. You will receive an application ID for status tracking.',
  },
  {
    q: 'Can I check my application status online?',
    a: 'Yes. Visit the Check Status page and enter the application ID provided during submission.',
  },
]

export default function Home() {
  const { courses, loading } = useCourses()
  const featured = courses.slice(0, 3)

  return (
    <div>
      <section className="border-b border-line bg-gradient-to-b from-white to-surface">
        <div className="container-page py-16 sm:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="section-eyebrow">Sampan Certification Institute</p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                Professional certifications with a clear path forward
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-ink-2 sm:text-lg">
                Accredited programs designed for working professionals. Explore focused courses, apply online, and track
                your application from submission to decision.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link to="/courses" className="btn-primary w-full sm:w-auto">
                  Browse Courses <ArrowRight size={16} />
                </Link>
                <Link to="/apply" className="btn-secondary w-full sm:w-auto">
                  Start Application
                </Link>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { k: 'Focused', v: 'Career-relevant programs' },
                  { k: 'Online', v: 'Simple application flow' },
                  { k: 'Trackable', v: 'Status updates by ID' },
                ].map((item) => (
                  <div key={item.k} className="rounded-xl border border-line-soft bg-white/70 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-burgundy">{item.k}</p>
                    <p className="mt-1 text-sm font-medium text-ink">{item.v}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-tint text-wine">
                  <GraduationCap size={20} />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">Start with the right program</p>
                  <p className="text-sm text-ink-2">Explore curriculum, duration, and fees before you apply.</p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {loading && featured.length === 0 ? (
                  <p className="text-sm text-ink-2">Loading programs…</p>
                ) : featured.length === 0 ? (
                  <p className="text-sm text-ink-2">No active programs are available right now.</p>
                ) : (
                  featured.map((c) => (
                    <Link
                      key={c.id}
                      to={`/courses/${c.slug || c.id}`}
                      className="group flex items-center justify-between rounded-xl border border-line px-4 py-3 transition-colors hover:border-burgundy/20 hover:bg-surface"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">{c.title}</p>
                        <p className="text-xs text-ink-3">
                          {[c.category, c.duration, displayPrice(c.price)].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                      <ChevronRight size={16} className="ml-3 shrink-0 text-ink-3 group-hover:text-burgundy" />
                    </Link>
                  ))
                )}
              </div>
              <Link to="/courses" className="mt-5 inline-flex text-sm font-semibold text-burgundy hover:text-wine">
                View all courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <p className="section-eyebrow">Why Sampan</p>
        <h2 className="section-title">A professional experience, end to end</h2>
        <p className="section-lead">
          Every part of the application journey is designed to be clear, organized, and easy to navigate.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {benefits.map((b) => {
            const Icon = b.icon
            return (
              <div key={b.title} className="surface-card p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-tint text-wine">
                  <Icon size={18} />
                </span>
                <h3 className="mt-4 text-base font-bold text-ink">{b.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-2">{b.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="border-y border-line bg-surface-2/50">
        <div className="container-page py-16 sm:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-eyebrow">Programs</p>
              <h2 className="section-title">Featured certifications</h2>
            </div>
            <Link to="/courses" className="btn-secondary w-fit">
              Browse catalog
            </Link>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {featured.map((c) => (
              <article key={c.id} className="surface-card flex h-full flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <span className="badge badge-brand">{c.category || 'Program'}</span>
                  {c.level ? <span className="text-xs font-medium text-ink-3">{c.level}</span> : null}
                </div>
                <h3 className="mt-4 text-lg font-bold tracking-tight text-ink">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-ink-2">{c.description}</p>
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line-soft pt-4 text-sm text-ink-2">
                  {c.duration ? <span>{c.duration}</span> : null}
                  {c.duration && c.price ? <span className="hidden h-1 w-1 rounded-full bg-line sm:inline-block" /> : null}
                  <span className="font-semibold text-ink">{displayPrice(c.price)}</span>
                </div>
                <Link to={`/courses/${c.slug || c.id}`} className="btn-primary mt-5 w-full">
                  View details
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="section-eyebrow">How it works</p>
            <h2 className="section-title">A simple application process</h2>
            <p className="section-lead">Move from program discovery to submission and tracking with a clear set of steps.</p>
            <Link to="/status" className="btn-secondary mt-6">
              Check application status
            </Link>
          </div>
          <ol className="grid gap-4">
            {steps.map((s, i) => {
              const Icon = s.icon
              return (
                <li key={s.title} className="surface-card flex gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-wine text-sm font-bold text-white">
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Icon size={16} className="text-burgundy" />
                      <h3 className="text-sm font-bold text-ink">{s.title}</h3>
                    </div>
                    <p className="mt-1.5 text-sm leading-6 text-ink-2">{s.text}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      <section className="border-t border-line bg-white">
        <div className="container-page py-16 sm:py-20">
          <p className="section-eyebrow">FAQ</p>
          <h2 className="section-title">Common questions</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-line bg-surface p-6">
                <CircleHelp size={18} className="text-burgundy" />
                <h3 className="mt-3 text-sm font-bold text-ink">{f.q}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-2">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="surface-card mt-10 flex flex-col items-stretch justify-between gap-4 bg-wine p-6 text-white sm:flex-row sm:items-center sm:p-8">
            <div className="min-w-0">
              <h3 className="text-lg font-bold">Ready to take the next step?</h3>
              <p className="mt-1 text-sm text-white/75">Find a program that fits your goals and submit your application online.</p>
            </div>
            <Link to="/apply" className="btn-primary w-full shrink-0 !bg-white !text-wine hover:!bg-rose-tint sm:w-auto">
              Apply now
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
