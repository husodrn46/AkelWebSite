# Akel Melamin — Marketing website UI kit

A bilingual (TR / EN) B2B marketing site for Akel Melamin. Designed for export distributors and retail buyers, not end consumers.

## Screens

| Route | File | What it is |
|---|---|---|
| `home` | Hero + Categories + ProductionBand + CatalogBand | Landing |
| `products` | `ProductGrid.jsx` | Filterable catalog listing |
| `product-detail` | `ProductDetail.jsx` | Single product with B2B specs |
| `catalog` | `CatalogPage.jsx` | PDF download with soft email-gate |
| `about` | `About.jsx` | Factory / capacity / markets |
| `contact` | `Contact.jsx` | Export inquiry form (country, volume, Incoterms) |

## Components

- `Header.jsx` — sticky header, nav, language switcher (TR/EN), catalog CTA.
- `Hero.jsx` — manufacturing-first hero + stats row.
- `Categories.jsx` — 7 product families as asymmetric editorial grid.
- `Bands.jsx` — `ProductionBand` (dark) + `CatalogBand` (bone).
- `ProductGrid.jsx` — filter chips + 3-up card grid.
- `ProductDetail.jsx` — gallery + spec tables (dimensions, packaging, certs).
- `About.jsx` — factory facts + regional markets + certifications.
- `Contact.jsx` — export inquiry form with country + Incoterms + product interests.
- `CatalogPage.jsx` — soft email-gate + mock catalog cover + TOC.
- `Footer.jsx` — 4-column dark footer with certification chips.

## Conventions

- **State:** Pure React state for navigation. Language and route persisted to `localStorage` (`akel.lang`, `akel.route`).
- **Bilingual:** Every component takes a `lang` prop and contains a `{ tr, en }` copy object inline. No translation framework.
- **Icons:** Lucide via CDN. Call `lucide.createIcons()` after route/language change (handled in `App`).
- **Placeholders:** Products are represented by abstract CSS shapes (`.plate--dinner` etc). Swap in real photography.

## Known gaps

- Product images are CSS placeholders — no real product photography was provided.
- Certification logos (LFGB, FDA, TSE, ISO 9001) are text chips — real SVG/PNG marks needed.
- Factory photography (for About page) is a placeholder.
- Form submission is mocked — no backend.
