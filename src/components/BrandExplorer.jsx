import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n/index.jsx';
import { trackEvent } from '../lib/analytics.js';
import styles from './BrandExplorer.module.css';

export default function BrandExplorer({ brands }) {
  const [active, setActive] = useState(0);
  const { t } = useI18n();
  return (
    <div className={styles.explorer}>
      <nav className={styles.list} aria-label={t('brands.title')}>
        {brands.map((brand, i) => (
          <Link
            key={brand.name}
            to={'/tienda?brand=' + encodeURIComponent(brand.name)}
            className={active === i ? styles.selected : undefined}
            onPointerEnter={(event) => { if (event.pointerType === 'mouse') setActive(i); }}
            onFocus={() => setActive(i)}
            onClick={() => trackEvent('brand_tile_click')}
          >
            <img className={styles.tileImage} src={brand.image} alt="" width="800" height="1000" loading="lazy" />
            <span>{brand.name}</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" /></svg>
          </Link>
        ))}
      </nav>
      <div className={styles.preview} aria-hidden="true">
        {brands.map((brand, i) => (
          <img key={brand.name} src={brand.image} alt="" className={i === active ? styles.active : ''} width="800" height="1000" loading="lazy" />
        ))}
      </div>
    </div>
  );
}
