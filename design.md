# SPECIMEN — Product Identity, UI Spec & Master Prompt Pack

Everything you need to hand to an AI coding agent (Claude Sonnet, etc.) to build this product properly. Copy prompts verbatim, in order.

---

## PART 1 — THE NAME

**Primary name: `Specimen`**
Tagline: *"Every image has design DNA. Extract it."*

Why it works: a specimen is something you put under a microscope and analyze — exactly what this tool does to an image. It sounds like a professional design tool, the .design/.app domains are likely available (specimen.design, getspecimen.app), and "specimen sheet" is already a real term in typography, so designers instantly get it.

**Backup names (in order of strength):**
1. **Pigment** — "Extract the pigment of any design." Warm, memorable, color-first.
2. **Dissect** — aggressive, technical: "Dissect any UI."
3. **Swatchlab** — descriptive and friendly, obvious what it does.
4. **TokenLens** — for a more developer-facing positioning (design tokens).
5. **Chroma DNA** — scientific angle, "the genetic code of a design."

**How it will be known / positioning statement:**
> Specimen is an AI design-token extractor. Upload any image — a UI screenshot, a palette, a poster, a photo — and it returns the complete, copyable design system hiding inside it: exact hex colors, gradients, border-radius, shadows, blur, opacity, icon style, typography, and a ready-to-paste `:root` CSS block.

One-line elevator pitch: **"Screenshot in. Design system out."**

---

## PART 2 — BRAND & UI DESIGN SPEC

Give this whole section to the agent as the design source of truth.

### 2.1 Design concept
The UI itself is a **lab / print-shop specimen sheet**. The metaphor: the user's image is a specimen pinned under glass; the AI is the instrument; the results print out as a labeled spec card — like a Pantone chip sheet crossed with a printer's registration proof. Everything should feel measured, labeled, and precise. No decoration that doesn't carry information.

### 2.2 Color tokens (exact values — do not improvise)
| Token | Value | Use |
|---|---|---|
| `--paper` | `#F5F6F4` | App background (cool lab-paper white) |
| `--ink` | `#181B21` | Primary text, solid buttons, dark code panel |
| `--ink-soft` | `#5A5F6A` | Secondary text, captions |
| `--line` | `#D8DAD5` | Hairline borders, table rules |
| `--reg` | `#2B3FEE` | THE accent. Registration-mark blue. Links, crop marks, active states, section numbers |
| `--reg-soft` | `#E7EAFF` | Accent hover/drag-over fills |
| `--card` | `#FFFFFF` | Card surfaces |

Rule: the blue is used sparingly — crop marks, section numbers, one word in the logo, hover states. Never large blue areas. The extracted colors from the user's image are the real color of the page; the chrome stays neutral so results pop.

### 2.3 Typography
- **Display/UI:** `Archivo` (variable: weight 400–900, width 62–125). Headings are 800–900 weight, slightly extended (110–115% width), UPPERCASE, tight letter-spacing (−0.02em).
- **Data/labels:** `IBM Plex Mono` for hex codes, captions, table keys, dimensions, footnotes. 10.5–12.5px, letter-spacing +0.04–0.08em, uppercase for labels.
- No third font. Personality comes from the heavy extended Archivo vs. tiny mono labels contrast.

### 2.4 Layout & geometry
- Max content width 1120px, centered, 28px side padding (16px on mobile).
- Border-radius: **2px everywhere** (near-square = printed card feel). No pills, no big rounds.
- Borders: 1px `--line` for cards; 1px `--ink` for strong dividers (masthead bottom, section rules).
- Signature element: **registration crop marks** — small blue L-shaped corner marks on the upload zone (like printer's crop marks). This is the brand mark; reuse it in the logo/favicon.

### 2.5 Page structure (top to bottom)
1. **Masthead:** left = logotype "SPECIMEN." (the period in blue), right = mono tag "IMAGE → DESIGN TOKENS · AI EXTRACTION". 1px ink bottom border.
2. **Upload plate (empty state):** dashed 1px border card, blue crop marks in all 4 corners, centered "Drop an image here" (Archivo 800) + "UI screenshot, palette, poster — anything. Click to browse." Drag-over: border and fill turn blue (`--reg` / `--reg-soft`). Keyboard accessible (role=button, Enter/Space).
3. **Specimen strip (image loaded):** 2-column grid (340px preview | flexible text). Preview is framed like a mounted slide: white card, inner 1px border on the image, mono caption below with filename left / "1440 × 900px" right. Right side: short explainer + actions row: solid ink button **"Extract tokens"**, ghost button **"New image"**. Stacks to 1 column under 760px.
4. **Scanning state:** card with rotating mono status lines ("Sampling pixel data…", "Reading color fields…", "Measuring radii + borders…", "Detecting blur, opacity, shadows…", "Classifying visual style…", "Writing CSS variables…") + a 3px sweep progress bar in blue. Respect `prefers-reduced-motion` (bar becomes static full-width).
5. **Results — six numbered sections**, each with header: blue mono number + uppercase title + 1px ink rule:
   - **01 STYLE IDENTITY** — card with big uppercase style name (e.g. "GLASSMORPHISM"), 2–3 sentence description, keyword chips (mono, bordered).
   - **02 COLORS — TAP TO COPY HEX** — auto-fill grid of chips, min 148px. Each chip: 82px swatch, then hex (mono 600), color name, blue uppercase usage label. Hover: lift 2px + soft shadow. Click: copy hex → toast.
   - **03 GRADIENTS — TAP TO COPY CSS** — cards with a 64px live gradient band rendered from the actual CSS value, the CSS string in mono below. Click copies.
   - **04 GEOMETRY, EFFECTS & SURFACES** — key/value table (mono uppercase keys left, values right). Rows: Radius (with a live rounded demo square), Borders, Spacing, each Shadow (live demo square wearing the actual box-shadow; value click-to-copy), Blur, Opacity, Other (glow/grain/shine), Icons.
   - **05 TYPOGRAPHY** — same table style: Display, Body, Weights, Notes.
   - **06 READY-TO-PASTE CSS** — dark ink panel, mono `pre` with the full `:root {}` block, "Copy all" ghost button pinned top-right.
6. **Footer note (mono, tiny):** "Values are the AI's best pixel reading — verify critical brand colors against source."
7. **Toast:** fixed bottom-center ink pill, mono, "Copied #4F46E5", auto-dismiss 1.4s.

### 2.6 Interaction rules
- Every color, gradient, shadow, and the CSS block is click-to-copy. Copying is the core loop — make it effortless.
- Focus-visible: 2px blue outline, 3px offset, on every interactive element.
- Buttons: solid = ink bg → blue on hover; ghost = transparent → ink fill on hover; 1px press-down transform on active.
- Errors: light red panel with plain-language fix ("Analysis failed — try again, or try a smaller crop of the image."). Never blame the user, never be vague.

---

## PART 3 — MASTER PROMPTS (feed to the coding agent in order)

### ⭐ PROMPT 0 — The all-in-one master prompt
Use this single prompt if the agent is strong and you want it built in one shot. Otherwise skip to the staged prompts 1–5.

```
You are building "Specimen" — an AI design-token extractor web app. Single-file React component, default export, no required props, no localStorage (in-memory state only), no <form> tags (use onClick/onChange).

PRODUCT: User uploads any image (UI screenshot, palette, poster). The app sends it to the Anthropic API vision model, which returns a structured JSON of every design token in the image. The app renders the tokens as a beautiful, copyable "specimen sheet."

DESIGN SYSTEM (follow exactly):
- Fonts via Google Fonts @import: Archivo (variable 400–900 weight, 62–125 width) for UI/headings; IBM Plex Mono for all data, labels, hex codes, captions.
- Colors: --paper:#F5F6F4 (bg), --ink:#181B21 (text/buttons/code panel), --ink-soft:#5A5F6A, --line:#D8DAD5 (hairlines), --reg:#2B3FEE (accent: crop marks, section numbers, hovers ONLY — never large areas), --reg-soft:#E7EAFF, --card:#FFFFFF.
- Geometry: 2px border-radius everywhere, 1px borders, 1120px max width, lab/print-shop aesthetic. Signature element: blue L-shaped printer's crop marks on the 4 corners of the upload zone.
- Headings: Archivo 800–900, uppercase, slightly extended, -0.02em tracking. Labels: mono, 10.5–12px, uppercase, +0.05em tracking.

FLOW:
1. Empty state: dashed drop zone with blue crop marks, "Drop an image here", click-to-browse, drag-over turns blue. Accessible (role=button, keyboard).
2. Image loaded: 2-col strip — framed preview with mono caption (filename + WxHpx) | explainer + "Extract tokens" (solid ink) + "New image" (ghost) buttons.
3. Analyzing: card with rotating mono status lines every 1.5s ("Sampling pixel data…", "Reading color fields…", "Measuring radii + borders…", "Detecting blur, opacity, shadows…", "Classifying visual style…", "Writing CSS variables…") + blue sweep bar; static under prefers-reduced-motion.
4. Results: six numbered sections (blue mono number + uppercase title + 1px ink rule):
   01 STYLE IDENTITY — big uppercase style name, description, keyword chips.
   02 COLORS — chip grid (148px min): 82px swatch, hex in mono, name, blue usage label. Click copies hex, toast confirms.
   03 GRADIENTS — live gradient band (64px) rendered from returned CSS + the CSS string; click copies.
   04 GEOMETRY, EFFECTS & SURFACES — k/v table: radius (live demo square), borders, spacing, each shadow (demo square wearing the real box-shadow, click-to-copy), blur, opacity, other effects, icon style.
   05 TYPOGRAPHY — k/v table: display, body, weights, notes.
   06 READY-TO-PASTE CSS — dark panel, mono pre of the full :root block, "Copy all" button top-right.
   Footer note: "Values are the AI's best pixel reading — verify critical brand colors against source."

API INTEGRATION:
- Downscale image client-side via canvas to max 1400px longest side, re-encode JPEG 0.92, take base64 from dataURL.
- POST https://api.anthropic.com/v1/messages, headers {"Content-Type":"application/json"}, body: model "claude-sonnet-4-6", max_tokens 1000, no API key (handled by environment).
- messages: one user turn with an image block {type:"image", source:{type:"base64", media_type:"image/jpeg", data}} + text "Extract every design token from this image. Return ONLY the JSON object."
- system prompt: instruct the model to act as a design-token extraction engine and return ONLY valid JSON (no markdown fences, no commentary) with this exact schema:
  { "style":{"name","description","keywords":[]},
    "colors":[{"name","hex","usage"}],           // 5–12, ordered by visual importance, accurate pixel hex
    "gradients":[{"name","css"}],                 // valid CSS gradient values
    "typography":{"display","body","weights","notes"},
    "geometry":{"border_radius","borders","spacing"},
    "effects":{"shadows":[{"name","css"}],"blur","opacity","other"},
    "icons":{"style","notes"},
    "css_variables":":root{...}" }               // complete ready-to-paste block with ALL tokens
- Parse defensively: strip ```json fences, slice from first "{" to last "}", JSON.parse in try/catch. On failure show error panel: "Analysis failed — try again, or try a smaller crop of the image."

QUALITY FLOOR: responsive to mobile (results grid collapses gracefully, strip stacks under 760px), focus-visible 2px blue outline on all interactive elements, click-to-copy everywhere with a bottom-center toast, no layout shift when results load.
```

### PROMPT 1 — Scaffold & design system
```
Build the shell of "Specimen", an AI design-token extractor. Single-file React, default export, in-memory state only, no <form> tags.
Implement ONLY: (a) the full CSS design system as a <style> block — tokens: --paper:#F5F6F4, --ink:#181B21, --ink-soft:#5A5F6A, --line:#D8DAD5, --reg:#2B3FEE, --reg-soft:#E7EAFF, --card:#FFF; fonts Archivo (display, 800–900 uppercase, -0.02em) + IBM Plex Mono (labels/data, uppercase, +0.05em) via Google Fonts @import; 2px radius, 1px borders, 1120px max width; (b) masthead: "SPECIMEN." wordmark with blue period, mono tag right "IMAGE → DESIGN TOKENS · AI EXTRACTION", 1px ink bottom border; (c) button styles: solid ink (blue on hover) and ghost (ink fill on hover), 1px press transform, blue focus-visible outlines. Lab/print-shop aesthetic — precise, labeled, zero decoration without meaning.
```

### PROMPT 2 — Upload flow
```
Add the upload flow to Specimen. (a) Empty state: dashed-border card with blue L-shaped printer's crop marks absolutely positioned in all four corners (the brand signature), heading "Drop an image here", subline "UI screenshot, palette, poster — anything. Click to browse." Full drag-and-drop + click-to-browse + keyboard (role=button, tabIndex, Enter/Space). Drag-over: border --reg, background --reg-soft. Reject non-images with a friendly error. (b) Loaded state: two-column strip (340px | 1fr, stacks <760px). Left: image mounted like a lab slide — white card, 12px padding, 1px inner border on the img, mono caption row: truncated filename left, natural "W × Hpx" right. Right: one short explainer paragraph + actions: "Extract tokens" (solid) and "New image" (ghost, resets everything).
```

### PROMPT 3 — AI analysis engine
```
Wire Specimen to the Anthropic API. On "Extract tokens": (1) downscale the image via canvas to max 1400px longest side, JPEG 0.92, extract base64; (2) POST https://api.anthropic.com/v1/messages with Content-Type application/json only (no key — environment handles it), body {model:"claude-sonnet-4-6", max_tokens:1000, system: SYSTEM_PROMPT, messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:"image/jpeg",data}},{type:"text",text:"Extract every design token from this image. Return ONLY the JSON object."}]}]}.
SYSTEM_PROMPT must define a design-token extraction engine returning ONLY raw JSON (no fences/commentary) with schema: style{name,description,keywords[]}, colors[{name,hex,usage}] (5–12, ordered by importance, accurate pixel hex), gradients[{name,css}] (valid CSS), typography{display,body,weights,notes}, geometry{border_radius,borders,spacing}, effects{shadows[{name,css}],blur,opacity,other}, icons{style,notes}, css_variables (complete :root block naming every extracted token).
Parse defensively: join text blocks, strip ```json fences, slice first "{" to last "}", try/catch JSON.parse. During the call show a scan card: mono status lines rotating every 1.5s ("Sampling pixel data…","Reading color fields…","Measuring radii + borders…","Detecting blur, opacity, shadows…","Classifying visual style…","Writing CSS variables…") over a 3px blue sweep bar (static full-width under prefers-reduced-motion). Failure → red-tinted panel: "Analysis failed — try again, or try a smaller crop of the image."
```

### PROMPT 4 — Results specimen sheet
```
Render Specimen's results as six numbered sections, each headed by a blue mono number + uppercase Archivo title over a 1px ink rule:
01 STYLE IDENTITY — card: style name huge/uppercase/extended, description paragraph (max 68ch, --ink-soft), keyword chips (mono 11px, 1px --line border).
02 COLORS — TAP TO COPY HEX — grid auto-fill minmax(148px,1fr): each chip = 82px swatch of the hex, then hex (mono 600), color name (11.5px soft), usage (mono 10px uppercase blue). Hover: translateY(-2px) + soft shadow. Click copies hex → toast "Copied #XXXXXX" bottom-center, auto-dismiss 1.4s.
03 GRADIENTS — TAP TO COPY CSS — cards: 64px band with background set to the returned CSS gradient value, CSS string in 10.5px mono below, click copies.
04 GEOMETRY, EFFECTS & SURFACES — key/value table (--card bg, 1px --line, mono uppercase keys): Radius row with live demo square, Borders, Spacing, one row per shadow with a demo square wearing the actual box-shadow value (click-to-copy), Blur, Opacity, Other, Icons. Omit empty rows entirely.
05 TYPOGRAPHY — same table: Display, Body, Weights, Notes.
06 READY-TO-PASTE CSS — dark --ink panel, mono pre with the full css_variables block, ghost "Copy all" button pinned top-right.
End with mono footnote: "Values are the AI's best pixel reading — verify critical brand colors against source." Every copyable thing must actually copy. Guard all optional fields — never crash on missing keys.
```

### PROMPT 5 — Polish & QA pass
```
Do a final QA pass on Specimen: (1) mobile ≤380px — masthead wraps, strip stacks, chip grid ≥2 columns, code panel scrolls horizontally without breaking layout; (2) accessibility — every interactive element keyboard-reachable with the 2px blue focus-visible outline, toast has role="status", scan card aria-live="polite", all images have alt text; (3) motion — sweep bar and hover lifts disabled under prefers-reduced-motion; (4) resilience — re-analyze works without stale state, "New image" fully resets including the file input value, malformed/partial JSON from the API shows the error panel instead of a blank screen, gradient/shadow values render safely even if slightly invalid CSS; (5) restraint check — remove any decoration that doesn't carry information; the blue accent should appear only in crop marks, section numbers, usage labels, hovers, and the wordmark period. Report what you fixed.
```

---

## PART 4 — FUTURE-VERSION PROMPTS (optional roadmap)

- **Tailwind export:** "Add a 07 section that converts the extracted tokens into a tailwind.config.js `theme.extend` block (colors, borderRadius, boxShadow, fontFamily), same dark panel style, Copy all button."
- **JSON download:** "Add a ghost 'Download tokens.json' button next to Copy all that downloads the raw parsed JSON via a Blob."
- **Compare mode:** "Allow two images side by side; run extraction on both and render a diff table of colors and effects."
- **Live preview:** "Add a 08 section rendering a sample card + button + input styled entirely from the extracted css_variables, so users see the stolen style applied instantly."