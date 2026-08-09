import { useCallback } from 'react';
import { X } from 'lucide-react';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';
import useEscapeKey from '../../hooks/useEscapeKey';
import useFocusTrap from '../../hooks/useFocusTrap';

export default function LegalModal({ title, sections, onClose }) {
  const handleClose = useCallback(() => onClose?.(), [onClose]);
  const cardRef = useFocusTrap(true);
  useBodyScrollLock(true);
  useEscapeKey(handleClose, true);

  return (
    <div className="legal-modal-overlay" role="presentation">
      <button
        type="button"
        className="legal-modal-overlay__backdrop"
        onClick={handleClose}
        aria-label="Bağla"
      />
      <div
        ref={cardRef}
        className="legal-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
      >
        <header className="legal-modal__header">
          <h3 id="legal-modal-title" className="legal-modal__title font-display">{title}</h3>
          <button type="button" className="legal-modal__close" onClick={handleClose} aria-label="Bağla">
            <X size={18} />
          </button>
        </header>

        <div className="legal-modal__body">
          {sections.map((section) => (
            <section key={section.heading} className="legal-modal__section">
              <h4>{section.heading}</h4>
              <p>{section.text}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
