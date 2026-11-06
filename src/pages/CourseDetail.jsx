import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, CheckCircle2, Clock3, DollarSign, GraduationCap } from 'lucide-react'
import { useCourses } from '../lib/useCourses'
import { displayPrice } from '../lib/catalog'

export default function CourseDetail() {
  const { slug } = useParams()
  const { courses, loading } = useCourses({ includeInactive: false })
  const course = courses.find((c) => c.slug === slug || c.id === slug || c.courseId === slug)

  if (loading && !course) {
    return (
      <div className="container-page py-14">
        <div className="surface-card mx-auto max-w-lg p-8 text-center text-sm text-ink-2">Loading course…</div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container-page py-14">
        <div className="surface-card mx-auto max-w-lg p-8 text-center">
          <h1 className="text-xl font-bold text-ink">Course not found</h1>
          <p className="mt-2 text-sm text-ink-2">The course you requested is not available.</p>
          <Link to="/courses" className="btn-primary mt-6">
            Back to courses
          </Link>
        </div>
      </div>
    )
  }

  const curriculum = Array.isArray(course.curriculum) ? course.curriculum : []
  const prerequisites = Array.isArray(course.prerequisites) ? course.prerequisites : []

  return (
    <div className="container-page py-10 sm:py-14">
      <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-2 hover:text-burgundy">
        <ArrowLeft size={16} /> Back to courses
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="min-w-0">
          <div className="surface-card p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge-brand">{course.category || 'Program'}</span>
              {course.level ? <span className="text-xs font-medium text-ink-3">{course.level}</span> : null}
            </div>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl lg:text-4xl">{course.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ink-2 sm:text-lg">{course.description}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-xl border border-line-soft bg-surface px-4 py-3">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-3">
                  <Clock3 size={13} /> Duration
                </p>
                <p className="mt-1 text-sm font-semibold text-ink">{course.duration || '—'}</p>
              </div>
              <div className="rounded-xl border border-line-soft bg-surface px-4 py-3">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-3">
                  <GraduationCap size={13} /> Level
                </p>
                <p className="mt-1 text-sm font-semibold text-ink">{course.level || '—'}</p>
              </div>
              <div className="rounded-xl border border-line-soft bg-surface px-4 py-3">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-3">
                  <DollarSign size={13} /> Tuition
                </p>
                <p className="mt-1 text-sm font-semibold text-ink">{displayPrice(course.price)}</p>
              </div>
            </div>
          </div>

          {curriculum.length || prerequisites.length || course.fees ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {curriculum.length ? (
                <section className="surface-card p-6">
                  <h2 className="flex items-center gap-2 text-base font-bold text-ink">
                    <BookOpen size={18} className="text-burgundy" /> Curriculum
                  </h2>
                  <ul className="mt-4 space-y-2.5">
                    {curriculum.map((x) => (
                      <li key={x} className="flex items-start gap-2.5 text-sm text-ink-2">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-burgundy" />
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
              {prerequisites.length || course.fees ? (
                <section className="surface-card p-6">
                  {prerequisites.length ? (
                    <>
                      <h2 className="text-base font-bold text-ink">Prerequisites</h2>
                      <ul className="mt-4 space-y-2.5">
                        {prerequisites.map((x) => (
                          <li key={x} className="flex items-start gap-2.5 text-sm text-ink-2">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-burgundy/50" />
                            <span>{x}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                  {course.fees ? (
                    <div className={prerequisites.length ? 'mt-6 border-t border-line-soft pt-4' : ''}>
                      <h3 className="text-sm font-bold text-ink">Fees</h3>
                      <p className="mt-1.5 text-sm leading-6 text-ink-2">{course.fees}</p>
                    </div>
                  ) : null}
                </section>
              ) : null}
            </div>
          ) : null}
        </div>

        <aside className="surface-card p-6 lg:sticky lg:top-24">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-3">Ready to apply</p>
          <p className="mt-2 text-lg font-bold text-ink">Enroll in this program</p>
          <p className="mt-2 text-sm leading-6 text-ink-2">
            Submit your application online. You can track your application status after submission.
          </p>
          <Link to={`/apply?course=${course.slug || course.id}`} className="btn-primary mt-5 w-full">
            Apply now
          </Link>
          <Link to="/status" className="btn-secondary mt-2 w-full">
            Check status
          </Link>
        </aside>
      </div>
    </div>
  )
}
