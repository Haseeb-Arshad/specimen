import { SectionHeader } from '../SectionHeader'
import type { DesignTokens } from '#/lib/tokens'

type TypographyProps = {
  typography?: DesignTokens['typography']
  onCopy: (value: string) => void
}

export function Typography({ typography, onCopy }: TypographyProps) {
  const rows: Array<[string, string]> = []
  if (typography?.display) rows.push(['Display', typography.display])
  if (typography?.body) rows.push(['Body', typography.body])
  if (typography?.weights) rows.push(['Weights', typography.weights])
  if (typography?.notes) rows.push(['Notes', typography.notes])

  if (rows.length === 0) return null

  return (
    <section className="specimen-section">
      <SectionHeader number="05" title="Typography" />
      <div className="kv-table">
        {rows.map(([label, value]) => (
          <div className="kv-row" key={label}>
            <span className="kv-key mono">{label}</span>
            <span className="kv-value-cell">
              <button type="button" className="kv-value kv-value-copyable mono" onClick={() => onCopy(value)}>
                {value}
              </button>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
