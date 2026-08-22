import { useEffect, useState } from 'react';
import {
  BookOpen,
  Bookmark,
  CheckCircle2,
  Check,
  Store,
  Tag,
  MapPin,
  BadgeCheck,
  ArrowRight,
} from '../icons';
import { useApp } from '../context/AppContext';
import BookSpine from '../components/ui/BookSpine';
import RatingStars from '../components/ui/RatingStars';
import GenreChip from '../components/books/GenreChip';
import PostCard from '../components/posts/PostCard';
import EmptyState from '../components/ui/EmptyState';
import {
  getBookById,
  getGenreById,
  getDiscussionPostsForBook,
  getSecondHandPostsForBook,
  getStorePostsForBook,
} from '../data/books';
import { bookTypes } from '../data/constants';
import { sanitizeHexColor } from '../utils/security';
import { formatPrice, conditionLabels } from '../data/mockData';

const shelfActions = [
  { status: 'reading', label: 'Oxuyuram', hint: 'İndi oxuyuram', icon: BookOpen },
  { status: 'want', label: 'Oxuyacam', hint: 'Növbəyə əlavə et', icon: Bookmark },
  { status: 'finished', label: 'Bitirdim', hint: 'Tamamladım', icon: CheckCircle2 },
];

export default function BookDetailPage() {
  const {
    viewedBookId,
    openAuthor,
    openBooks,
    openPost,
    addShelfBook,
    posts,
    shelfBooks,
  } = useApp();
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [offerTab, setOfferTab] = useState('stores');
  const book = getBookById(viewedBookId);

  useEffect(() => {
    setSelectedStatus(null);
    setOfferTab('stores');
  }, [viewedBookId]);

  if (!book) {
    return (
      <EmptyState
        text="Kitab tapılmadı."
        icon={BookOpen}
        action={
          <button type="button" className="btn btn--primary btn--sm" onClick={() => openBooks()}>
            Kataloqa keç
          </button>
        }
      />
    );
  }

  const typeLabel = bookTypes.find((t) => t.id === book.type)?.label || book.type;
  const discussionPosts = getDiscussionPostsForBook(posts, book);
  const storePosts = getStorePostsForBook(posts, book);
  const secondHandPosts = getSecondHandPostsForBook(posts, book);
  const offers = offerTab === 'stores' ? storePosts : secondHandPosts;
  const shelfEntry = shelfBooks.find(
    (b) => b.bookId === book.id || b.title.toLowerCase() === book.title.toLowerCase(),
  );
  const shelfStatusLabel = shelfEntry
    ? shelfActions.find((a) => a.status === shelfEntry.status)?.label
    : null;

  const handleAddToShelf = (status) => {
    const ok = addShelfBook({
      bookId: book.id,
      title: book.title,
      author: book.author,
      cover: book.cover,
      status,
    });
    if (ok) setSelectedStatus(status);
  };

  return (
    <div className="book-detail">
      <article>
        <div
          className="book-detail__hero"
          style={{ '--book-tint': sanitizeHexColor(book.cover) }}
        >
          <div className="book-detail__cover">
            <BookSpine color={book.cover} width={128} height={192} />
          </div>

          <div className="book-detail__info">
            <p className="book-detail__type">{typeLabel}</p>
            <h1 className="book-detail__title font-display">{book.title}</h1>
            <button
              type="button"
              className="book-detail__author"
              onClick={() => openAuthor(book.authorId)}
            >
              {book.author}
            </button>

            <div className="book-detail__rating">
              <RatingStars rating={Math.round(book.avgRating)} size={16} />
              <span className="book-detail__rating-value">{book.avgRating?.toFixed(1)}</span>
              <span className="book-detail__rating-count">
                {book.ratingsCount?.toLocaleString('az-AZ')} qiymət
              </span>
            </div>

            <div className="book-detail__genres">
              {book.genres.map((gid) => {
                const genre = getGenreById(gid);
                return genre ? (
                  <GenreChip
                    key={gid}
                    genre={genre}
                    size="sm"
                    onClick={() => openBooks({ genre: gid })}
                  />
                ) : null;
              })}
            </div>

            <dl className="book-detail__meta">
              <div>
                <dt>İl</dt>
                <dd>{book.year}</dd>
              </div>
              <div>
                <dt>Dil</dt>
                <dd>{book.language}</dd>
              </div>
              <div>
                <dt>Səhifə</dt>
                <dd>{book.pages}</dd>
              </div>
            </dl>
          </div>
        </div>

        <section className="book-detail__section">
          <h2 className="book-detail__section-title font-display">Haqqında</h2>
          <p className="book-detail__description">{book.description}</p>
        </section>

        <section className="book-detail__section">
          <h2 className="book-detail__section-title font-display">Rəfə əlavə et</h2>
          <p className="book-detail__shelf-prompt">
            Status seç — Oxuyuram, Oxuyacam və ya Bitirdim.
          </p>

          {shelfStatusLabel && !selectedStatus && (
            <p className="book-detail__shelf-note book-detail__shelf-note--muted">
              Artıq rəfindədir: {shelfStatusLabel}. Yenisini seçərək dəyişə bilərsən.
            </p>
          )}

          {selectedStatus && (
            <p className="book-detail__shelf-note">
              <Check size={14} />
              Əlavə olundu: {shelfActions.find((a) => a.status === selectedStatus)?.label}
            </p>
          )}

          <div className="book-detail__shelf-actions" role="group" aria-label="Rəf statusu seç">
            {shelfActions.map(({ status, label, hint, icon: Icon }) => {
              const active = selectedStatus === status;
              return (
                <button
                  key={status}
                  type="button"
                  className={`book-detail__shelf-btn book-detail__shelf-btn--${status} ${
                    active ? 'book-detail__shelf-btn--active' : ''
                  }`}
                  onClick={() => handleAddToShelf(status)}
                  aria-pressed={active}
                >
                  <span className="book-detail__shelf-icon">
                    <Icon size={16} />
                  </span>
                  <span className="book-detail__shelf-copy">
                    <strong>{label}</strong>
                    <small>{hint}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="book-detail__section">
          <h2 className="book-detail__section-title font-display">Haradan almaq olar</h2>

          <div className="book-detail__tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={offerTab === 'stores'}
              className={`book-detail__tab ${offerTab === 'stores' ? 'book-detail__tab--active' : ''}`}
              onClick={() => setOfferTab('stores')}
            >
              <Store size={14} />
              Mağazalarda
              {storePosts.length > 0 && (
                <span className="book-detail__tab-count">{storePosts.length}</span>
              )}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={offerTab === 'second-hand'}
              className={`book-detail__tab ${offerTab === 'second-hand' ? 'book-detail__tab--active' : ''}`}
              onClick={() => setOfferTab('second-hand')}
            >
              <Tag size={14} />
              İkinci əl
              {secondHandPosts.length > 0 && (
                <span className="book-detail__tab-count">{secondHandPosts.length}</span>
              )}
            </button>
          </div>

          {offers.length === 0 ? (
            <EmptyState
              icon={offerTab === 'stores' ? Store : Tag}
              text={
                offerTab === 'stores'
                  ? 'Bu kitab hazırda heç bir mağazanın elanında yoxdur.'
                  : 'Bu kitab üçün ikinci əl elanı yoxdur.'
              }
            />
          ) : (
            <div className="book-offers">
              {offers.map((post, index) => {
                const seller = post.store?.name || post.user?.name || 'Satıcı';
                return (
                  <button
                    key={post.id}
                    type="button"
                    className="book-offer"
                    style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
                    onClick={() => openPost(post.id)}
                    aria-label={`${seller} elanını aç`}
                  >
                    <span className="book-offer__main">
                      <span className="book-offer__seller font-display">
                        {seller}
                        {post.store?.verified && (
                          <BadgeCheck
                            size={14}
                            className="book-offer__verified"
                            aria-label="Təsdiqlənmiş"
                          />
                        )}
                      </span>
                      {post.store?.location && (
                        <span className="book-offer__location">
                          <MapPin size={12} />
                          {post.store.location}
                        </span>
                      )}
                      {post.text && <span className="book-offer__text">{post.text}</span>}
                      {post.condition && (
                        <span className="book-offer__tags">
                          <span className="book-offer__condition">
                            {conditionLabels[post.condition]}
                          </span>
                        </span>
                      )}
                    </span>
                    <span className="book-offer__meta">
                      <span className="book-offer__price">{formatPrice(post.price)}</span>
                      <span className="book-offer__go">
                        Postu aç
                        <ArrowRight size={13} />
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="book-detail__section">
          <h2 className="book-detail__section-title font-display">
            Bu kitab haqqında
          </h2>
          {discussionPosts.length === 0 ? (
            <p className="book-detail__empty-posts">
              Hələ post yoxdur. Feed-də ilk rəyi sən paylaş.
            </p>
          ) : (
            <div className="book-detail__posts">
              {discussionPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </article>
    </div>
  );
}
