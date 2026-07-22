# Specimen

*Every image has design DNA. Extract it.*

Upload any image — a UI screenshot, a palette, a poster, a photo — and Specimen
returns the complete, copyable design system hiding inside it: exact hex
colors, gradients, border-radius, shadows, blur, opacity, icon style,
typography, and a ready-to-paste `:root` CSS block.

Built with [TanStack Start](https://tanstack.com/start) (React + Vite + SSR).
Image analysis runs through [OpenRouter](https://openrouter.ai) on a
vision-capable model, called from a server function so the API key never
reaches the browser.

## Setup

```bash
npm install
cp .env.example .env   # then add your OpenRouter key
npm run dev
```

Edit `.env`:

```
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=anthropic/claude-sonnet-5
```

Get a key at [openrouter.ai/keys](https://openrouter.ai/keys). Any
vision-capable model id on OpenRouter works — swap `OPENROUTER_MODEL` to try
others.

Without a key, the app still runs and the upload flow works; clicking
"Extract tokens" shows a clear error until a key is configured.

## History

Every successful extraction is saved to a **History** page (linked from the
masthead) so past specimens can be revisited later — thumbnail, filename,
and the full six-section results sheet, with the same click-to-copy. History
is stored in the browser's `localStorage`, per-device, capped at the most
recent 60 specimens; nothing is sent to a server or shared across devices.
Entries can be deleted individually or cleared all at once.

## Scripts

```bash
npm run dev      # start the dev server on :3000
npm run build    # production build (client + server)
npm run preview  # preview the production build
```

## Structure

- `src/routes/` — file-based routes: `index.tsx` (the extractor),
  `history.tsx` + `history.index.tsx` + `history.$id.tsx` (history list/detail
  layout)
- `src/components/specimen/` — UI pieces (masthead, upload zone, scan card,
  results sections, toast)
- `src/server/extractTokens.ts` — server function that calls OpenRouter and
  defensively parses the returned JSON
- `src/lib/history.ts` — localStorage-backed history CRUD
- `src/styles.css` — the full design-token system (colors, type, geometry)
- `design.md` — the original product/design spec this app was built from
