# TimeCraft — Watch E-commerce Demo

Lookalike e-commerce web for a premium watch dealer (new & vintage watches).
No online checkout: every "buy" action opens a pre-filled WhatsApp
conversation with the seller for the selected watch. Built as a sellable
MVP/demo for prospective clients of **moira ordo**.

## Stack

- **Frontend**: React 19 + Vite + CSS Modules para nuevos componentes y CSS (design tokens / CSS variables), React Router
- **Backend**: Supabase (shared multi-tenant Postgres — see [BDD.sql](BDD.sql)), consultado en servidor mediante `/api/watches` y `/api/company`; la clave de servicio nunca se entrega al navegador
- **Serverless**: one API route (`api/track.ts`) for first-party analytics ingestion, per [ANALYTICS_INTEGRATION.md](ANALYTICS_INTEGRATION.md)
- **i18n**: ES (default) / EN, client-side dictionary, no external service
- **Deploy target**: Vercel (assumed by the analytics integration guide)

## Multi-tenant data model

This project is one tenant (`company`) inside a shared Supabase project used
by several client webs. Everything is scoped by `company_id`:

- Company id for this demo: **`80bbaa26-35b9-41e6-a854-fdb156c4b921`**
- Item type used for every watch: **`watch_ecommerce_demo_items`**
- Watch attributes (brand, movement, case material, dial color, condition,
  price, etc.) are **not** hardcoded columns — they're rows in
  `attribute_definitions` (schema) + `attribute_values` (data), per
  [BDD.sql](BDD.sql). See [db/001_attribute_definitions.sql](db/001_attribute_definitions.sql).
- Bilingual attribute labels/option values are stored as a JSON string in the
  `label`/`value_text` fields (`{"es":"...","en":"..."}`) and parsed client-side,
  since the shared schema only has single `text` columns for those.

## Project layout

```
db/                     SQL to run against Supabase (attribute defs + seed data)
src/
  lib/                  Supabase client, analytics, i18n, watch data mapping
  components/           Reusable UI (Navbar, Footer, WatchCard, WhatsappCTA, ImageZoom, Filters...)
  pages/                Landing, Search, ProductDetail, About/FAQ
  styles/               tokens.css (color palette, spacing, type scale) + global.css
api/
  track.ts              Analytics ingestion endpoint (Vercel serverless function)
```

## Local setup

```bash
npm install
cp .env.example .env      # fill in Supabase project URL + server-only service role key + company id
npm run dev
```

## Docs

- [SPECS.md](SPECS.md) — functional & technical specification
- [ROADMAP.md](ROADMAP.md) — implementation status, kept up to date as we build
- [BDD.sql](BDD.sql) — shared Supabase schema (reference only, not meant to be run)
- [ANALYTICS_INTEGRATION.md](ANALYTICS_INTEGRATION.md) — analytics wiring guide this project follows
- [db/001_attribute_definitions.sql](db/001_attribute_definitions.sql) — watch attribute schema for this company
- [db/002_seed_items.sql](db/002_seed_items.sql) — demo watches (items + attribute values + media)

## Credits

Developed by **moira ordo**.

## Uso y verificacion del rebranding

- `npm run dev`: web local en http://localhost:5174, con endpoints del CRM.
- `npm run build`: genera `dist` para el despliegue existente en Vercel.
- `npm run lint`: analisis estatico.
- `npm run test:e2e`: pruebas en Chrome a 375, 768, 1024 y 1440 px.
- `npm run preview` sirve solo el frontend; para probar el CRM usar `npm run dev` o el despliegue con sus funciones API.

Verificacion 2026-10-30: 19 pruebas aplicables correctas, 5 exclusiones por viewport. Pruebas automatizadas con fixtures; comprobacion adicional con CRM real: 13 piezas y ambos endpoints HTTP 200. Revision visual de portada, marcas, catalogo y ficha en movil y escritorio, con inspeccion adicional de tablet. Sin desbordamiento horizontal en los cuatro anchos revisados.

Limites heredados de la demo: newsletter sin servicio de suscripcion, enlaces de contacto de ejemplo y analitica dependiente de `VITE_COMPANY_ID`. El catalogo y contacto por WhatsApp usan los servicios existentes. No se ha publicado esta revision. Antes de uso comercial, completar los servicios y datos de contacto de la demo.
