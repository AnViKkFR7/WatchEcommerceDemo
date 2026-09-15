-- =============================================================================
-- 001_attribute_definitions.sql
--
-- Watch attribute schema ("spec sheet") for the TimeCraft demo company.
-- Company id : 80bbaa26-35b9-41e6-a854-fdb156c4b921
-- Item type  : watch_ecommerce_demo_items
--
-- Run ONCE against the shared Supabase project (see BDD.sql for the target
-- schema). The shared schema has no unique constraint on
-- (company_id, item_type, key), so this is a plain INSERT, not an upsert —
-- re-running it will duplicate rows. If you need idempotency, either add
-- that unique constraint yourself or delete the previous rows for this
-- company_id + item_type before re-running.
--
-- `label` is stored as a JSON string with the shape {"es":"...","en":"..."}
-- so a single `text` column can carry both locales — the frontend's i18n
-- helper (src/lib/i18n/) parses this convention everywhere labels are read.
-- =============================================================================

insert into public.attribute_definitions
  (company_id, item_type, key, label, data_type, is_filterable, is_required)
values
  -- ---- Identification -------------------------------------------------
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'brand',
    '{"es":"Marca","en":"Brand"}', 'text', true, true),
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'model',
    '{"es":"Modelo","en":"Model"}', 'text', true, true),
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'reference_number',
    '{"es":"Número de referencia","en":"Reference number"}', 'text', true, false),
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'gender',
    '{"es":"Género","en":"Gender"}', 'text', true, false),
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'is_featured',
    '{"es":"Destacado","en":"Featured"}', 'boolean', false, false),
  -- NOTE: items.status is the platform's shared CMS publish workflow
  -- (draft/published/archived — enforced by the DB, not free text despite
  -- what BDD.sql's column definition suggests). It is NOT this field.
  -- availability_status is the watch-specific concept from SPECS.md §4
  -- ('disponible' | 'bajo_reserva' | 'no_disponible') and must live in its
  -- own attribute, filtered client-side by the API layer (api/_lib/catalog.js).
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'availability_status',
    '{"es":"Disponibilidad","en":"Availability"}', 'text', true, true),

  -- ---- Price & condition -----------------------------------------------
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'price',
    '{"es":"Precio","en":"Price"}', 'number', true, true),
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'currency',
    '{"es":"Moneda","en":"Currency"}', 'text', false, false),
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'condition',
    '{"es":"Estado","en":"Condition"}', 'text', true, true),
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'year',
    '{"es":"Año","en":"Year"}', 'number', true, false),
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'box_papers',
    '{"es":"Caja y documentos","en":"Box & papers"}', 'text', true, false),
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'warranty',
    '{"es":"Garantía","en":"Warranty"}', 'text', false, false),

  -- ---- Case ---------------------------------------------------------
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'case_material',
    '{"es":"Material de la caja","en":"Case material"}', 'text', true, false),
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'case_diameter_mm',
    '{"es":"Diámetro de la caja (mm)","en":"Case diameter (mm)"}', 'number', true, false),
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'case_thickness_mm',
    '{"es":"Grosor de la caja (mm)","en":"Case thickness (mm)"}', 'number', false, false),
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'water_resistance',
    '{"es":"Resistencia al agua","en":"Water resistance"}', 'text', true, false),
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'glass_material',
    '{"es":"Cristal","en":"Glass"}', 'text', false, false),

  -- ---- Dial -----------------------------------------------------------
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'dial_color',
    '{"es":"Color del dial","en":"Dial color"}', 'text', true, false),

  -- ---- Movement ---------------------------------------------------------
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'movement',
    '{"es":"Movimiento","en":"Movement"}', 'text', true, false),
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'caliber',
    '{"es":"Calibre","en":"Caliber"}', 'text', false, false),
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'power_reserve',
    '{"es":"Reserva de marcha","en":"Power reserve"}', 'text', false, false),

  -- ---- Bracelet / strap ---------------------------------------------------
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'bracelet_material',
    '{"es":"Brazalete / correa","en":"Bracelet / strap"}', 'text', true, false),
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'bracelet_color',
    '{"es":"Color del brazalete","en":"Bracelet color"}', 'text', true, false),
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'clasp_type',
    '{"es":"Tipo de cierre","en":"Clasp type"}', 'text', false, false),

  -- ---- Functions & extras -----------------------------------------------
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'functions',
    '{"es":"Funciones","en":"Functions"}', 'text_array', true, false),
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'limited_edition',
    '{"es":"Edición limitada","en":"Limited edition"}', 'boolean', true, false),
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'watch_ecommerce_demo_items', 'short_description',
    '{"es":"Descripción","en":"Description"}', 'json', false, false);
