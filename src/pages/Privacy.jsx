import PageHeader from '../components/ui/PageHeader'

export default function Privacy() {
  return (
    <div className="container-page py-10 sm:py-14">
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description="How Sampan Certification Institute handles information submitted through this application."
      />
      <div className="surface-card mt-8 max-w-3xl p-6 sm:p-8">
        <div className="space-y-5 text-sm leading-7 text-ink-2">
          <p>
            Sampan Certification Institute respects your privacy. We collect only the information needed to process your
            application and communicate with you about certification services.
          </p>
          <section>
            <h2 className="text-base font-bold text-ink">Information we collect</h2>
            <p className="mt-2">
              When you submit an application or check status, we may collect details such as your name, email address,
              phone number, selected program, qualifications, and application identifiers.
            </p>
          </section>
          <section>
            <h2 className="text-base font-bold text-ink">How we use information</h2>
            <p className="mt-2">
              We use submitted information to review applications, provide status updates, administer programs, and
              communicate service-related information. We do not sell personal data.
            </p>
          </section>
          <section>
            <h2 className="text-base font-bold text-ink">Data handling</h2>
            <p className="mt-2">
              Data is stored and processed through the systems used to operate this application. Access is limited to
              authorized administrative use for certification services.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
