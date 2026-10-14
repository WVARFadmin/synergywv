import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])';

// A drawer that slides in from one side of the app column. Modal: focus moves
// in on open, Tab is kept inside, Escape or the scrim closes it, and focus
// returns to whatever opened it.
export function Sheet({ side = 'left', title, onClose, children }) {
  const panelRef = useRef(null);
  const titleId = `sheet-title-${side}`;

  useEffect(() => {
    const opener = document.activeElement;
    const panel = panelRef.current;
    panel?.querySelector(FOCUSABLE)?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !panel) return;
      const items = [...panel.querySelectorAll(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet-frame">
        <div
          ref={panelRef}
          className={`sheet sheet-${side}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={e => e.stopPropagation()}
        >
          <div className="sheet-head">
            <h2 id={titleId}>{title}</h2>
            <button type="button" className="sheet-close" onClick={onClose} aria-label={`Close ${title.toLowerCase()}`}>
              <X aria-hidden="true" />
            </button>
          </div>
          <div className="sheet-body">{children}</div>
        </div>
      </div>
    </div>
  );
}
