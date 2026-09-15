// GET /api/watches — public catalog read, server-side only (see api/_lib/catalog.js
// for why this can't just be an anon-key client query against the shared DB).
import { getWatches } from './_lib/catalog.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).end('Method not allowed');
    return;
  }
  try {
    const watches = await getWatches();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).json(watches);
  } catch (err) {
    console.error('[api/watches]', err);
    res.status(500).json({ error: 'Failed to load watches' });
  }
}
