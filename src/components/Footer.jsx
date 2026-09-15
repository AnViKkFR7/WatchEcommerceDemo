import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n/index.jsx';
import './Footer.css';

const SOCIALS = [
  { key: 'instagram', href: 'https://instagram.com', label: 'Instagram', path: 'M12 8.2A3.8 3.8 0 1 0 12 15.8 3.8 3.8 0 0 0 12 8.2ZM12 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM16.5 6.5a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8ZM17 3H7a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4Zm2 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10Z' },
  { key: 'facebook', href: 'https://facebook.com', label: 'Facebook', path: 'M13.5 21v-7.2h2.4l.4-2.8h-2.8V9.1c0-.8.2-1.4 1.4-1.4h1.5V5.2c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7v2.1H8.3v2.8h2.4V21h2.8Z' },
  { key: 'pinterest', href: 'https://pinterest.com', label: 'Pinterest', path: 'M12 3a9 9 0 0 0-3.3 17.4c0-.7 0-1.6.2-2.3l1.4-5.8s-.3-.7-.3-1.6c0-1.5.9-2.7 2-2.7.9 0 1.4.7 1.4 1.6 0 1-.6 2.4-1 3.7-.2 1 .5 1.8 1.5 1.8 1.9 0 3.2-2.4 3.2-5.2 0-2.1-1.5-3.8-4.1-3.8-3 0-4.9 2.2-4.9 4.7 0 .9.3 1.5.7 2 .2.2.2.3.1.6l-.2.9c-.1.3-.3.4-.6.2-1.1-.4-1.6-1.7-1.6-3.1 0-2.3 2-5.1 5.9-5.1 3.1 0 5.2 2.3 5.2 4.7 0 3.2-1.8 5.7-4.4 5.7-.9 0-1.7-.5-2-1l-.6 2.1c-.2.7-.6 1.6-.9 2.1A9 9 0 1 0 12 3Z' },
  { key: 'tiktok', href: 'https://tiktok.com', label: 'TikTok', path: 'M16.5 3h-2.6v11.4a2.6 2.6 0 1 1-2.1-2.5v-2.7a5.3 5.3 0 1 0 4.7 5.2V8.6a6.8 6.8 0 0 0 3.4 1V6.9a4.1 4.1 0 0 1-3.4-3.9Z' },
];

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="footer-col footer-brand">
          <Link to="/" className="footer-logo">
            TimeCraft
          </Link>
          <p className="footer-tagline">{t('footer.tagline')}</p>
          <div className="footer-socials">
            {SOCIALS.map((s) => (
              <a key={s.key} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="footer-social">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="footer-col">
          <h4>{t('footer.shop')}</h4>
          <ul>
            <li><Link to="/tienda">{t('footer.shop.all')}</Link></li>
            <li><Link to="/tienda?condition=new">{t('footer.shop.new')}</Link></li>
            <li><Link to="/tienda?condition=used">{t('footer.shop.vintage')}</Link></li>
            <li><Link to="/tienda?featured=1">{t('footer.shop.featured')}</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>{t('footer.company')}</h4>
          <ul>
            <li><Link to="/sobre-nosotros">{t('footer.company.about')}</Link></li>
            <li><Link to="/sobre-nosotros#faq">{t('footer.company.faq')}</Link></li>
            <li><a href="mailto:hola@timecraft.demo">{t('footer.company.contact')}</a></li>
          </ul>
        </div>

        <div className="footer-col footer-newsletter">
          <h4>{t('footer.newsletter.title')}</h4>
          <p>{t('footer.newsletter.subtitle')}</p>
          <form
            className="footer-newsletter-form"
            onSubmit={(e) => e.preventDefault()}
            data-track-event="newsletter_form_open"
          >
            <input type="email" required placeholder={t('footer.newsletter.placeholder')} aria-label={t('footer.newsletter.placeholder')} />
            <button type="submit" className="btn btn-primary" data-track-event="newsletter_submit">
              {t('footer.newsletter.cta')}
            </button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>
            © {year} TimeCraft. {t('footer.copyright')}
          </p>
          <p>
            {t('footer.developedBy')}{' '}
            <a href="https://moiraordo.es" target="_blank" rel="noreferrer">
              moira ordo
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
