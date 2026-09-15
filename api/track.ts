// Analytics ingestion endpoint — implements ANALYTICS_INTEGRATION.md §2
// verbatim for this project. Deployed by Vercel as a Serverless Function.
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const ALLOWED_EVENT_TYPES = new Set(['page_view', 'cta_click']);

// In-memory cache per warm function invocation — avoids querying
// analytics_event_definitions on every single click.
let definitionsCache: { keys: Set<string>; expiresAt: number } | null = null;

async function activeEventKeys(companyId: string): Promise<Set<string>> {
  if (definitionsCache && definitionsCache.expiresAt > Date.now()) {
    return definitionsCache.keys;
  }
  const { data } = await supabase
    .from('analytics_event_definitions')
    .select('key')
    .eq('company_id', companyId)
    .eq('is_active', true);
  const keys = new Set((data ?? []).map((d) => d.key as string));
  definitionsCache = { keys, expiresAt: Date.now() + 5 * 60 * 1000 };
  return keys;
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  let body: { company_id?: string; event_type?: string; event_key?: string; path?: string; session_id?: string };
  try {
    body = await req.json();
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  const { company_id, event_type, event_key, path, session_id } = body;
  if (!company_id || !event_type || !ALLOWED_EVENT_TYPES.has(event_type) || !session_id) {
    return new Response('Bad request', { status: 400 });
  }

  const { data: company } = await supabase.from('companies').select('id').eq('id', company_id).maybeSingle();
  if (!company) return new Response('Bad request', { status: 400 });

  if (event_type === 'cta_click') {
    if (!event_key) return new Response('Bad request', { status: 400 });
    const keys = await activeEventKeys(company_id);
    if (!keys.has(event_key)) return new Response(null, { status: 204 });
  }

  const country = req.headers.get('x-vercel-ip-country') ?? null;
  const region = req.headers.get('x-vercel-ip-country-region') ?? null;
  const city = req.headers.get('x-vercel-ip-city') ?? null;

  const ua = req.headers.get('user-agent') ?? '';
  const device = /mobile/i.test(ua) ? 'mobile' : /tablet|ipad/i.test(ua) ? 'tablet' : 'desktop';

  const { error } = await supabase.from('analytics_events').insert({
    company_id,
    event_type,
    event_key: event_type === 'cta_click' ? event_key : null,
    path,
    session_id,
    device,
    country,
    region,
    city,
  });

  if (error) return new Response('Error', { status: 500 });
  return new Response(null, { status: 204 });
}

export const config = { runtime: 'nodejs' };
