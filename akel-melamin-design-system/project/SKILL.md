---
name: akel-melamin-design
description: Use this skill to generate well-branded interfaces and assets for Akel Melamin, a Turkish manufacturer of melamine tableware serving retail and export distributors — for production or throwaway prototypes, mocks, decks, and design explorations. Contains essential design guidelines, colors, type, fonts, logo, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill first for the full brand context, then explore the other available files as needed:

- `colors_and_type.css` — all design tokens (color, type, spacing, radius, shadow, motion).
- `preview/` — individual token / component specimen cards.
- `ui_kits/website/` — bilingual (TR + EN) B2B marketing site: header, hero, categories, product grid + detail, catalog download, about, export contact, footer.
- `slides/` — B2B distributor pitch deck template (`deck-stage` web component, 1920×1080).
- `assets/` — Akel logo (JPG + transparent PNG, cropped variant).

If creating visual artifacts (slides, mocks, throwaway prototypes, etc.), copy the assets and CSS out and create static HTML files for the user to view. If working on production code, copy assets and read the rules in `README.md` to become an expert designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, then act as an expert designer who outputs HTML artifacts **or** production code, depending on the need.

Key things to keep in mind:
- The audience is **B2B** (distributors, retail buyers) — not end consumers. Copy is factual, specific, restrained.
- **Bilingual TR/EN** — Turkish is primary. Diacritics (ş ğ ı İ ç ö ü) are non-negotiable.
- Palette is warm off-white neutrals + one accent (**Akel red #CE171B**, sampled from the logo). No gradients, no emoji, no cartoonish photography.
- Type: **Archivo** (display, 800–900) + **DM Sans** (body). Both via Google Fonts.
- Icons: **Lucide** at 1.75px stroke.
