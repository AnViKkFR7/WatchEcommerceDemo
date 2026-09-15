import { MOCK_WATCHES } from './mockWatches';

/** Spec-sheet grouping for the product detail page (SPECS.md §5/§6.3). */
export const SPEC_GROUPS = [
  { titleKey: 'product.specs.price', keys: ['condition', 'year', 'box_papers', 'warranty'] },
  { titleKey: 'product.specs.case', keys: ['case_material', 'case_diameter_mm', 'case_thickness_mm', 'water_resistance', 'glass_material'] },
  { titleKey: 'product.specs.dial', keys: ['dial_color'] },
  { titleKey: 'product.specs.movement', keys: ['movement', 'caliber', 'power_reserve'] },
  { titleKey: 'product.specs.bracelet', keys: ['bracelet_material', 'bracelet_color', 'clasp_type'] },
];

const UNIT_SUFFIX = { case_diameter_mm: ' mm', case_thickness_mm: ' mm' };

export function specValueSuffix(key) {
  return UNIT_SUFFIX[key] || '';
}

let cache = null;

/** Fetches (and caches for the session) every publicly-visible watch, via
 * our own /api/watches endpoint — see api/_lib/catalog.js for why this
 * isn't a direct client-side Supabase query. */
export async function fetchWatches({ force = false } = {}) {
  if (cache && !force) return cache;

  try {
    const res = await fetch('/api/watches');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    cache = await res.json();
  } catch (err) {
    console.error('[watches] fetch failed, falling back to demo data:', err.message);
    cache = MOCK_WATCHES;
  }
  return cache;
}

export async function fetchWatchById(id) {
  const all = await fetchWatches();
  return all.find((w) => w.id === id) || null;
}

export function getRelatedWatches(watch, all, max = 4) {
  return all
    .filter((w) => w.id !== watch.id)
    .map((w) => ({
      w,
      score: (w.attrs.brand === watch.attrs.brand ? 2 : 0) + (Math.abs((w.attrs.price || 0) - (watch.attrs.price || 0)) < 1500 ? 1 : 0),
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((s) => s.w);
}

export function uniqueAttrValues(all, key) {
  const set = new Set();
  for (const w of all) {
    const raw = w.attrs[key];
    if (raw == null || raw === '') continue;
    set.add(raw);
  }
  return Array.from(set);
}
