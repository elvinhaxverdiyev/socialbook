import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function LegalModal({ title, sections, onClose }) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  return (
    <div className="legal-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="legal-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
      >
        <header className="legal-modal__header">
          <h3 id="legal-modal-title" className="legal-modal__title font-display">{title}</h3>
          <button type="button" className="legal-modal__close" onClick={onClose} aria-label="Bağla">
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
