import { useI18n, resolveBilingual } from '../lib/i18n/index.jsx';
import './FilterPanel.css';

export default function FilterPanel({ filters, onChange, options, onClear, idPrefix = '', resultsCount, onDone }) {
  const { t } = useI18n();

  function set(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="filter-panel">
      <div className="filter-panel-head">
        <button type="button" className="filter-clear" onClick={onClear}>
          {t('search.filters.clear')}
        </button>
      </div>

      <div className="filter-panel-fields">
      <div className="filter-group">
        <label htmlFor={`${idPrefix}brand`}>{t('search.filters.brand')}</label>
        <select id={`${idPrefix}brand`} value={filters.brand} onChange={(e) => set('brand', e.target.value)}>
          <option value="">{t('search.filters.brand.all')}</option>
          {options.brands.map((b) => (
            <option value={b} key={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor={`${idPrefix}query`}>{t('search.filters.query')}</label>
        <input
          id={`${idPrefix}query`}
          type="text"
          value={filters.query}
          placeholder={t('search.filters.query.placeholder')}
          onChange={(e) => set('query', e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>{t('search.filters.price')}</label>
        <div className="filter-price-row">
          <input
            type="number"
            min="0"
            inputMode="numeric"
            aria-label={t('search.filters.price.min')}
            placeholder={t('search.filters.price.min')}
            value={filters.priceMin}
            onChange={(e) => set('priceMin', e.target.value)}
          />
          <span>—</span>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            aria-label={t('search.filters.price.max')}
            placeholder={t('search.filters.price.max')}
            value={filters.priceMax}
            onChange={(e) => set('priceMax', e.target.value)}
          />
        </div>
      </div>

      <div className="filter-group">
        <label htmlFor={`${idPrefix}dial`}>{t('search.filters.dialColor')}</label>
        <select id={`${idPrefix}dial`} value={filters.dialColor} onChange={(e) => set('dialColor', e.target.value)}>
          <option value="">{t('search.filters.dialColor.all')}</option>
          {options.dialColors.map((c) => (
            <option value={c.raw} key={c.raw}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor={`${idPrefix}bracelet`}>{t('search.filters.bracelet')}</label>
        <select id={`${idPrefix}bracelet`} value={filters.bracelet} onChange={(e) => set('bracelet', e.target.value)}>
          <option value="">{t('search.filters.bracelet.all')}</option>
          {options.bracelets.map((b) => (
            <option value={b.raw} key={b.raw}>
              {b.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>{t('search.filters.condition')}</label>
        <div className="filter-radio-group">
          <label className="filter-radio">
            <input type="radio" name={`${idPrefix}condition`} checked={filters.condition === ''} onChange={() => set('condition', '')} />
            {t('search.filters.condition.all')}
          </label>
          <label className="filter-radio">
            <input type="radio" name={`${idPrefix}condition`} checked={filters.condition === 'new'} onChange={() => set('condition', 'new')} />
            {t('search.filters.condition.new')}
          </label>
          <label className="filter-radio">
            <input type="radio" name={`${idPrefix}condition`} checked={filters.condition === 'used'} onChange={() => set('condition', 'used')} />
            {t('search.filters.condition.used')}
          </label>
        </div>
      </div>
      </div>

      {onDone && (
        <div className="filter-panel-done">
          <button type="button" className="btn btn-primary btn-block" onClick={onDone}>
            {t('search.filters.viewResults', { count: resultsCount ?? 0 })}
          </button>
        </div>
      )}
    </div>
  );
}

export function buildFilterOptions(watches, locale) {
  const brands = new Set();
  const dialColors = new Map();
  const bracelets = new Map();
  for (const w of watches) {
    if (w.attrs.brand) brands.add(w.attrs.brand);
    if (w.attrs.dial_color != null && w.attrs.dial_color !== '') {
      dialColors.set(JSON.stringify(w.attrs.dial_color), resolveBilingual(w.attrs.dial_color, locale));
    }
    if (w.attrs.bracelet_material != null && w.attrs.bracelet_material !== '') {
      bracelets.set(JSON.stringify(w.attrs.bracelet_material), resolveBilingual(w.attrs.bracelet_material, locale));
    }
  }
  return {
    brands: Array.from(brands).sort(),
    dialColors: Array.from(dialColors, ([raw, label]) => ({ raw, label })).sort((a, b) => a.label.localeCompare(b.label)),
    bracelets: Array.from(bracelets, ([raw, label]) => ({ raw, label })).sort((a, b) => a.label.localeCompare(b.label)),
  };
}
