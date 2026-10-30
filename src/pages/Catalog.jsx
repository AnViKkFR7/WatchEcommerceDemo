import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useI18n, resolveBilingual } from '../lib/i18n/index.jsx';
import { fetchWatches } from '../lib/watches.js';
import { trackEvent } from '../lib/analytics.js';
import WatchCard from '../components/WatchCard.jsx';
import WatchCardSkeleton from '../components/WatchCardSkeleton.jsx';
import FilterPanel, { buildFilterOptions } from '../components/FilterPanel.jsx';
import PageHero from '../components/PageHero.jsx';
import heroImage from '../assets/hero-2.jpg';
import Sheet from '../components/ui/Sheet.jsx';
import './Catalog.css';

const EMPTY_FILTERS = {
  brand: '',
  query: '',
  priceMin: '',
  priceMax: '',
  dialColor: '',
  bracelet: '',
  condition: '',
};

const HERO_IMAGE = heroImage;

function filtersFromParams(params) {
  return {
    brand: params.get('brand') || '',
    query: params.get('q') || '',
    priceMin: params.get('priceMin') || '',
    priceMax: params.get('priceMax') || '',
    dialColor: params.get('dialColor') || '',
    bracelet: params.get('bracelet') || '',
    condition: params.get('condition') || '',
  };
}

function paramsFromFilters(filters, sort) {
  const params = {};
  for (const [k, v] of Object.entries(filters)) {
    if (v) params[k === 'query' ? 'q' : k] = v;
  }
  if (sort && sort !== 'newest') params.sort = sort;
  return params;
}

export default function Catalog() {
  const { t, locale } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(() => filtersFromParams(searchParams));
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    fetchWatches().then((watches) => {
      setAll(watches);
      setLoading(false);
    });
  }, []);

  // Re-sync from URL when it changes externally (e.g. a brand tile link).
  useEffect(() => {
    setFilters(filtersFromParams(searchParams));
    setSort(searchParams.get('sort') || 'newest');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const options = useMemo(() => buildFilterOptions(all, locale), [all, locale]);

  const filtered = useMemo(() => {
    let list = all;
    if (filters.brand) list = list.filter((w) => w.attrs.brand === filters.brand);
    if (filters.query) {
      const q = filters.query.toLowerCase();
      list = list.filter((w) => {
        const model = String(w.attrs.model || '').toLowerCase();
        const ref = String(w.attrs.reference_number || '').toLowerCase();
        const title = w.title.toLowerCase();
        return model.includes(q) || ref.includes(q) || title.includes(q);
      });
    }
    if (filters.priceMin) list = list.filter((w) => (w.attrs.price || 0) >= Number(filters.priceMin));
    if (filters.priceMax) list = list.filter((w) => (w.attrs.price || 0) <= Number(filters.priceMax));
    if (filters.dialColor) list = list.filter((w) => JSON.stringify(w.attrs.dial_color) === filters.dialColor);
    if (filters.bracelet) list = list.filter((w) => JSON.stringify(w.attrs.bracelet_material) === filters.bracelet);
    if (filters.condition) {
      list = list.filter((w) => {
        const cond = resolveBilingual(w.attrs.condition, 'en').toLowerCase();
        const isNew = cond.includes('new');
        return filters.condition === 'new' ? isNew : !isNew;
      });
    }
    if (searchParams.get('featured') === '1') list = list.filter((w) => w.attrs.is_featured);

    const sorted = [...list];
    if (sort === 'priceAsc') sorted.sort((a, b) => (a.attrs.price || 0) - (b.attrs.price || 0));
    else if (sort === 'priceDesc') sorted.sort((a, b) => (b.attrs.price || 0) - (a.attrs.price || 0));
    return sorted;
  }, [all, filters, sort, searchParams]);

  // Filters apply live, the moment a control changes — no separate "apply" step.
  function handleFiltersChange(next) {
    setFilters(next);
    setSearchParams(paramsFromFilters(next, sort), { replace: true });
    trackEvent('filter_apply');
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS);
    setSort('newest');
    setSearchParams({});
  }

  function handleSortChange(value) {
    setSort(value);
    setSearchParams(paramsFromFilters(filters, value));
  }

  return (
    <div className="catalog">
      <PageHero
        eyebrow={t('search.heroEyebrow')}
        title={t('search.title')}
        subtitle={t('search.subtitle')}
        image={HERO_IMAGE}
        compact
      />

      <div className="container catalog-body">
        <aside className="catalog-sidebar">
          <h2 className="catalog-sidebar-title">{t('search.filters.title')}</h2>
          <FilterPanel filters={filters} onChange={handleFiltersChange} options={options} onClear={clearFilters} idPrefix="d-" />
        </aside>

        <div className="catalog-main">
          <div className="catalog-toolbar">
            <button type="button" className="catalog-filter-toggle" onClick={() => setMobileFiltersOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              {t('search.openFilters')}
            </button>
            <p className="catalog-count" role="status" aria-live="polite">{loading ? '' : t('search.resultsCount', { count: filtered.length })}</p>
            <div className="catalog-sort">
              <label htmlFor="sort">{t('search.sort.label')}</label>
              <select id="sort" value={sort} onChange={(e) => handleSortChange(e.target.value)}>
                <option value="newest">{t('search.sort.newest')}</option>
                <option value="priceAsc">{t('search.sort.priceAsc')}</option>
                <option value="priceDesc">{t('search.sort.priceDesc')}</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="watch-grid catalog-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <WatchCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length ? (
            <div className="watch-grid catalog-grid">
              {filtered.map((w) => (
                <WatchCard watch={w} key={w.id} />
              ))}
            </div>
          ) : (
            <div className="catalog-empty">
              <h3>{t('search.noResults.title')}</h3>
              <p>{t('search.noResults.subtitle')}</p>
              <button type="button" className="btn btn-outline-light" onClick={clearFilters}>
                {t('search.noResults.reset')}
              </button>
            </div>
          )}
        </div>
      </div>

      <Sheet open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} title={t('search.filters.title')} closeLabel={locale === 'en' ? 'Close filters' : 'Cerrar filtros'}>
            <FilterPanel
              filters={filters}
              onChange={handleFiltersChange}
              options={options}
              onClear={clearFilters}
              idPrefix="m-"
              resultsCount={filtered.length}
              onDone={() => setMobileFiltersOpen(false)}
            />
      </Sheet>
    </div>
  );
}
