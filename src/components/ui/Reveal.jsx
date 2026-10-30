import { useLayoutEffect, useRef } from 'react';
import styles from './Reveal.module.css';
const entries = new Map();
let observer, preference;
let frame = 0;
function tick() {
  frame = 0;
  const height = window.innerHeight;
  const measurements = [...entries.values()].filter(e => e.active).map(e => ({ e, top: e.el.getBoundingClientRect().top }));
  let moving = false;
  for (const { e, top } of measurements) {
    const target = preference.matches ? 1 : Math.max(0, Math.min(1, (height - top) / (height * .35)));
    e.value += (target - e.value) * .18;
    if (Math.abs(target - e.value) < .002) e.value = target;
    else moving = true;
    const progress = 1 - (1 - e.value) ** 2;
    e.inner.style.opacity = String(Math.min(1, .15 + progress));
    e.inner.style.transform = 'translate3d(0,' + (1 - progress) * 24 + 'px,0)';
  }
  if (moving) frame = requestAnimationFrame(tick);
}
function wake() { if (!frame) frame = requestAnimationFrame(tick); }
function setUp() {
  if (observer) return;
  preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  observer = new IntersectionObserver(records => {
    records.forEach(r => { const e = entries.get(r.target); if (e) e.active = r.isIntersecting; });
    wake();
  }, { rootMargin: '20% 0px' });
  window.addEventListener('scroll', wake, { passive: true });
  window.addEventListener('resize', wake, { passive: true });
  preference.addEventListener('change', wake);
}
export default function Reveal({ children, className = '' }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const el = ref.current;
    setUp();
    // Measure the stationary wrapper to avoid feeding the animated offset back into the calculation.
    entries.set(el, { el, inner: el.firstElementChild, value: el.getBoundingClientRect().top < window.innerHeight * .65 ? 1 : 0, active: true });
    observer.observe(el); wake();
    return () => {
      entries.delete(el); observer.unobserve(el);
      if (!entries.size) {
        observer.disconnect(); observer = null;
        window.removeEventListener('scroll', wake); window.removeEventListener('resize', wake);
        preference.removeEventListener('change', wake);
        cancelAnimationFrame(frame); frame = 0;
      }
    };
  }, []);
  return <div ref={ref} className={className}><div className={styles.content}>{children}</div></div>;
}
