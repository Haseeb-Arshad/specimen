import { SectionHeader } from '../SectionHeader'
import type { ColorToken } from '#/lib/tokens'

type ColorsProps = {
  colors?: Array<ColorToken>
  onCopy: (value: string) => void
}

export function Colors({ colors, onCopy }: ColorsProps) {
  const valid = (colors ?? []).filter((c) => c?.hex)
  if (valid.length === 0) return null

  return (
    <section className="specimen-section">
      <SectionHeader number="02" title="Colors — Tap to Copy Hex" />
      <div className="color-grid">
        {valid.map((color, i) => (
          <button
            type="button"
            key={`${color.hex}-${i}`}
            className="color-chip"
            onClick={() => onCopy(color.hex)}
          >
            <span className="color-swatch" style={{ background: color.hex }} aria-hidden="true" />
            <span className="color-hex mono">{color.hex}</span>
            {color.name ? <span className="color-name">{color.name}</span> : null}
            {color.usage ? <span className="color-usage mono">{color.usage}</span> : null}
          </button>
        ))}
      </div>
    </section>
  )
}
