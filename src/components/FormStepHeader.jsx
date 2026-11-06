export default function FormStepHeader({ step, title }) {
  return (
    <div className="mb-6">
      <p className="text-sm text-slate-500">Step {step}</p>
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
    </div>
  )
}
