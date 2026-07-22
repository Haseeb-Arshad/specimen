import { SectionHeader } from '../SectionHeader'
import type { DesignTokens } from '#/lib/tokens'

export function StyleIdentity({ style }: { style: DesignTokens['style'] }) {
  const name = style?.name?.trim()
  if (!name) return null

  return (
    <section className="specimen-section">
      <SectionHeader number="01" title="Style Identity" />
      <div className="style-card">
        <h3 className="style-name">{name}</h3>
        {style?.description ? <p className="style-description">{style.description}</p> : null}
        {style?.keywords && style.keywords.length > 0 ? (
          <ul className="style-keywords">
            {style.keywords.map((kw) => (
              <li key={kw} className="style-keyword mono">
                {kw}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
