import { useCallback } from 'react';
import { X } from 'lucide-react';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';
import useEscapeKey from '../../hooks/useEscapeKey';
import useFocusTrap from '../../hooks/useFocusTrap';

export function LegalDocument({ content }) {
  return (
    <div className="legal-document">
      {content.updatedAt && (
        <p className="legal-document__meta">Son yenilənmə: {content.updatedAt}</p>
      )}

      {content.intro?.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}

      {(content.sections || []).map((section) => (
        <section key={section.heading} className="legal-document__section">
          <h3>{section.heading}</h3>
          {section.text && <p>{section.text}</p>}
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.items?.length > 0 && (
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {section.after?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}

      {content.outro?.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

export default function LegalModal({ title, sections, content, onClose }) {
  const handleClose = useCallback(() => onClose?.(), [onClose]);
  const cardRef = useFocusTrap(true);
  useBodyScrollLock(true);
  useEscapeKey(handleClose, true);

  const document = content || { title, sections };

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
          <h3 id="legal-modal-title" className="legal-modal__title font-display">
            {document.title}
          </h3>
          <button type="button" className="legal-modal__close" onClick={handleClose} aria-label="Bağla">
            <X size={18} />
          </button>
        </header>

        <div className="legal-modal__body">
          <LegalDocument content={document} />
        </div>
      </div>
    </div>
  );
}
