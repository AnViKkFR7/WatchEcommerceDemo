import { useRef, useState } from 'react';
import { useI18n } from '../lib/i18n/index.jsx';
import './ImageZoom.css';

export default function ImageZoom({ src, alt }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const { t } = useI18n();

  function handleMove(e) {
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }

  return (
    <div
      ref={ref}
      className={`image-zoom ${active ? 'is-active' : ''}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onMouseMove={handleMove}
    >
      {src ? (
        <img src={src} alt={alt} style={{ transformOrigin: origin }} />
      ) : (
        <div className="image-zoom-empty" />
      )}
      <span className="image-zoom-hint">{t('product.gallery.zoomHint')}</span>
    </div>
  );
}
