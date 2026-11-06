export default function EmptyState({ title, description, action }) {
  return (
    <div className="surface-card p-8 text-center sm:p-10">
      <h3 className="text-base font-bold text-ink">{title}</h3>
      {description ? <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-2">{description}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  )
}