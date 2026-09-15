-- =============================================================================
-- 003_analytics_event_definitions.sql
--
-- Registers the cta_click event keys this frontend actually fires (see
-- SPECS.md §9 and src/lib/analytics.js / data-track-event attributes).
-- Per ANALYTICS_INTEGRATION.md, any click whose key isn't registered here
-- (and active) is silently discarded by api/track.ts — so this must be run
-- for clicks to be counted in the admin dashboard.
-- =============================================================================

insert into public.analytics_event_definitions (company_id, key, label, is_active)
values
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'whatsapp_click', 'Clic en WhatsApp', true),
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'filter_apply', 'Aplicar filtros en tienda', true),
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'brand_tile_click', 'Clic en marca (landing)', true),
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'newsletter_form_open', 'Apertura formulario newsletter', true),
  ('80bbaa26-35b9-41e6-a854-fdb156c4b921', 'newsletter_submit', 'Envío formulario newsletter', true);
