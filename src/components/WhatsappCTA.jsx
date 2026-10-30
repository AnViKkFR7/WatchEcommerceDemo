import { useEffect, useState } from 'react';
import { useI18n } from '../lib/i18n/index.jsx';
import { fetchCompany, buildWhatsappUrl } from '../lib/company.js';

export default function WhatsappCTA({ watch, className = 'btn btn-whatsapp btn-block' }) {
  const { t } = useI18n();
  const [phone, setPhone] = useState(null);

  useEffect(() => {
    fetchCompany().then((c) => setPhone(c.contact_phone));
  }, []);

  const brand = watch.attrs.brand || '';
  const model = watch.attrs.model || watch.title;
  const ref = watch.attrs.reference_number || '—';
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const message = t('whatsapp.message', { watch: `${brand} ${model}`.trim(), ref, url });
  const href = buildWhatsappUrl(phone, message);
  const label = watch.status === 'bajo_reserva' ? t('product.cta.whatsappReserved') : t('product.cta.whatsapp');

  return (
    <a href={href} target="_blank" rel="noreferrer" className={className} data-track-event="whatsapp_click">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.3.2-.4.1-.2 0-.3 0-.4 0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.4 3.9 3.4.5.2 1 .4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3Z" />
      </svg>
      {label}
    </a>
  );
}
