// Shared server-side data layer, used by both the Vercel serverless
// functions (api/watches.js, api/company.js) and the Vite dev-server
// middleware (vite.config.js) so local dev and production read data the
// exact same way.
//
// This project's Supabase tables have RLS locked down for the existing
// admin panel (company members only) — the public storefront has no
// business holding a key that can read across the shared project, so
// instead of a client-side anon key we read here with the service role
// key, server-side only, and expose just the public-safe fields the
// frontend needs over our own tiny JSON endpoints.
import { createClient } from '@supabase/supabase-js';

export const COMPANY_ID = process.env.COMPANY_ID || '80bbaa26-35b9-41e6-a854-fdb156c4b921';
export const ITEM_TYPE = process.env.ITEM_TYPE || 'watch_ecommerce_demo_items';

// `items.status` is the platform's generic CMS publish workflow, shared by
// every tenant, and the DB enforces it to exactly these three values (any
// other string gets silently coerced) — it is NOT the watch-specific
// availability concept from SPECS.md §4. That lives in its own attribute,
// `availability_status` ('disponible' | 'bajo_reserva' | 'no_disponible'),
// set via attribute_values like every other spec. Only 'published' items are
// ever eligible for the public site; among those, only the two availability
// values below are actually shown.
const PUBLISH_STATUS = 'published';
export const PUBLIC_AVAILABILITY = ['disponible', 'bajo_reserva'];

let client = null;
function getClient() {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not configured');
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

function pickRawValue(av) {
  if (av.value_text !== null && av.value_text !== undefined) return av.value_text;
  if (av.value_number !== null && av.value_number !== undefined) return av.value_number;
  if (av.value_boolean !== null && av.value_boolean !== undefined) return av.value_boolean;
  if (av.value_json !== null && av.value_json !== undefined) return av.value_json;
  if (av.value_text_array !== null && av.value_text_array !== undefined) return av.value_text_array;
  if (av.value_date !== null && av.value_date !== undefined) return av.value_date;
  return null;
}

function shapeItem(row) {
  const attrs = {};
  for (const av of row.attribute_values || []) {
    const def = av.attribute_definitions;
    if (!def) continue;
    attrs[def.key] = pickRawValue(av);
  }
  const media = [...(row.item_media || [])].sort((a, b) => a.sort_order - b.sort_order);
  const cover = media.find((m) => m.is_cover) || media[0] || null;

  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    status: attrs.availability_status || null,
    attrs,
    media: media.map((m) => ({ id: m.id, url_externa: m.url_externa, alt_text: m.alt_text, sort_order: m.sort_order, is_cover: m.is_cover })),
    coverUrl: cover?.url_externa || null,
    coverAlt: cover?.alt_text || row.title,
  };
}

export async function getWatches() {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('items')
    .select(
      `
      id, title, summary, status, created_at,
      attribute_values ( value_text, value_number, value_boolean, value_json, value_text_array, value_date, attribute_definitions ( key, label, data_type ) ),
      item_media ( id, url_externa, alt_text, sort_order, is_cover )
    `
    )
    .eq('company_id', COMPANY_ID)
    .eq('item_type', ITEM_TYPE)
    .eq('status', PUBLISH_STATUS)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(shapeItem).filter((w) => PUBLIC_AVAILABILITY.includes(w.status));
}

export async function getCompanyPublicInfo() {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('companies')
    .select('name, contact_phone, contact_email')
    .eq('id', COMPANY_ID)
    .maybeSingle();
  if (error) throw error;
  return data || { name: 'TimeCraft', contact_phone: null, contact_email: null };
}
