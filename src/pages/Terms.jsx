import PageHeader from '../components/ui/PageHeader'

export default function Terms() {
  return (
    <div className="container-page py-10 sm:py-14">
      <PageHeader
        eyebrow="Legal"
        title="Terms of Service"
        description="The terms that apply when you use Sampan Certification Institute services."
      />
      <div className="surface-card mt-8 max-w-3xl p-6 sm:p-8">
        <div className="space-y-5 text-sm leading-7 text-ink-2">
          <p>
            By using Sampan Certification Institute services, you agree to provide accurate information, comply with
            program requirements, and respect applicable policies.
          </p>
          <section>
            <h2 className="text-base font-bold text-ink">Applications</h2>
            <p className="mt-2">
              Application submission does not guarantee acceptance or certification. Decisions are subject to program
              requirements, verification, and institute policies.
            </p>
          </section>
          <section>
            <h2 className="text-base font-bold text-ink">Accuracy of information</h2>
            <p className="mt-2">
              You are responsible for ensuring that information submitted in applications and related communications is
              complete and accurate.
            </p>
          </section>
          <section>
            <h2 className="text-base font-bold text-ink">Program policies</h2>
            <p className="mt-2">
              Certifications, fees, schedules, and requirements may be governed by additional institute policies and
              program-specific terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
