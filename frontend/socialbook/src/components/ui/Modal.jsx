import { useCallback } from 'react';
import { X } from 'lucide-react';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';
import useEscapeKey from '../../hooks/useEscapeKey';
import useFocusTrap from '../../hooks/useFocusTrap';

/**
 * Accessible dialog shell: scroll lock, Escape to close, focus trap, labelled title.
 */
export default function Modal({
  title,
  onClose,
  children,
  labelledBy = 'modal-title',
  className = '',
  overlayClassName = '',
  cardClassName = '',
  size = 'md',
  showClose = true,
}) {
  const handleClose = useCallback(() => onClose?.(), [onClose]);
  const cardRef = useFocusTrap(true);
  useBodyScrollLock(true);
  useEscapeKey(handleClose, true);

  return (
    <div className={`modal-overlay ${overlayClassName}`.trim()} role="presentation">
      <button
        type="button"
        className="modal-overlay__backdrop"
        onClick={handleClose}
        aria-label="Bağla"
      />
      <div
        ref={cardRef}
        className={`modal-card modal-card--${size} ${cardClassName} ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? labelledBy : undefined}
      >
        {(title || showClose) && (
          <header className="modal-card__header">
            {title ? (
              <h2 id={labelledBy} className="modal-card__title font-display">
                {title}
              </h2>
            ) : (
              <span />
            )}
            {showClose && (
              <button
                type="button"
                className="modal-card__close"
                onClick={handleClose}
                aria-label="Bağla"
              >
                <X size={18} />
              </button>
            )}
          </header>
        )}
        <div className="modal-card__body">{children}</div>
      </div>
    </div>
  );
}
