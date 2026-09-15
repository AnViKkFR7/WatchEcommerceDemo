// Client-side analytics instrumentation — mirrors ANALYTICS_INTEGRATION.md
// (§3) exactly so it plugs into the shared moira ordo admin dashboard.
const ENDPOINT = '/api/track';
const COMPANY_ID = import.meta.env.VITE_COMPANY_ID;

// Per-tab session id, in memory only (no localStorage/cookies — see the
// integration guide for why this sidesteps cookie-consent requirements).
const sessionId = crypto.randomUUID();

function send(eventType, extra) {
  if (!COMPANY_ID) {
    console.warn('[analytics] VITE_COMPANY_ID no configurado — evento descartado');
    return;
  }
  const body = JSON.stringify({
    company_id: COMPANY_ID,
    event_type: eventType,
    session_id: sessionId,
    ...extra,
  });
  try {
    navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
  } catch {
    // sendBeacon unsupported/blocked — fail silently, never block the UI
  }
}

export const trackPageview = (path) => send('page_view', { path });

export const trackEvent = (key) => send('cta_click', { path: window.location.pathname, event_key: key });

/** Delegated listener: any element with [data-track-event] is auto-tracked. */
export function initAutoTracking() {
  document.addEventListener('click', (e) => {
    const el = e.target?.closest?.('[data-track-event]');
    const key = el?.getAttribute('data-track-event');
    if (key) trackEvent(key);
  });
}
