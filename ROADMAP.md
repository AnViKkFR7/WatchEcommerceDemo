# ROADMAP

Status snapshot — updated as work lands. See [SPECS.md](SPECS.md) for detail
behind each item.

## Phase 0 — Foundations
- [x] README.md / SPECS.md / ROADMAP.md
- [x] `db/001_attribute_definitions.sql` — watch attribute schema for company `80bbaa26-35b9-41e6-a854-fdb156c4b921`
- [x] `db/002_seed_items.sql` — demo watches (items + attribute_values + item_media)
- [x] Vite + React app scaffold, routing, env config
- [x] Design tokens (`src/styles/tokens.css`) + global styles + fonts

## Phase 1 — Data layer
- [x] Supabase client (`src/lib/supabase.js`)
- [x] Watch data mapping helpers (`src/lib/watches.js`): fetch items + attributes + media, shape into a `Watch` object, bilingual label/value parsing
- [x] i18n dictionary + `useI18n` (`src/lib/i18n/`)

## Phase 2 — Core UI
- [x] Navbar (sticky, language switch, responsive)
- [x] Footer (copyright, moira ordo credit, socials)
- [x] `WatchCard` (hover zoom + CTA reveal)
- [x] `WhatsappCTA` button (message templating)
- [x] Skeleton loaders / empty states

## Phase 3 — Pages
- [x] Landing (`/`) — hero, trust strip, featured, callout, brand grid, testimonials
- [x] Catalog (`/tienda`) — filters (brand, price, model, dial color, strap, condition), URL-synced, grid
- [x] Product detail (`/reloj/:id`) — gallery with hover-magnify zoom, spec sheet, sticky WhatsApp CTA, related watches
- [x] About/FAQ (`/sobre-nosotros`)
- [x] 404

## Phase 4 — Analytics
- [x] `api/track.ts` serverless ingestion endpoint
- [x] `src/lib/analytics.js` client (pageview + auto cta tracking)
- [x] Wired into router (pageviews) + WhatsApp CTAs / filter apply / brand tile clicks

## Phase 5 — Polish & verification
- [x] Responsive pass (mobile/tablet/desktop) for all pages
- [x] Manual browser QA of golden path (landing → filter → detail → WhatsApp) — done via Vite dev server + in-app Browser tool
- [ ] Lighthouse/perf pass
- [ ] Content pass (final invented copy for About/FAQ, testimonials)

## Phase 6 — Design refinement (client feedback round 1)
- [x] `items.status` bug fix: the shared platform enforces `draft`/`published`/`archived` on that column — availability (`disponible`/`bajo_reserva`/`no_disponible`) now lives in its own `availability_status` attribute instead (see `api/_lib/catalog.js`)
- [x] Navbar always solid black (no scroll-triggered color swap), redesigned as a quieter pill-style WhatsApp CTA instead of a flat green block
- [x] `PageHero` component (full-bleed image + dark gradient + centered copy, Regia Mare–style) used on `/tienda` and `/sobre-nosotros`
- [x] Catalog filters now apply live on change — no "Apply" button to scroll to; mobile drawer keeps a sticky "View N watches" button always in view
- [x] Footer moira ordo link → `moiraordo.es`
- [x] About page redesign: story section with photo + stats, a 4-step "how we work" process (Arquelia-style numbered cards), FAQ restyled as a numbered card grid
- [x] Mobile pass: verified no horizontal overflow and correct single-column stacking on Landing/Catalog/Product/About/Footer at 375px

## Known follow-ups / not started
- **Live data verified end-to-end.** `.env` is filled in with the real shared Supabase project. `db/001` and `db/002` have already been run against it (26 attribute definitions + 14 demo watches under company `80bbaa26-35b9-41e6-a854-fdb156c4b921`), plus `db/003` (analytics event definitions).
- Architecture note: the shared Supabase project has RLS locked down to the existing admin panel (company members only) — a public anon key cannot read `items`/`companies` directly. Catalog data is instead served from two tiny endpoints, **`api/watches.js`** and **`api/company.js`**, which read with the service role key server-side (see `api/_lib/catalog.js`). `vite.config.js` mirrors both as dev middleware so `npm run dev` behaves like production without `vercel dev`. `SPECS.md` §4 has been superseded by this — update it before sharing externally.
- Stock photography in `db/002_seed_items.sql` / `src/lib/mockWatches.js` has been hand-verified so every image shows either the correct brand's logo or no logo at all (the first pass had several guessed Unsplash IDs showing the *wrong* brand's dial — since fixed both in the live DB and in the seed files).
- No automated tests yet.
- Lighthouse/perf pass and final copy pass still open (see Phase 5).
