import { createServerFn } from '@tanstack/react-start'

const SYSTEM_PROMPT = `You are a design-token extraction engine. You are given an image (a UI screenshot, a palette, a poster, or any visual). Study it as a print-shop color technician would: read exact pixel values, not approximations.

Return ONLY a single raw JSON object. No markdown code fences, no commentary, no leading or trailing text of any kind — the response body must start with "{" and end with "}".

Match this exact schema:
{
  "style": { "name": string, "description": string, "keywords": string[] },
  "colors": [ { "name": string, "hex": string, "usage": string } ],
  "gradients": [ { "name": string, "css": string } ],
  "typography": { "display": string, "body": string, "weights": string, "notes": string },
  "geometry": { "border_radius": string, "borders": string, "spacing": string },
  "effects": { "shadows": [ { "name": string, "css": string } ], "blur": string, "opacity": string, "other": string },
  "icons": { "style": string, "notes": string },
  "css_variables": string
}

Rules:
- "colors": 5 to 12 entries, ordered by visual importance, with accurate pixel-sampled hex values.
- "gradients": only include entries with valid, usable CSS gradient values (e.g. "linear-gradient(...)"). Omit the array or leave it empty if the image has no gradients.
- "effects.shadows": valid CSS box-shadow values. Omit if none are present.
- "css_variables" must be a single complete, ready-to-paste :root { ... } CSS block naming every token extracted above (colors, gradients, radii, shadows, spacing, typography where applicable).
- If a field genuinely does not apply to this image, use an empty string or empty array rather than inventing a value.
- Never wrap the JSON in \`\`\`json fences or any other text.`

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const DEFAULT_MODEL = 'anthropic/claude-sonnet-5'

function extractJson(raw: string): string {
  let text = raw.trim()
  text = text.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1 || end < start) {
    throw new Error('No JSON object found in model response')
  }
  return text.slice(start, end + 1)
}

export const extractTokens = createServerFn({ method: 'POST' })
  .validator((data: { imageBase64: string; mediaType: string }) => {
    if (!data || typeof data.imageBase64 !== 'string' || !data.imageBase64) {
      throw new Error('Missing image data')
    }
    if (typeof data.mediaType !== 'string' || !data.mediaType.startsWith('image/')) {
      throw new Error('Invalid media type')
    }
    return data
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.OPENROUTER_API_KEY

    if (!apiKey) {
      return {
        ok: false as const,
        error: 'Server is missing OPENROUTER_API_KEY. Add it to .env and restart the dev server.',
      }
    }

    const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL

    let response: Response
    try {
      response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://specimen.local',
          'X-Title': 'Specimen',
        },
        body: JSON.stringify({
          model,
          max_tokens: 1536,
          temperature: 0.25,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Extract every design token from this image. Return ONLY the JSON object.' },
                {
                  type: 'image_url',
                  image_url: { url: `data:${data.mediaType};base64,${data.imageBase64}` },
                },
              ],
            },
          ],
        }),
      })
    } catch {
      return { ok: false as const, error: 'Could not reach the AI provider — check your connection and try again.' }
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '')
      return {
        ok: false as const,
        error: `Analysis failed (${response.status}) — try again, or try a smaller crop of the image.`,
        detail: body.slice(0, 500),
      }
    }

    const payload = (await response.json().catch(() => null)) as any
    const rawText: string | undefined = payload?.choices?.[0]?.message?.content

    if (typeof rawText !== 'string' || !rawText.trim()) {
      return { ok: false as const, error: 'Analysis failed — try again, or try a smaller crop of the image.' }
    }

    try {
      const json = extractJson(rawText)
      const tokens = JSON.parse(json)
      return { ok: true as const, tokens }
    } catch {
      return { ok: false as const, error: 'Analysis failed — try again, or try a smaller crop of the image.' }
    }
  })
