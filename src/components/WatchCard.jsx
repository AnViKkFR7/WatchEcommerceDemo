import { Link } from 'react-router-dom';
import { useI18n, resolveBilingual, formatPrice } from '../lib/i18n/index.jsx';
import './WatchCard.css';

export default function WatchCard({ watch }) {
  const { t, locale } = useI18n();
  const { attrs } = watch;
  const brand = attrs.brand || '';
  const model = attrs.model || watch.title;
  const condition = resolveBilingual(attrs.condition, locale);
  const isNew = /nuevo|new/i.test(condition);

  return (
    <Link to={`/reloj/${watch.id}`} className="watch-card">
      <div className="watch-card-media">
        {watch.coverUrl ? (
          <img src={watch.coverUrl} alt={watch.coverAlt} loading="lazy" width="800" height="1000" />
        ) : (
          <div className="watch-card-media-empty" />
        )}
        <div className="watch-card-overlay">
          <span className="watch-card-view">
            {locale === 'en' ? 'View details' : 'Ver detalle'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <div className="watch-card-badges">
          {watch.status === 'bajo_reserva' && <span className="badge badge-reserved">{t('product.status.reserved')}</span>}
          {watch.status === 'disponible' && <span className="badge badge-available">{t('product.status.available')}</span>}
        </div>
      </div>

      <div className="watch-card-body">
        <div className="watch-card-heading">
          <span className="watch-card-brand">{brand}</span>
          <span className={`badge badge-condition ${isNew ? 'is-new' : 'is-used'}`}>{condition}</span>
        </div>
        <h3 className="watch-card-title">{model}</h3>
        <p className="watch-card-price">{formatPrice(attrs.price, attrs.currency, locale)}</p>
      </div>
    </Link>
  );
}
