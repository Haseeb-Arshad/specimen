import { SectionHeader } from '../SectionHeader'

type CssPanelProps = {
  css?: string
  onCopy: (value: string) => void
}

export function CssPanel({ css, onCopy }: CssPanelProps) {
  if (!css || !css.trim()) return null

  return (
    <section className="specimen-section">
      <SectionHeader number="06" title="Ready-to-Paste CSS" />
      <div className="css-panel">
        <button type="button" className="btn btn-ghost small css-panel-copy" onClick={() => onCopy(css)}>
          Copy all
        </button>
        <pre className="css-panel-pre mono">{css}</pre>
      </div>
    </section>
  )
}
