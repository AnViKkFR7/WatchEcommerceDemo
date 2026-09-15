import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useI18n, resolveBilingual, formatPrice } from '../lib/i18n/index.jsx';
import { fetchWatches, getRelatedWatches, SPEC_GROUPS, specValueSuffix } from '../lib/watches.js';
import ImageZoom from '../components/ImageZoom.jsx';
import WhatsappCTA from '../components/WhatsappCTA.jsx';
import WatchCard from '../components/WatchCard.jsx';
import './ProductDetail.css';

function useWatch(id) {
  const [state, setState] = useState({ loading: true, watch: null, all: [] });
  useEffect(() => {
    let mounted = true;
    fetchWatches().then((all) => {
      if (!mounted) return;
      const watch = all.find((w) => w.id === id) || null;
      setState({ loading: false, watch, all });
    });
    return () => {
      mounted = false;
    };
  }, [id]);
  return state;
}

function SpecRow({ label, value }) {
  if (value == null || value === '') return null;
  return (
    <div className="spec-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { t, locale } = useI18n();
  const { loading, watch, all } = useWatch(id);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => setActiveImage(0), [id]);

  if (loading) {
    return (
      <div className="container product-detail">
        <div className="product-gallery">
          <div className="skeleton" style={{ aspectRatio: '1/1' }} />
        </div>
        <div className="product-info">
          <div className="skeleton" style={{ height: 16, width: '30%', marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 32, width: '70%', marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 24, width: '40%' }} />
        </div>
      </div>
    );
  }

  if (!watch) {
    return (
      <div className="container product-not-found">
        <h1>{t('product.notFound.title')}</h1>
        <p>{t('product.notFound.subtitle')}</p>
        <Link to="/tienda" className="btn btn-primary">
          {t('product.notFound.cta')}
        </Link>
      </div>
    );
  }

  const { attrs } = watch;
  const brand = attrs.brand || '';
  const model = attrs.model || watch.title;
  const condition = resolveBilingual(attrs.condition, locale);
  const shortDescription = resolveBilingual(attrs.short_description, locale) || watch.summary;
  const media = watch.media.length ? watch.media : [{ url_externa: watch.coverUrl, alt_text: watch.coverAlt }];
  const related = getRelatedWatches(watch, all);
  const functions = Array.isArray(attrs.functions) ? attrs.functions : [];

  return (
    <div className="product-page">
      <div className="container product-breadcrumb">
        <Link to="/tienda">{t('product.breadcrumb.shop')}</Link>
        <span aria-hidden="true">/</span>
        <span>{brand} {model}</span>
      </div>

      <div className="container product-detail">
        <div className="product-gallery">
          <ImageZoom src={media[activeImage]?.url_externa} alt={media[activeImage]?.alt_text || watch.title} />
          {media.length > 1 && (
            <div className="product-thumbs">
              {media.map((m, i) => (
                <button
                  key={m.id || i}
                  type="button"
                  className={`product-thumb ${i === activeImage ? 'is-active' : ''}`}
                  onClick={() => setActiveImage(i)}
                  aria-label={`${t('product.gallery.zoomHint')} ${i + 1}`}
                >
                  <img src={m.url_externa} alt={m.alt_text || ''} loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <div className="product-info-top">
            <span className="product-brand">{brand}</span>
            {watch.status === 'bajo_reserva' && <span className="badge badge-reserved">{t('product.status.reserved')}</span>}
            {watch.status === 'disponible' && <span className="badge badge-available">{t('product.status.available')}</span>}
          </div>
          <h1 className="product-title">{model}</h1>
          {attrs.reference_number && (
            <p className="product-reference">
              {t('product.reference')} {attrs.reference_number}
              {attrs.year ? ` · ${t('product.year')} ${attrs.year}` : ''}
            </p>
          )}
          <p className="product-price">{formatPrice(attrs.price, attrs.currency, locale)}</p>
          <span className="badge badge-condition product-condition-badge">{condition}</span>

          {shortDescription && <p className="product-description">{shortDescription}</p>}

          <div className="product-cta-panel">
            <WhatsappCTA watch={watch} />
            <p className="product-cta-subtitle">{t('product.cta.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="container product-specs">
        <h2>{t('product.specs.title')}</h2>
        <div className="product-specs-grid">
          {SPEC_GROUPS.map((group) => {
            const rows = group.keys
              .map((key) => {
                const raw = attrs[key];
                if (raw == null || raw === '') return null;
                const value = `${resolveBilingual(raw, locale)}${specValueSuffix(key)}`;
                return { key, value };
              })
              .filter(Boolean);
            if (!rows.length) return null;
            return (
              <div className="spec-card" key={group.titleKey}>
                <h3>{t(group.titleKey)}</h3>
                <dl>
                  {rows.map((r) => (
                    <SpecRow key={r.key} label={t(`spec.${r.key}`) !== `spec.${r.key}` ? t(`spec.${r.key}`) : r.key} value={r.value} />
                  ))}
                </dl>
              </div>
            );
          })}

          {functions.length > 0 && (
            <div className="spec-card">
              <h3>{t('product.specs.functions')}</h3>
              <ul className="product-functions">
                {functions.map((f) => (
                  <li key={f}>{t(`func.${f}`) !== `func.${f}` ? t(`func.${f}`) : f}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="container product-related">
          <div className="section-heading">
            <h2>{t('product.related.title')}</h2>
          </div>
          <div className="watch-grid">
            {related.map((w) => (
              <WatchCard watch={w} key={w.id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
