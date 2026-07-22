import { StyleIdentity } from './sections/StyleIdentity'
import { Colors } from './sections/Colors'
import { Gradients } from './sections/Gradients'
import { Geometry } from './sections/Geometry'
import { Typography } from './sections/Typography'
import { CssPanel } from './sections/CssPanel'
import type { DesignTokens } from '#/lib/tokens'

type ResultsSheetProps = {
  tokens: DesignTokens
  onCopy: (value: string) => void
}

export function ResultsSheet({ tokens, onCopy }: ResultsSheetProps) {
  return (
    <div className="results-sheet">
      <StyleIdentity style={tokens.style} />
      <Colors colors={tokens.colors} onCopy={onCopy} />
      <Gradients gradients={tokens.gradients} onCopy={onCopy} />
      <Geometry geometry={tokens.geometry} effects={tokens.effects} icons={tokens.icons} onCopy={onCopy} />
      <Typography typography={tokens.typography} onCopy={onCopy} />
      <CssPanel css={tokens.css_variables} onCopy={onCopy} />

      <p className="results-footnote mono">
        Values are the AI&rsquo;s best pixel reading &mdash; verify critical brand colors against
        source.
      </p>
    </div>
  )
}
