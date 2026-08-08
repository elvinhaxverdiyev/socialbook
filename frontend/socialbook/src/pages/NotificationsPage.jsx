import { notifications } from '../data/mockData';

export default function NotificationsPage() {
  return (
    <>
      <section className="page-intro">
        <h1 className="page-intro__title font-display">Bildirişlər</h1>
      </section>

      <div className="notifications-list">
        {notifications.map((item) => (
          <article
            key={item.id}
            className={`notifications-list__item ${item.read ? '' : 'notifications-list__item--unread'}`}
          >
            <p>{item.text}</p>
            <time>{item.time}</time>
          </article>
        ))}
      </div>
    </>
  );
}
