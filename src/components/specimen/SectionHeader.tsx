type SectionHeaderProps = {
  number: string
  title: string
}

export function SectionHeader({ number, title }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <span className="section-number mono">{number}</span>
      <h2 className="section-title">{title}</h2>
    </div>
  )
}
