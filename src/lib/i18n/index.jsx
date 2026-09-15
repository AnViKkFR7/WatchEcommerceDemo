import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import es from './dictionaries/es.json';
import en from './dictionaries/en.json';

const DICTIONARIES = { es, en };
const STORAGE_KEY = 'timecraft.locale';

const I18nContext = createContext(null);

function detectInitialLocale() {
  if (typeof window === 'undefined') return 'es';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'es' || stored === 'en') return stored;
  } catch {
    // localStorage unavailable — fall through to default
  }
  return 'es';
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(detectInitialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore — pure UI preference, not critical
    }
  }, [locale]);

  const setLocale = useCallback((next) => {
    setLocaleState(next === 'en' ? 'en' : 'es');
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => (prev === 'es' ? 'en' : 'es'));
  }, []);

  const t = useCallback(
    (key, vars) => {
      let str = DICTIONARIES[locale]?.[key] ?? DICTIONARIES.es[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replaceAll(`{${k}}`, String(v));
        }
      }
      return str;
    },
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, toggleLocale, t }), [locale, setLocale, toggleLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

/**
 * Resolves the bilingual convention used across attribute_definitions.label
 * and free-text attribute_values (see SPECS.md §4): a JSON string or object
 * shaped {"es":"...","en":"..."}. Plain strings are returned as-is for both
 * locales, so untranslated data never breaks the page.
 */
export function resolveBilingual(value, locale) {
  if (value == null) return '';
  if (typeof value === 'object') {
    return value[locale] ?? value.es ?? value.en ?? '';
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.startsWith('{') && trimmed.includes('"es"')) {
      try {
        const parsed = JSON.parse(trimmed);
        return parsed[locale] ?? parsed.es ?? parsed.en ?? value;
      } catch {
        return value;
      }
    }
    return value;
  }
  return String(value);
}

export function formatPrice(amount, currency = 'EUR', locale = 'es') {
  if (amount == null) return '';
  try {
    return new Intl.NumberFormat(locale === 'en' ? 'en-IE' : 'es-ES', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}
