interface DispatchHeaderProps {
  refCode: string
  date: string
  desk: string
  /** Override the default "FILED" date label — e.g. "RECORDED" for conversations */
  dateLabel?: string
  /** Override the default "REF" label — e.g. "TRANSCRIPT REF" */
  refLabel?: string
  /** Override the default "DESK" label — e.g. "STATUS" */
  deskLabel?: string
  className?: string
}

export default function DispatchHeader({
  refCode,
  date,
  desk,
  dateLabel = 'FILED',
  refLabel = 'REF',
  deskLabel = 'DESK',
  className,
}: DispatchHeaderProps) {
  return (
    <div className={`border-t border-b border-border py-4 mb-6 ${className ?? ''}`}>
      <p className="font-mono text-[10px] tracking-[0.22em] uppercase leading-none">
        <span className="text-stamp">{refLabel}:</span>
        <span className="text-stamp"> {refCode}</span>
        <span className="text-muted"> · {dateLabel}: {date} · {deskLabel}: {desk}</span>
      </p>
    </div>
  )
}
