import { useCallback, useState } from 'react';
import { ArrowLeft, Ban, Flag, X } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { getDisplayUsername } from '../../data/mockData';
import { clampText, LIMITS } from '../../utils/security';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';
import useEscapeKey from '../../hooks/useEscapeKey';
import useFocusTrap from '../../hooks/useFocusTrap';

export default function UserProfileActionsModal({
  user,
  isBlocked,
  onBlock,
  onReport,
  onClose,
}) {
  const [step, setStep] = useState('menu');
  const [reportText, setReportText] = useState('');
  const [error, setError] = useState('');

  const handleClose = useCallback(() => onClose?.(), [onClose]);
  const cardRef = useFocusTrap(true);
  useBodyScrollLock(true);
  useEscapeKey(handleClose, true);

  const username = getDisplayUsername(user.handle);

  const submitReport = () => {
    const reason = clampText(reportText, LIMITS.commentText);
    if (!reason) {
      setError('Şikayət səbəbini qısaca yazın.');
      return;
    }
    onReport(reason);
    setStep('done');
    setError('');
  };

  const submitBlock = () => {
    onBlock();
    handleClose();
  };

  return (
    <div className="user-actions-overlay" role="presentation">
      <button
        type="button"
        className="user-actions-overlay__backdrop"
        onClick={handleClose}
        aria-label="Bağla"
      />

      <div
        ref={cardRef}
        className="user-actions-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-actions-title"
      >
        <header className="user-actions-modal__header">
          {step !== 'menu' && step !== 'done' && (
            <button
              type="button"
              className="user-actions-modal__back"
              onClick={() => {
                setStep('menu');
                setError('');
              }}
              aria-label="Geri"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <h3 id="user-actions-title" className="user-actions-modal__title font-display">
            {step === 'report' && 'Şikayət et'}
            {step === 'block' && 'Blokla'}
            {step === 'done' && 'Şikayət göndərildi'}
            {step === 'menu' && 'Seçimlər'}
          </h3>
          <button type="button" className="user-actions-modal__close" onClick={handleClose} aria-label="Bağla">
            <X size={18} />
          </button>
        </header>

        <div className="user-actions-modal__body">
          <div className="user-actions-modal__user">
            <Avatar initials={user.initials} src={user.avatarUrl} size={44} name={username} />
            <div>
              <p className="user-actions-modal__name">{username}</p>
              <p className="user-actions-modal__handle">{user.handle}</p>
            </div>
          </div>

          {step === 'menu' && (
            <ul className="user-actions-modal__list">
              <li>
                <button
                  type="button"
                  className="user-actions-modal__option user-actions-modal__option--danger"
                  onClick={() => setStep('block')}
                  disabled={isBlocked}
                >
                  <Ban size={18} />
                  <span>{isBlocked ? 'Artıq bloklanıb' : 'Blokla'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="user-actions-modal__option"
                  onClick={() => setStep('report')}
                >
                  <Flag size={18} />
                  <span>Şikayət et</span>
                </button>
              </li>
            </ul>
          )}

          {step === 'block' && (
            <div className="user-actions-modal__panel">
              <p className="user-actions-modal__text">
                <strong>{username}</strong> sizi izləyə bilməyəcək, postlarınızı görməyəcək və
                mesaj göndərə bilməyəcək. Bu əməliyyatı parametrlərdən geri qaytara bilərsiniz.
              </p>
              <div className="user-actions-modal__actions">
                <button type="button" className="btn btn--ghost" onClick={() => setStep('menu')}>
                  Ləğv et
                </button>
                <button type="button" className="btn btn--primary" onClick={submitBlock}>
                  Blokla
                </button>
              </div>
            </div>
          )}

          {step === 'report' && (
            <div className="user-actions-modal__panel">
              <p className="user-actions-modal__text">
                Bu istifadəçi haqqında nə baş verdiyini qısaca yazın. Komandamız yoxlayacaq.
              </p>
              <textarea
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                className="input user-actions-modal__textarea"
                placeholder="Məs: spam postlar, təhqiredici mesajlar..."
                maxLength={LIMITS.commentText}
                rows={4}
              />
              {error && <p className="user-actions-modal__error">{error}</p>}
              <div className="user-actions-modal__actions">
                <button type="button" className="btn btn--ghost" onClick={() => setStep('menu')}>
                  Ləğv et
                </button>
                <button type="button" className="btn btn--primary" onClick={submitReport}>
                  Göndər
                </button>
              </div>
            </div>
          )}

          {step === 'done' && (
            <div className="user-actions-modal__panel">
              <p className="user-actions-modal__text">
                Şikayətiniz qəbul olundu. Təhlükəsizlik komandamız qısa müddətdə yoxlayacaq.
              </p>
              <div className="user-actions-modal__actions">
                <button type="button" className="btn btn--primary" onClick={handleClose}>
                  Bağla
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
