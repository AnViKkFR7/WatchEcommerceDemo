import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Landing from './pages/Landing.jsx';
import Catalog from './pages/Catalog.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';
import { useI18n } from './lib/i18n/index.jsx';
import { trackPageview } from './lib/analytics.js';

function usePageviewTracking() {
  const location = useLocation();
  useEffect(() => {
    trackPageview(location.pathname);
    if (location.hash) {
      requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' }));
    } else window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname, location.hash]);
}

export default function App() {
  usePageviewTracking();
  const { locale } = useI18n();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">{locale === 'en' ? 'Skip to content' : 'Saltar al contenido'}</a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/tienda" element={<Catalog />} />
          <Route path="/reloj/:id" element={<ProductDetail />} />
          <Route path="/sobre-nosotros" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
