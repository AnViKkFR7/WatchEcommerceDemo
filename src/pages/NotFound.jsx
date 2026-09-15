import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n/index.jsx';
import './NotFound.css';

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="not-found">
      <span className="not-found-mark">TimeCraft</span>
      <h1>{t('notFound.title')}</h1>
      <p>{t('notFound.subtitle')}</p>
      <Link to="/" className="btn btn-primary">
        {t('notFound.cta')}
      </Link>
    </div>
  );
}
