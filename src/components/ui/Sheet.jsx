import { useEffect, useRef } from 'react';
import styles from './Sheet.module.css';
export default function Sheet({ open, onClose, title, closeLabel, children }) {
  const ref = useRef(null);
  function keepFocus(event) {
    if (event.key !== 'Tab') return;
    const controls = [...ref.current.querySelectorAll('button, a[href], input, select, textarea, [tabindex="0"]')]
      .filter(el => !el.disabled && el.getClientRects().length);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first?.focus();
    }
  }
  useEffect(() => {
    const dialog = ref.current;
    if (!open) { if (dialog.open) dialog.close(); return; }
    const trigger = document.activeElement;
    dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = previous; trigger?.focus(); };
  }, [open]);
  return (
    <dialog ref={ref} className={styles.sheet} aria-label={title} onKeyDown={keepFocus} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button autoFocus type="button" onClick={onClose} aria-label={closeLabel}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" /></svg>
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
