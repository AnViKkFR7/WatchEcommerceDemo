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
      <img src={image} alt={name} loading="lazy" />
      <div className="brand-tile-overlay" />
      <span className="brand-tile-name">{name}</span>
    </Link>
  );
}
