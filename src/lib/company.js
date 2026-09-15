const FALLBACK_COMPANY = {
  name: 'TimeCraft',
  contact_phone: '+34600000000',
  contact_email: 'hola@timecraft.demo',
};

let cache = null;

/** Public contact info only, via /api/company — see api/_lib/catalog.js. */
export async function fetchCompany() {
  if (cache) return cache;
  try {
    const res = await fetch('/api/company');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    cache = await res.json();
  } catch (err) {
    console.warn('[company] using fallback contact info:', err.message);
    cache = FALLBACK_COMPANY;
  }
  return cache;
}

export function buildWhatsappUrl(phone, message) {
  let digits = (phone || FALLBACK_COMPANY.contact_phone).replace(/[^\d+]/g, '').replace(/^\+/, '');
  // Numbers stored without a country code (e.g. a 9-digit Spanish mobile)
  // need one for wa.me to resolve correctly — default to Spain (+34) since
  // that's this demo's market. Real deployments should store E.164 numbers.
  if (digits.length <= 9) digits = `34${digits}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
