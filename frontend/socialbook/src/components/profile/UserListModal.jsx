import { useCallback } from 'react';
import { X } from '../../icons';
import Avatar from '../ui/Avatar';
import { useApp } from '../../context/AppContext';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';
import useEscapeKey from '../../hooks/useEscapeKey';
import useFocusTrap from '../../hooks/useFocusTrap';

export default function UserListModal({ title, users, onClose }) {
  const { following, toggleFollow, currentUser, openUserProfile } = useApp();
  const handleClose = useCallback(() => onClose?.(), [onClose]);
  const cardRef = useFocusTrap(true);
  useBodyScrollLock(true);
  useEscapeKey(handleClose, true);

  return (
    <div className="user-modal-overlay" role="presentation">
      <button
        type="button"
        className="user-modal-overlay__backdrop"
        onClick={handleClose}
        aria-label="Bağla"
      />
      <div
        ref={cardRef}
        className="user-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-modal-title"
      >
        <header className="user-modal__header">
          <h3 id="user-modal-title" className="user-modal__title font-display">{title}</h3>
          <button type="button" className="user-modal__close" onClick={handleClose} aria-label="Bağla">
            <X size={18} />
          </button>
        </header>

        <ul className="user-modal__list">
          {users.length === 0 && (
            <li className="user-modal__empty">Heç kim yoxdur.</li>
          )}

          {users.map((user) => {
            const isFollowing = following.has(user.handle);
            const isSelf = user.handle === currentUser.handle;

            return (
              <li key={user.id} className="user-modal__item">
                <button
                  type="button"
                  className="user-modal__profile-link"
                  onClick={() => {
                    handleClose();
                    openUserProfile(user.handle);
                  }}
                >
                  <Avatar initials={user.initials} src={user.avatarUrl} size={40} name={user.name} />
                  <div className="user-modal__info">
                    <p className="user-modal__name">{user.name}</p>
                    <p className="user-modal__handle">{user.handle}</p>
                  </div>
                </button>

                {!isSelf && (
                  <button
                    type="button"
                    className={`btn btn--sm ${isFollowing ? 'btn--ghost' : 'btn--primary'}`}
                    onClick={() => toggleFollow(user.handle, user)}
                    aria-pressed={isFollowing}
                  >
                    {isFollowing ? 'İzlənilir' : 'İzlə'}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
