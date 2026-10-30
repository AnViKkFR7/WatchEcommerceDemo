import { Link } from 'react-router-dom';
import { trackEvent } from '../lib/analytics.js';
import './BrandTile.css';

export default function BrandTile({ name, image }) {
  return (
    <Link
      to={`/tienda?brand=${encodeURIComponent(name)}`}
      className="brand-tile"
      onClick={() => trackEvent('brand_tile_click')}
    >
      <img src={image} alt="" loading="lazy" width="800" height="1000" />
      <div className="brand-tile-overlay" />
      <span className="brand-tile-name">{name}</span>
      <svg className="brand-tile-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.3" /></svg>
    </Link>
  );
}
