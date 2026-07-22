import { SectionHeader } from '../SectionHeader'
import type { GradientToken } from '#/lib/tokens'

type GradientsProps = {
  gradients?: Array<GradientToken>
  onCopy: (value: string) => void
}

export function Gradients({ gradients, onCopy }: GradientsProps) {
  const valid = (gradients ?? []).filter((g) => g?.css)
  if (valid.length === 0) return null

  return (
    <section className="specimen-section">
      <SectionHeader number="03" title="Gradients — Tap to Copy CSS" />
      <div className="gradient-grid">
        {valid.map((gradient, i) => (
          <button
            type="button"
            key={`${gradient.name ?? 'gradient'}-${i}`}
            className="gradient-chip"
            onClick={() => onCopy(gradient.css)}
          >
            <span className="gradient-band" style={{ backgroundImage: gradient.css }} aria-hidden="true" />
            {gradient.name ? <span className="gradient-name">{gradient.name}</span> : null}
            <span className="gradient-css mono">{gradient.css}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
