export type ColorToken = {
  name: string
  hex: string
  usage: string
}

export type GradientToken = {
  name: string
  css: string
}

export type ShadowToken = {
  name: string
  css: string
}

export type DesignTokens = {
  style?: {
    name?: string
    description?: string
    keywords?: Array<string>
  }
  colors?: Array<ColorToken>
  gradients?: Array<GradientToken>
  typography?: {
    display?: string
    body?: string
    weights?: string
    notes?: string
  }
  geometry?: {
    border_radius?: string
    borders?: string
    spacing?: string
  }
  effects?: {
    shadows?: Array<ShadowToken>
    blur?: string
    opacity?: string
    other?: string
  }
  icons?: {
    style?: string
    notes?: string
  }
  css_variables?: string
}
