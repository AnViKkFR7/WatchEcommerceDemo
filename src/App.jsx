import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Landing from './pages/Landing.jsx';
import Catalog from './pages/Catalog.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';
import { trackPageview } from './lib/analytics.js';

function usePageviewTracking() {
  const location = useLocation();
  useEffect(() => {
    trackPageview(location.pathname);
    // Jump to top immediately on every route change (no smooth-scroll
    // animation, no hash-anchor exception) — the browser's own scroll
    // restoration is disabled below so this is the only thing moving the
    // viewport on navigation.
    window.scrollTo(0, 0);
  }, [location.pathname]);
}

export default function App() {
  usePageviewTracking();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <>
      <Navbar />
      <main>
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
