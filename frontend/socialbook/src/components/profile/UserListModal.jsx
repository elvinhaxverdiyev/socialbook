import { useEffect } from 'react';
import { X } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { useApp } from '../../context/AppContext';

export default function UserListModal({ title, users, onClose }) {
  const { following, toggleFollow, currentUser, openUserProfile } = useApp();

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
    <div className="user-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="user-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-modal-title"
      >
        <header className="user-modal__header">
          <h3 id="user-modal-title" className="user-modal__title font-display">{title}</h3>
          <button type="button" className="user-modal__close" onClick={onClose} aria-label="Bağla">
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
                    onClose();
                    openUserProfile(user.handle);
                  }}
                >
                  <Avatar initials={user.initials} size={40} />
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
