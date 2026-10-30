import { useRef, useState } from 'react';
import { useI18n } from '../lib/i18n/index.jsx';
import './ImageZoom.css';

export default function ImageZoom({ src, alt }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const { t, locale } = useI18n();
  function handleMove(e) {
    if (e.pointerType !== 'mouse') return;
    const rect = ref.current.getBoundingClientRect();
    const image = ref.current.querySelector('img');
    if (image) image.style.transformOrigin = ((e.clientX - rect.left) / rect.width) * 100 + '% ' + ((e.clientY - rect.top) / rect.height) * 100 + '%';
  }
  return (
    <button type="button" ref={ref} className={'image-zoom ' + (active ? 'is-active' : '')}
      aria-label={locale === 'en' ? 'Enlarge watch image' : 'Ampliar imagen del reloj'}
      aria-pressed={active}
      onClick={() => setActive(v => !v)}
      onPointerLeave={() => setActive(false)}
      onPointerMove={handleMove}
      onKeyDown={e => { if (e.key === 'Escape') setActive(false); }}>
      {src ? <img src={src} alt={alt} width="1000" height="1000" fetchPriority="high" /> : <div className="image-zoom-empty" />}
      <span className="image-zoom-hint">{t('product.gallery.zoomHint')}</span>
      <span className="image-zoom-control" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.3" /><path d="m15 15 6 6M7 10h6" stroke="currentColor" strokeWidth="1.3" />{!active && <path d="M10 7v6" stroke="currentColor" strokeWidth="1.3" />}</svg>
      </span>
    </button>
  );
}
