import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n/index.jsx';
import { fetchWatches } from '../lib/watches.js';
import WatchCard from '../components/WatchCard.jsx';
import WatchCardSkeleton from '../components/WatchCardSkeleton.jsx';
import BrandExplorer from '../components/BrandExplorer.jsx';
import rolexImage from '../assets/rolex-detail.webp';
import omegaImage from '../assets/omega-detail.webp';
import tagheuerImage from '../assets/tagheuer-detail.webp';
import seikoImage from '../assets/seiko-detail.webp';
import cartierImage from '../assets/cartier-detail.webp';
import iwcImage from '../assets/iwc-detail.webp';
import breitlingImage from '../assets/breitling-detail.webp';
import tissotImage from '../assets/tissot-detail.webp';
import Reveal from '../components/ui/Reveal.jsx';
import atelierImage from '../assets/hero-2.jpg';
import './Landing.css';

const BRANDS = [
  { name: 'Rolex', image: rolexImage },
  { name: 'Omega', image: omegaImage },
  { name: 'TAG Heuer', image: tagheuerImage },
  { name: 'Seiko', image: seikoImage },
  { name: 'Cartier', image: cartierImage },
  { name: 'IWC', image: iwcImage },
  { name: 'Breitling', image: breitlingImage },
  { name: 'Tissot', image: tissotImage },
];

const TRUST_ITEMS = [
  { key: 'shipping', icon: 'M3 7h11v8H3zM14 10h4l3 3v2h-7zM6.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z' },
  { key: 'warranty', icon: 'M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5l-8-3Z' },
  { key: 'returns', icon: 'M4 4v6h6M20 20v-6h-6M4 10a8 8 0 0 1 14-4.9M20 14a8 8 0 0 1-14 4.9' },
  { key: 'authenticity', icon: 'M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5l-8-3ZM9 12l2 2 4-4' },
  { key: 'support', icon: 'M12 3a9 9 0 0 0-9 9v4a2 2 0 0 0 2 2h1v-6H4v-.5A8 8 0 0 1 20 11.5v.5h-2v6h1a2 2 0 0 0 2-2v-4a9 9 0 0 0-9-9Z' },
];

function useFeaturedWatches() {
  const [state, setState] = useState({ loading: true, watches: [] });
  useEffect(() => {
    let mounted = true;
    fetchWatches().then((all) => {
      if (!mounted) return;
      const featured = all.filter((w) => w.attrs.is_featured);
      const list = (featured.length ? featured : all).slice(0, 4);
      setState({ loading: false, watches: list });
    });
    return () => {
      mounted = false;
    };
  }, []);
  return state;
}

function Testimonials({ items }) {
  const scrollerRef = useRef(null);
  const { t } = useI18n();

  function scrollBy(dir) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }

  return (
    <div className="testimonials-wrap">
      <div className="testimonials-scroller" ref={scrollerRef} tabIndex={0} role="region" aria-label={t('testimonials.title')}>
        {items.map((it, i) => (
          <figure className="testimonial-card" key={i}>
            <div className="testimonial-stars" aria-hidden="true">
              {'★★★★★'}
            </div>
            <blockquote>&ldquo;{it.quote}&rdquo;</blockquote>
            <figcaption>{it.name}</figcaption>
          </figure>
        ))}
      </div>
      <div className="testimonials-controls">
        <button type="button" onClick={() => scrollBy(-1)} aria-label="Anterior">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button type="button" onClick={() => scrollBy(1)} aria-label="Siguiente">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  );
}

export default function Landing() {
  const { t, locale } = useI18n();
  const { loading, watches } = useFeaturedWatches();

  const testimonials =
    locale === 'en'
      ? [
          { quote: 'The watch is absolutely stunning. Authentic, high quality and arrived in perfect condition.', name: 'James R.' },
          { quote: 'Fast, honest, and the WhatsApp support made the whole process so easy.', name: 'Sophia M.' },
          { quote: 'Great experience from start to finish. I would recommend TimeCraft to anyone who loves quality watches.', name: 'Daniel K.' },
        ]
      : [
          { quote: 'El reloj es absolutamente espectacular. Auténtico, de gran calidad y llegó en perfecto estado.', name: 'James R.' },
          { quote: 'Rápido, honesto, y la atención por WhatsApp hizo que todo el proceso fuera muy fácil.', name: 'Sophia M.' },
          { quote: 'Una experiencia excelente de principio a fin. Recomendaría TimeCraft a cualquiera que ame los buenos relojes.', name: 'Daniel K.' },
        ];

  return (
    <>
      <section className="hero">
        <div className="hero-layout">
          <div className="hero-content">
            <h1 className="hero-title">
              <span>{t('hero.title.line1')} <em>{t('hero.title.highlight')}</em></span>
              <span className="hero-title-ending">{t('hero.title.line2')}</span>
            </h1>
            <p className="hero-subtitle">{t('hero.subtitle')}</p>
            <div className="hero-actions">
              <Link to="/tienda" className="btn btn-primary">{t('hero.cta.primary')}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" /></svg></Link>
              <a href="#featured" className="text-link" onClick={(e) => {
                e.preventDefault();
                document.getElementById('featured')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
              }}>{t('hero.cta.secondary')}</a>
            </div>
          </div>
          <div className="hero-media">
            <img src={rolexImage} alt="" aria-hidden="true" fetchPriority="high" width="1000" height="1250" />
          </div>
        </div>
        <div className="hero-foot">
          <p className="eyebrow hero-eyebrow">{t('hero.eyebrow')}</p>
          <div className="hero-badge">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5l-8-3ZM9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.2" /></svg>
            <div><strong>{t('hero.badge.title')}</strong><span>{t('hero.badge.subtitle')}</span></div>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="container trust-strip-inner">
          {TRUST_ITEMS.map((item) => (
            <div className="trust-item" key={item.key}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d={item.icon} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <strong>{t(`trust.${item.key}.title`)}</strong>
                <span>{t(`trust.${item.key}.subtitle`)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section featured-section" id="featured">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t('featured.eyebrow')}</p>
              <h2>{t('featured.title')}</h2>
            </div>
            <Link to="/tienda" className="text-link">
              {t('featured.cta')}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </div>
          <div className="watch-grid">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <WatchCardSkeleton key={i} />)
              : watches.map((w) => <Reveal key={w.id}><WatchCard watch={w} /></Reveal>)}
          </div>
        </div>
      </section>

      <section className="callout">
        <div className="callout-media"><img src={atelierImage} alt="" loading="lazy" width="1536" height="864" /></div>
        <div className="container callout-inner">
          <p className="eyebrow">{t('callout.eyebrow')}</p>
          <h2>{t('callout.title')}</h2>
          <p className="callout-subtitle">{t('callout.subtitle')}</p>
          <Link to="/tienda" className="btn btn-primary">{t('callout.cta')}</Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t('brands.eyebrow')}</p>
              <h2>{t('brands.title')}</h2>
            </div>
          </div>
          <BrandExplorer brands={BRANDS} />
        </div>
      </section>

      <section className="section testimonials">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t('testimonials.eyebrow')}</p>
              <h2>{t('testimonials.title')}</h2>
            </div>
          </div>
          <Testimonials items={testimonials} />
        </div>
      </section>
    </>
  );
}
