import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import { useApp } from '../context/AppContext';

export default function NotificationsPage() {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
  } = useApp();

  return (
    <>
      <section className="page-intro notifications-page__intro">
        <div>
          <h1 className="page-intro__title font-display">Bildirişlər</h1>
          {unreadNotificationsCount > 0 && (
            <p className="notifications-page__unread">{unreadNotificationsCount} oxunmamış</p>
          )}
        </div>

        {unreadNotificationsCount > 0 && (
          <button
            type="button"
            className="btn btn--ghost btn--sm notifications-page__mark-all"
            onClick={markAllNotificationsRead}
          >
            <CheckCheck size={15} />
            Hamısını oxudum
          </button>
        )}
      </section>

      {notifications.length === 0 ? (
        <EmptyState text="Bildiriş yoxdur." icon={Bell} />
      ) : (
        <div className="notifications-list">
          {notifications.map((item) => (
            <article
              key={item.id}
              className={`notifications-list__item ${item.read ? '' : 'notifications-list__item--unread'}`}
            >
              <div className="notifications-list__content">
                <p>{item.text}</p>
                <time>{item.time}</time>
              </div>

              <div className="notifications-list__actions">
                {!item.read && (
                  <button
                    type="button"
                    className="notifications-list__action"
                    onClick={() => markNotificationRead(item.id)}
                    aria-label="Oxudum"
                    title="Oxudum"
                  >
                    <Check size={15} />
                  </button>
                )}
                <button
                  type="button"
                  className="notifications-list__action notifications-list__action--danger"
                  onClick={() => deleteNotification(item.id)}
                  aria-label="Sil"
                  title="Sil"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
