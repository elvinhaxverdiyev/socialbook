import { MapPin, Star, BadgeCheck, Clock, Phone, Store, BookOpen } from '../../icons';
import PostCard from '../posts/PostCard';
import Composer from '../posts/Composer';
import EmptyState from '../ui/EmptyState';
import { useApp } from '../../context/AppContext';
import { getStorePosts } from '../../data/mockData';
import { sanitizeHexColor, sanitizeImageUrl, sanitizeTelHref } from '../../utils/security';

export default function StoreProfileView({ store, posts, isOwner = false, onContact }) {
  const { addPost } = useApp();

  if (!store) {
    return <EmptyState text="Mağaza tapılmadı." icon={Store} />;
  }

  const storePosts = getStorePosts(posts, store.id);
  const storeTint = sanitizeHexColor(store.cover);
  const phoneHref = sanitizeTelHref(store.phone);
  const coverImage = sanitizeImageUrl(store.coverImage);

  return (
    <div className="store-detail">
      <header
        className={`store-detail__hero ${coverImage ? 'store-detail__hero--photo' : ''}`}
        style={{ '--store-tint': storeTint }}
      >
        {coverImage && (
          <>
            <img
              src={coverImage}
              alt=""
              className="store-detail__hero-photo"
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
            />
            <div className="store-detail__hero-shade" aria-hidden="true" />
          </>
        )}
        <span className="store-detail__icon">
          <Store size={28} />
        </span>

        <div className="store-detail__intro">
          <p className="store-detail__eyebrow">{isOwner ? 'Mağazam' : 'Mağaza'}</p>
          <h1 className="store-detail__name font-display">
            {store.name}
            {store.verified && (
              <BadgeCheck size={20} className="store-detail__verified" aria-label="Təsdiqlənmiş" />
            )}
          </h1>
          <p className="store-detail__location">
            <MapPin size={14} />
            {store.location}
          </p>
          <p className="store-detail__desc">{store.description}</p>

          <div className="store-detail__stats" role="list">
            <div className="store-detail__stat" role="listitem">
              <span className="store-detail__stat-label">Reytinq</span>
              <span className="store-detail__stat-value">
                <Star size={14} fill="var(--gold)" color="var(--gold)" />
                {store.rating || '—'}
              </span>
            </div>
            <div className="store-detail__stat" role="listitem">
              <span className="store-detail__stat-label">Kataloq</span>
              <span className="store-detail__stat-value">
                <BookOpen size={14} />
                {store.booksCount ?? 0}
              </span>
            </div>
            <div className="store-detail__stat" role="listitem">
              <span className="store-detail__stat-label">İş saatı</span>
              <span className="store-detail__stat-value">
                <Clock size={14} />
                {store.hours || '—'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="store-detail__panels">
        <section className="store-detail__panel">
          <h2 className="store-detail__section-title font-display">Haqqında</h2>
          <p className="store-detail__about">{store.about || store.description || '—'}</p>
        </section>

        <section className="store-detail__panel">
          <h2 className="store-detail__section-title font-display">Əlaqə</h2>
          <ul className="store-detail__contact">
            <li className="store-detail__contact-row">
              <MapPin size={16} />
              <div>
                <span className="store-detail__contact-label">Ünvan</span>
                <span className="store-detail__contact-value">{store.location}</span>
              </div>
            </li>
            {store.phone && phoneHref && (
              <li className="store-detail__contact-row">
                <Phone size={16} />
                <div>
                  <span className="store-detail__contact-label">Telefon</span>
                  <a className="store-detail__contact-value" href={phoneHref}>
                    {store.phone}
                  </a>
                </div>
              </li>
            )}
            <li className="store-detail__contact-row">
              <Clock size={16} />
              <div>
                <span className="store-detail__contact-label">İş saatı</span>
                <span className="store-detail__contact-value">{store.hours || '—'}</span>
              </div>
            </li>
          </ul>
          {!isOwner && (
            <button type="button" className="btn btn--primary store-detail__cta" onClick={onContact}>
              Əlaqə saxla
            </button>
          )}
        </section>
      </div>

      <section className="store-detail__section">
        {isOwner && <Composer onSubmit={addPost} />}

        <div className="books-page__section-head">
          <h2 className="store-detail__section-title font-display">Elanlar</h2>
          {storePosts.length > 0 && (
            <span className="books-page__section-count">{storePosts.length}</span>
          )}
        </div>
        {storePosts.length === 0 ? (
          <EmptyState
            text={isOwner ? 'Mağazanızın hələ elanı yoxdur.' : 'Bu mağazanın hələ elanı yoxdur.'}
            icon={Store}
          />
        ) : (
          <div className="store-detail__posts">
            {storePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
