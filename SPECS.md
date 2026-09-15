# SPECS — TimeCraft Watch E-commerce Demo

## 1. Purpose

A premium-feeling, fast, lookalike e-commerce for a watch dealer selling
**new and vintage** watches across all price ranges. No online payment:
every product CTA opens WhatsApp with a pre-filled message identifying the
selected watch, addressed to the seller's number.

Built as a demo/MVP to be shown to prospective clients — content
(About/FAQ copy, seed watches) is invented but plausible.

## 2. Target audience & tone

Two converging audiences on the same site, without either feeling
out of place:

- **30–60**, higher budget, vintage/prestige pieces (Rolex, Omega, vintage chronographs)
- **18–25**, lower budget, modern/sport pieces (Seiko 5, smartwatches, steel sport models)

Design principle: **premium, clean, calm — "fun" only through subtle motion
and polish (hover zoom, smooth transitions), never through playful
copy/colors/illustrations.** We sell watches, not toys. Avoid anything that
reads as juvenile (no cartoonish icons, no loud gradients) or anything that
reads as stuffy/dated (no dense walls of serif text, no skeuomorphism).

## 3. Color palette (design tokens)

Defined once in `src/styles/tokens.css`, used everywhere via CSS variables.

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#0B0B0D` | Primary dark background (hero, header, footer) |
| `--color-bg-alt` | `#141416` | Secondary dark surface (cards on dark) |
| `--color-surface` | `#FFFFFF` | Light section background |
| `--color-surface-alt` | `#F6F5F2` | Off-white section background (warm, not clinical) |
| `--color-ink` | `#121214` | Primary text on light |
| `--color-ink-soft` | `#5B5A57` | Secondary text on light |
| `--color-paper` | `#F5F1EA` | Text/borders on dark surfaces (warm off-white, not pure white) |
| `--color-gold` | `#B08D45` | Primary accent (CTAs, active states, prices) — muted brass gold, not "bling" yellow |
| `--color-gold-soft` | `#D8C193` | Accent hover / highlights |
| `--color-line` | `#E4E1D8` | Hairline borders on light |
| `--color-line-dark` | `#2A2A2C` | Hairline borders on dark |
| `--color-success` | `#4C7A5E` | "Disponible" status |
| `--color-warning` | `#B0793C` | "Bajo reserva" status |
| `--color-whatsapp` | `#25D366` | WhatsApp CTA only |

Typography: a serif display face (headlines — evokes horology/craft) +
a clean grotesk (body/UI). Both loaded from Google Fonts (Playfair Display +
Inter), self-hosted fallback stack for resilience.

## 4. Data model mapping

Reuses the shared multi-tenant schema in `BDD.sql`. No schema changes.

**Data access note:** the shared Supabase project's RLS policies are scoped
to the existing admin panel (company members only) — the public storefront
cannot read `items`/`companies`/etc. with a client-side anon key. Instead,
two small endpoints read with the **service role key, server-side only**:
`api/watches.js` and `api/company.js` (shared logic in `api/_lib/catalog.js`).
`vite.config.js` mirrors both as dev middleware so local `npm run dev`
behaves identically to the deployed Vercel functions. The frontend
(`src/lib/watches.js`, `src/lib/company.js`) just calls `fetch('/api/watches')`
/ `fetch('/api/company')` — no Supabase client ships to the browser at all.

- `companies.id = 80bbaa26-35b9-41e6-a854-fdb156c4b921` — this tenant
- `items` — one row per watch. `item_type = 'watch_ecommerce_demo_items'`.
  `status` drives visibility:
  - `disponible` — visible, purchasable (WhatsApp CTA active)
  - `bajo_reserva` — visible, marked "Bajo reserva", CTA active ("consultar disponibilidad")
  - `no_disponible` — **never returned to the public site**
  - anything else (`draft`, etc.) — never returned to the public site
- `attribute_definitions` — the watch "spec sheet" schema for this company (see §5)
- `attribute_values` — per-item values, one row per (item, attribute)
- `item_media` — product photos, ordered by `sort_order`, one flagged `is_cover = true`

### Bilingual content convention

`attribute_definitions.label` and any free-text `attribute_values.value_text`
that is user-facing copy are stored as a JSON string:
`{"es":"Movimiento","en":"Movement"}`. The frontend's `i18n` helper
(`src/lib/i18n.js`) parses this shape everywhere it's read; a plain string
falls back to being shown as-is in both languages.

## 5. Watch attribute schema (`attribute_definitions`)

See [db/001_attribute_definitions.sql](db/001_attribute_definitions.sql) for
the authoritative list. Modeled after Chrono24 product pages. Filterable
attributes power the search page's filter panel.

Groups: Identification (brand, model, reference), Price & condition,
Case, Dial, Movement, Bracelet/strap, Functions, Included/warranty.

## 6. Pages

### 6.1 Landing (`/`)
1. Sticky header: logo, nav (Inicio, Tienda, Colecciones, Marcas, Sobre nosotros, FAQ), language switch (ES/EN), search icon, WhatsApp icon.
2. Hero: full-bleed editorial photo, headline, subcopy, two CTAs ("Ver colección" → `/tienda`, "Explorar destacados" → anchor).
3. Trust strip: shipping / warranty / returns / authenticity / support (icons + short label).
4. **Featured watches** — 3–4 cards pulled from items flagged as featured (via an attribute `is_featured` or the newest `disponible` items as fallback).
5. Callout band — "Encuentra tu reloj perfecto" → CTA to `/tienda` (the real search/catalog page).
6. **Brands grid** — 2 rows × 4 columns, each brand tile → `/tienda?brand=<brand>` (prefiltered).
7. Testimonials carousel (invented, plausible).
8. Footer.

### 6.2 Catalog / Search (`/tienda`)
- Filter sidebar (desktop) / drawer (mobile): brand, price range (slider/min-max), model/reference free-text, dial color, bracelet/strap type, condition (new/used), sort (price asc/desc, newest).
- Filters read/write the URL query string (shareable, prefillable from landing brand tiles).
- Responsive card grid, same `WatchCard` component as landing.
- Only `disponible` + `bajo_reserva` items ever appear.
- Empty state + loading skeletons (no layout shift).

### 6.3 Product detail (`/reloj/:id`)
- Gallery: large selected image with **hover-magnify** (cursor-tracked zoom lens, à la Chrono24), thumbnail rail below/side to switch selected image.
- Title (brand + model), reference, condition + status badge, price.
- Full spec sheet grouped by section (from attribute_definitions/values), bilingual labels.
- Sticky CTA panel: "Consultar por WhatsApp" — opens `wa.me` with a prefilled message naming the exact watch (brand, model, reference, price, page URL).
- Related watches (same brand or similar price band).

### 6.4 About / FAQ (`/sobre-nosotros`)
- Brand story (invented: founded, atelier, authentication process).
- Values strip (authenticity, curation, service).
- FAQ accordion (shipping, authenticity guarantee, returns, payment methods, vintage condition grading, international buyers).

### 6.5 404
Minimal, on-brand, link back to `/`.

## 7. WhatsApp CTA behavior

- Seller phone comes from `companies.contact_phone` for this tenant.
- Link: `https://wa.me/<phone-no-symbols>?text=<url-encoded message>`.
- Message template (ES): `Hola, estoy interesado/a en el [Marca Modelo] (ref. [ref]) — [URL del producto]. ¿Podríais darme más información?`
- Every WhatsApp click fires `cta_click` analytics event with `event_key = 'whatsapp_click'` before/alongside navigation.

## 8. i18n

- Two locales: `es` (default) and `en`.
- Static UI strings: `src/lib/i18n/dictionaries/{es,en}.json`.
- Persisted in-memory + `localStorage` (pure UI preference, not tracking — no consent implications).
- Attribute labels/values: parsed from the bilingual JSON convention in §4.

## 9. Analytics

Implemented exactly per [ANALYTICS_INTEGRATION.md](ANALYTICS_INTEGRATION.md):
`api/track.ts` (serverless ingestion) + `src/lib/analytics.js` (client,
`sendBeacon`, in-memory session id, auto-tracking via `data-track-event`).

Recommended event keys for this project (must be created as
`analytics_event_definitions` rows in the admin panel before they're counted):
- `whatsapp_click` — any WhatsApp CTA (product page, sticky bar, header icon)
- `phone_click` — if a phone link is ever shown
- `filter_apply` — filters applied on `/tienda`
- `brand_tile_click` — landing brand grid click

Page views are auto-tracked on every route change (`react-router` location).

## 10. Non-functional requirements

- **Performance**: image lazy-loading, `srcset`/responsive images, route-based code splitting, skeleton loaders, no layout shift, Lighthouse-friendly.
- **Resilience**: no crash on missing/partial attribute data; graceful empty states.
- **Accessibility**: semantic landmarks, alt text from `item_media.alt_text`, keyboard-navigable filters and gallery, visible focus states, color contrast against both dark and light sections.
- **Responsive**: mobile-first; filter drawer, gallery, and brand grid all adapt down to ~360px width.
- **No online payment/checkout of any kind.**

## 11. Out of scope (for this MVP)

- User accounts / login
- Cart / checkout / payment processing
- CMS/admin UI for editing content (assumed to exist already, shared across moira ordo clients)
- Multi-currency (single currency, EUR, formatted per locale)
