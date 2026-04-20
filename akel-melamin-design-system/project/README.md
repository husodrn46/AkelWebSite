# Akel Melamin — Design System

Brand and UI system for **Akel Melamin**, a Turkish manufacturer of melamine tableware serving retailers and distributors in Türkiye and export markets (notably Morocco, Thailand, China, broader North Africa and the Middle East).

> _Akel Melamin, melamin sofra eşyaları üreten bir Türk üreticidir. Türkiye ve yurt dışındaki perakendeci ve distribütörlere hizmet veriyoruz._

The audience is **B2B buyers** — wholesale distributors and retail chains — not end consumers. The design system reflects that: editorial, product-forward, factual. Nothing cartoonish or "value-pack."

---

## Sources

- **Provided:** `uploads/asset_upload-1776690908257.pdf` — a single-page PDF containing only the Akel logo (extracted to `assets/akel-logo.jpg` + transparent `assets/akel-logo.png`).
- **No codebase, Figma, or existing website provided.** The rest of the identity has been built from the brief: Scandinavian industrial aesthetic, grotesk + humanist type pairing, neutral palette with one accent, bilingual TR/EN, B2B-export focused.

⚠️ Because no existing web/app surfaces were given, the UI kit in this system is an **originating design** rather than a recreation. Please sanity-check against any existing Akel materials you have and flag mismatches.

---

## Product context

Akel produces a wide catalog of melamine sofra (tabletop) items. The primary product families:

| TR | EN |
|---|---|
| Yemek takımları | Dinner sets |
| Tepsiler | Serving trays |
| Kaseler | Bowls (soup, salad, serving) |
| Tabaklar | Plates (flat, deep, pasta) |
| Servis ürünleri | Serveware (gravy boats, sugar/salt) |
| Çocuk serisi | Kids' tableware |
| Dekoratif / özel seri | Decorative / special collections |

**B2B considerations baked into the system:**
- Product detail pages surface **carton packaging, pieces per 40'HC container, dimensions in cm, weight** — not lifestyle copy.
- Contact form captures company, country, estimated volume, and Incoterms (FOB/CIF).
- Catalog PDF download uses a soft email-gate (optional, not required).
- Space reserved for compliance logos (examples only, e.g. LFGB / FDA / TSE / ISO 9001) on About + product pages — supply the real ones Akel holds.
- Melamine has an image problem in some markets — the premium minimal aesthetic is a silent rebuttal.

---

## Index

| File / folder | What it is |
|---|---|
| `README.md` | This file. Start here. |
| `SKILL.md` | Agent-skill manifest — load first if you're an AI agent. |
| `colors_and_type.css` | All CSS custom properties: color, type, spacing, radius, shadow, motion. |
| `assets/` | Logos (JPG + transparent PNG), generic imagery placeholders. |
| `preview/` | Individual HTML cards for each system token (colors, type, spacing, components). Registered to the Design System tab. |
| `ui_kits/website/` | Bilingual (TR/EN) marketing site UI kit — hero, categories, product detail, catalog download, about, export contact. |
| `slides/` | B2B pitch deck template for distributor meetings. |
| `SKILL.md` | Agent-skill manifest — cross-compatible with Claude Code / Agent Skills. |
| (fonts) | Loaded from Google Fonts CDN — see "Font substitutions" below. |

---

## Font substitutions — ACTION REQUIRED

No official Akel fonts were provided. I've substituted **Google Fonts** based on the chosen "grotesk + humanist" pairing:

| Role | Substitute | Why |
|---|---|---|
| Display / headlines | **Archivo** (800/900) | Industrial grotesk, excellent Turkish diacritic support (ş ğ ı İ). |
| Body / UI | **DM Sans** (400/500/600) | Humanist workhorse, warmer counters, strong Turkish diacritics. |
| Mono (rare) | JetBrains Mono | SKU codes, specs. |

**Please confirm** whether Akel has official brand fonts. If so, drop the files into `fonts/` and update `colors_and_type.css`.

---

## Color — at a glance

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#F7F6F3` | Primary page background |
| `--paper-soft` | `#FBFAF7` | Elevated surfaces |
| `--bone` | `#EEECE6` | Section breaks, muted fills |
| `--mist` | `#E4E2DB` | Dividers, borders |
| `--stone` | `#B8B5AC` | Disabled, subtle type |
| `--slate` | `#6E6B63` | Secondary body type |
| `--graphite` | `#2A2A28` | Primary type |
| `--ink` | `#111110` | Display type, highest contrast |
| `--akel-red` | `#CE171B` | Brand red (sampled from logo). Accent, CTAs. |

**⚠️ Accent-color note:** you picked rust/terracotta `#B8472A` in the questionnaire, but the actual logo red is `#CE171B` — a crisp primary red. I went with the logo's real color for authenticity. If you'd prefer the rust direction (which would require refreshing the logo too), let me know.

---

## CONTENT FUNDAMENTALS

Voice for Akel is **factual, restrained, confident**. The company is a manufacturer — not a lifestyle brand. Copy leans B2B.

**Tone**
- **Plain and specific.** Numbers over adjectives. "28 cm diameter" beats "generous size." "40' HC: 4,800 pcs" beats "efficient for export."
- **Second person, formal.** TR uses "siz" (formal-you). EN uses "you" neutrally, but avoids casual contractions in marketing copy ("we are" over "we're").
- **No hype, no superlatives.** Don't say "the best," "world-class," "premium quality." Say what it is and let distributors judge.
- **Manufacturing pride is implicit, not shouted.** "Produced in [city] since [year]" is fine. "Our award-winning team" is not.

**Casing**
- **Sentence case for headlines** in body copy: "Dinner sets for every table."
- **ALL CAPS for eyebrows** with wide tracking — section labels like "KATEGORILER / CATEGORIES", "IHRACAT / EXPORT".
- **Title Case for UI navigation and product names**: "Product Catalog", "Request Samples".

**I vs. you vs. we**
- Brand speaks as **"we"** (Akel / biz).
- Addresses reader as **"you"** (siz).
- Never "I".

**Bilingual rules**
- Turkish is **primary**; English is the switchable alternative. In code/CMS, TR is the source string, EN is the translation.
- Never mix the two in a single sentence. Language switcher lives top-right of header.
- Turkish diacritics are non-negotiable — ş, ğ, ı, İ, ç, ö, ü. Any font we use must support them.
- Date/number formatting follows the active locale (TR: 1.234,56; EN: 1,234.56).
- Currency in EN is USD for export ($), in TR is ₺ where shown.

**Emoji & unicode**
- **No emoji** in marketing or product copy. B2B, not consumer.
- Sparingly: `·` `—` `×` (dimensions, "45 × 30 × 5 cm"), `→` for directional CTAs, `®` on the logo.
- Use `'` and `"` as curly quotes (`'` `'` `"` `"`) in editorial copy.

**Example copy**

> ✅ **Right (TR)** — "Kaseler. Her sofra için, her boyutta."
> ✅ **Right (EN)** — "Bowls. Every size, every table setting."
> ❌ **Wrong** — "🍽️ Amazing bowls you'll LOVE! Best quality, world-class design!"

> ✅ **Right** — "[XX.XXX] m² fabrika. Günde [XX.XXX] parça üretim kapasitesi. [XX] ülkeye ihracat."
> ❌ **Wrong** — "A cutting-edge facility delivering unparalleled quality at scale."

---

## VISUAL FOUNDATIONS

The aesthetic is **Scandinavian industrial**: crisp white ground, bold grotesk headlines, product photography doing the heavy lifting. Akel red is the one accent — used deliberately, never decoratively. Whitespace is the primary material.

### Color behavior
- **Backgrounds are off-white (`--paper`)**, never pure white. Warm, paper-like, premium. Section breaks use `--bone` — a barely-darker tint — not lines.
- **Akel red is rationed.** Use it for: CTAs, the logo, one eyebrow per section, rare pull-quotes. Never as a background for large areas, never behind body text. The red should feel like a stamp, not wallpaper.
- **Dark mode is `--ink` + `--paper-soft` text** (not inverted neutrals). Rarely used — most B2B surfaces stay light.

### Typography
- **Headlines are tight, heavy, and balanced.** `font-weight: 800–900`, letter-spacing `-0.02em` to `-0.03em`, line-height 0.98–1.05 on display sizes. `text-wrap: balance`.
- **Body is Inter at 400/500**, line-height 1.5–1.65, `text-wrap: pretty`.
- **Eyebrows are ALL-CAPS**, 11px, letter-spacing 0.14em, Akel red. Every major section starts with one.
- **Numbers are tabular** in specs (`font-variant-numeric: tabular-nums`).

### Backgrounds & imagery
- **Full-bleed product photography** on the hero, but always with generous negative space around the subject.
- **Imagery is warm, neutral, and clean** — shot on off-white, with soft directional light. Never cool-blue or overly contrasty. No filters. No grain.
- **No gradients.** Flat color only. No glassmorphism, no mesh backgrounds.
- **No repeating patterns or decorative textures.** The products are the pattern.
- **Hand-drawn illustrations: no.** Photorealism or nothing.

### Animation
- **Minimal.** This is a B2B manufacturer site, not a product launch.
- Fades and slight upward translates on scroll-in (`opacity 0→1, translateY 8px → 0, 420ms --ease-out`).
- **No bounces, no springs, no parallax.** Easing is `cubic-bezier(0.2, 0.8, 0.2, 1)` (--ease-out) for entrances, `0.4, 0, 0.2, 1` (--ease-inout) for transitions.
- Durations: 120ms (micro), 220ms (standard), 420ms (entrance). Never slower.

### Interactive states
- **Hover on primary CTAs:** background darkens to `--akel-red-dark` (`#A6121A`). No scale, no shadow change.
- **Hover on links/ghost buttons:** underline appears (offset 3px, 1px thick) OR color shifts from `--slate` → `--graphite`. Pick one per context, stay consistent.
- **Hover on cards:** `--shadow-2` → `--shadow-3`, 220ms. No translate.
- **Pressed / active:** opacity 0.85 OR shift 1px down. Never scale.
- **Focus:** 2px outline in `--akel-red`, 2px offset. Always visible, never `outline: none` without a replacement.

### Borders
- **1px solid `--border` (mist)** is the default. Hairline, never heavy.
- Dividers between list rows, input borders, table rows.
- **Don't stack borders** — pick either a border OR a background tint, not both.

### Shadows
- **Four-step elevation scale.** Shadows are warm (graphite-tinted, not blue-black), soft, and small.
- `--shadow-1`: barely-there lift on static surfaces.
- `--shadow-2`: cards at rest.
- `--shadow-3`: cards on hover, dropdowns.
- `--shadow-4`: modals, overlays.
- Never inner shadows. Never colored shadows.

### Corner radii
- **Restrained.** Industrial, not pillowy.
- `--radius-sm` (2px): inputs, small controls.
- `--radius-md` (4px): buttons, cards.
- `--radius-lg` (8px): modal dialogs, large surfaces.
- `--radius-pill`: filter chips, badges only. Used sparingly.

### Cards
- **Background `--paper-soft` on `--paper` ground.** OR white on `--bone` section. OR 1px `--border` with no shadow.
- 4px radius, `--shadow-2` at rest.
- 24–32px internal padding.
- **No left-border color accents.** (Avoid the "colored left stripe" trope.)

### Layout rules
- **Max width 1360px**, gutters `clamp(20px, 4vw, 48px)`.
- **12-column grid** with generous gaps (24–32px).
- **Asymmetry over symmetry** on editorial sections — product image 7 cols, copy 4 cols, 1 col margin. Fights the blog-template look.
- **Fixed header** is sticky, 72px tall, `--paper/95` with 12px backdrop-blur. Becomes fully opaque with a bottom border after first scroll.
- Product grids: 2 / 3 / 4 columns responsive.

### Transparency & blur
- **Only on the sticky header** (`paper/95 + backdrop-filter: blur(12px)`) and rare modal overlays (`ink/60`).
- Never decoratively. No frosted-glass cards.

### Iconography (see `ICONOGRAPHY` section below)
- Lucide (CDN), 1.75px stroke, `--graphite` by default.
- Line icons only. No duotone, no filled, no color.

### Imagery color palette
- Warm-neutral. Off-white/paper ground. Soft daylight shadows.
- Products are the color — if the melamine is cobalt, that's the color in the frame. Otherwise, frames stay neutral.
- **No black-and-white photography** — factual color, not moody.

---

## ICONOGRAPHY

No icon set was bundled with the brand. We substitute **[Lucide](https://lucide.dev)** (MIT license, CDN-loaded).

**Why Lucide**
- Line-style, 24×24 grid, 1.75px stroke — matches industrial-minimal feel.
- 1,400+ icons including `package`, `truck`, `globe`, `factory`, `download`, `mail`, `phone` — all we need for a manufacturer/export site.
- Zero dependency footprint via CDN `<script src="https://unpkg.com/lucide@latest"></script>`.

**Rules**
- **Stroke weight:** 1.75px everywhere.
- **Size:** 16 / 20 / 24 px. No other sizes.
- **Color:** `--graphite` default. `--akel-red` only when marking an action (CTA arrow, download). `--slate` for muted/secondary.
- **Never fill a Lucide icon.** Line only.
- **No emoji**, no unicode-as-icon, no custom SVGs from a design agent — use the library.
- **Flag logos** (country picker in contact form): use [flag-icons CSS](https://github.com/lipis/flag-icons) via CDN — consistent with line-style aesthetic.

**Compliance / certification logos** (the real marks Akel holds — LFGB / FDA / TSE / ISO 9001 are common examples but have NOT been confirmed for Akel) are the exception — those are real marks, stored in `assets/certifications/` when provided. Not yet provided.

**⚠️ Substitution flag:** Lucide is a substitute for whatever Akel currently uses (if anything). If they have an existing icon system, swap in.

---

## Logo usage

- **`assets/akel-logo.jpg`** — original registered mark, 1080×1080, white background.
- **`assets/akel-logo.png`** — transparent background (white matted out algorithmically; use for dark/colored grounds).
- **`assets/akel-logo-cropped.png`** — tightly cropped transparent version for use in headers.

**Minimum clear space:** logo height ÷ 2 on all sides.
**Minimum display size:** 32px tall (digital), 12mm tall (print).
**Do not:** recolor, remove the ®, stretch, place on low-contrast grounds, or use on top of photography without a white chip behind it.

---

*See `SKILL.md` for agent-invocation details.*
