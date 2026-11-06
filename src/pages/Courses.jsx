import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock3, Search, SlidersHorizontal } from 'lucide-react'
import { useCourses } from '../lib/useCourses'
import { displayPrice } from '../lib/catalog'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'

export default function Courses() {
  const { courses, loading, error } = useCourses()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const cats = useMemo(() => ['All', ...new Set(courses.map((c) => c.category).filter(Boolean))], [courses])
  const filtered = courses.filter(
    (c) => (cat === 'All' || c.category === cat) && c.title.toLowerCase().includes(q.toLowerCase()),
  )

  return (
    <div className="container-page py-10 sm:py-14">
      <PageHeader
        eyebrow="Course catalog"
        title="Find the right certification"
        description="Browse available programs, compare duration and level, and review details before you apply."
      />

      <div className="surface-card mt-8 p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <label className="relative block">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search courses"
              className="field-input pl-10"
              aria-label="Search courses"
            />
          </label>
          <label className="relative block">
            <SlidersHorizontal size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="field-input appearance-none pl-10 pr-8"
              aria-label="Filter by category"
            >
              {cats.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All categories' : c}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-3 text-xs text-ink-3">
          {loading ? 'Loading programs…' : `Showing ${filtered.length} of ${courses.length} programs`}
        </p>
        {error ? <p className="mt-1 text-xs text-warning">Live catalog unavailable; showing local programs.</p> : null}
      </div>

      {filtered.length === 0 && !loading ? (
        <div className="mt-6">
          <EmptyState
            title="No courses match your search"
            description="Try a different keyword or choose another category."
            action={
              <button type="button" className="btn-secondary" onClick={() => { setQ(''); setCat('All') }}>
                Clear filters
              </button>
            }
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {filtered.map((c) => (
            <article key={c.id} className="surface-card flex h-full flex-col p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge badge-brand">{c.category || 'Program'}</span>
                {c.level ? <span className="text-xs font-medium text-ink-3">{c.level}</span> : null}
              </div>
              <h2 className="mt-4 text-lg font-bold tracking-tight text-ink">{c.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-ink-2">{c.description}</p>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line-soft pt-4 text-sm text-ink-2">
                {c.duration ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={14} className="text-ink-3" /> {c.duration}
                  </span>
                ) : null}
                <span className="font-semibold text-ink">{displayPrice(c.price)}</span>
              </div>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Link to={`/courses/${c.slug || c.id}`} className="btn-primary w-full sm:w-auto">
                  View details
                </Link>
                <Link to={`/apply?course=${c.slug || c.id}`} className="btn-secondary w-full sm:w-auto">
                  Apply
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
