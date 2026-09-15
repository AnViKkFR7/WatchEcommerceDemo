// GET /api/company — public contact info only (name, phone, email), never
// the full companies row (created_by, internal ids, etc.).
import { getCompanyPublicInfo } from './_lib/catalog.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).end('Method not allowed');
    return;
  }
  try {
    const company = await getCompanyPublicInfo();
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
    res.status(200).json(company);
  } catch (err) {
    console.error('[api/company]', err);
    res.status(500).json({ error: 'Failed to load company info' });
  }
}
