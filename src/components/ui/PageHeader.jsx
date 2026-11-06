export default function PageHeader({ eyebrow, title, description, actions, align = 'left' }) {
  const center = align === 'center'
  return (
    <div className={center ? 'text-center' : 'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'}>
      <div className={center ? 'mx-auto max-w-3xl' : 'max-w-3xl min-w-0'}>
        {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
        <h1 className={eyebrow ? 'section-title' : 'text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl'}>{title}</h1>
        {description ? <p className="section-lead">{description}</p> : null}
      </div>
      {actions ? (
        <div className={`flex w-full flex-wrap gap-2 sm:w-auto ${center ? 'mt-6 justify-center' : ''}`}>{actions}</div>
      ) : null}
    </div>
  )
}