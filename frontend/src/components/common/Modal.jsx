import { useEffect } from 'react';
export default function Modal({ open, title, children, onClose }) {
  useEffect(() => { if (!open) return undefined; const closeOnEscape = (event) => event.key === 'Escape' && onClose?.(); window.addEventListener('keydown', closeOnEscape); return () => window.removeEventListener('keydown', closeOnEscape); }, [open, onClose]);
  if (!open) return null;
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}><section className="modal-panel" role="dialog" aria-modal="true" aria-label={title}><header><h2>{title}</h2><button type="button" aria-label="Close dialog" onClick={onClose}>×</button></header>{children}</section></div>;
}
