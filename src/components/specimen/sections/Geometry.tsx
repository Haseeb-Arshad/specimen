import type { ReactNode } from 'react'
import { SectionHeader } from '../SectionHeader'
import type { DesignTokens, ShadowToken } from '#/lib/tokens'

type GeometryProps = {
  geometry?: DesignTokens['geometry']
  effects?: DesignTokens['effects']
  icons?: DesignTokens['icons']
  onCopy: (value: string) => void
}

function Row({
  label,
  value,
  demo,
  onCopy,
}: {
  label: string
  value: string
  demo?: ReactNode
  onCopy?: () => void
}) {
  return (
    <div className="kv-row">
      <span className="kv-key mono">{label}</span>
      <span className="kv-value-cell">
        {demo}
        <button
          type="button"
          className={`kv-value${onCopy ? ' kv-value-copyable' : ''} mono`}
          onClick={onCopy}
          disabled={!onCopy}
        >
          {value}
        </button>
      </span>
    </div>
  )
}

export function Geometry({ geometry, effects, icons, onCopy }: GeometryProps) {
  const rows: Array<ReactNode> = []

  if (geometry?.border_radius) {
    rows.push(
      <Row
        key="radius"
        label="Radius"
        value={geometry.border_radius}
        demo={<span className="demo-square" style={{ borderRadius: geometry.border_radius }} />}
        onCopy={() => onCopy(geometry.border_radius!)}
      />,
    )
  }
  if (geometry?.borders) {
    rows.push(<Row key="borders" label="Borders" value={geometry.borders} onCopy={() => onCopy(geometry.borders!)} />)
  }
  if (geometry?.spacing) {
    rows.push(<Row key="spacing" label="Spacing" value={geometry.spacing} onCopy={() => onCopy(geometry.spacing!)} />)
  }

  const shadows = (effects?.shadows ?? []).filter((s: ShadowToken) => s?.css)
  shadows.forEach((shadow, i) => {
    rows.push(
      <Row
        key={`shadow-${i}`}
        label={shadow.name || `Shadow ${i + 1}`}
        value={shadow.css}
        demo={<span className="demo-square" style={{ boxShadow: shadow.css }} />}
        onCopy={() => onCopy(shadow.css)}
      />,
    )
  })

  if (effects?.blur) {
    rows.push(<Row key="blur" label="Blur" value={effects.blur} onCopy={() => onCopy(effects.blur!)} />)
  }
  if (effects?.opacity) {
    rows.push(<Row key="opacity" label="Opacity" value={effects.opacity} onCopy={() => onCopy(effects.opacity!)} />)
  }
  if (effects?.other) {
    rows.push(<Row key="other" label="Other" value={effects.other} onCopy={() => onCopy(effects.other!)} />)
  }
  if (icons?.style || icons?.notes) {
    const value = [icons?.style, icons?.notes].filter(Boolean).join(' — ')
    rows.push(<Row key="icons" label="Icons" value={value} onCopy={() => onCopy(value)} />)
  }

  if (rows.length === 0) return null

  return (
    <section className="specimen-section">
      <SectionHeader number="04" title="Geometry, Effects & Surfaces" />
      <div className="kv-table">{rows}</div>
    </section>
  )
}
