import './PageHero.css';

export default function PageHero({ eyebrow, title, subtitle, image, compact = false }) {
  return (
    <section className={`page-hero ${compact ? 'page-hero-compact' : ''}`}>
      <div className="page-hero-media">
        <img src={image} alt="" aria-hidden="true" loading="eager" />
      </div>
      <div className="container page-hero-content">
        {eyebrow && <p className="eyebrow page-hero-eyebrow">{eyebrow}</p>}
        <h1 className="page-hero-title">{title}</h1>
        {subtitle && <p className="page-hero-subtitle">{subtitle}</p>}
      </div>
    </section>
  );
}
