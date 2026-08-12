import { useState } from 'react';
import {
  Heart,
  Share2,
  Bookmark,
  Store,
  MapPin,
  BookOpen,
  Tag,
  BadgeCheck,
  CheckCircle2,
} from 'lucide-react';
import Avatar from '../ui/Avatar';
import BookSpine from '../ui/BookSpine';
import RatingStars from '../ui/RatingStars';
import CommentSection from './CommentSection';
import { useApp } from '../../context/AppContext';
import { conditionLabels, formatPrice } from '../../data/mockData';
import { findBookByTitle } from '../../data/books';

const typeBadges = {
  reading: { label: 'Oxuyur', icon: BookOpen },
  finished: { label: 'Bitirdi', icon: CheckCircle2 },
  sale: { label: 'Satış', icon: Tag },
};

export default function PostCard({ post }) {
  const {
    currentUser,
    following,
    toggleFollow,
    savedIds,
    toggleSave,
    openUserProfile,
    openBook,
    openStore,
    isLoggedIn,
    requireAuth,
  } = useApp();
  const [liked, setLiked] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const isStore = post.type === 'store';
  const isSale = post.type === 'sale' || isStore;
  const isOwnPost = isLoggedIn && !isStore && post.user?.handle === currentUser.handle;
  const isFollowing = !isStore && following.has(post.user?.handle);
  const isSaved = savedIds.has(post.id);
  const badge = typeBadges[post.type];
  const likeCount = post.likes + (liked ? 1 : 0);

  const handleLike = () => {
    if (!requireAuth('Bəyənmək üçün daxil ol və ya qeydiyyatdan keç.')) return;
    setLiked(!liked);
  };

  const handleBookClick = () => {
    if (!post.book) return;
    const match = findBookByTitle(post.book.title);
    if (match) openBook(match.id);
  };

  return (
    <article className="post-card">
      <header className="post-card__header">
        {isStore ? (
          <>
            <button
              type="button"
              className="post-card__profile-link"
              onClick={() => post.store?.id && openStore(post.store.id)}
            >
              <div className="post-card__store-icon">
                <Store size={18} color="var(--paper-raised)" />
              </div>
              <div className="post-card__meta">
                <p className="post-card__name">
                  {post.store.name}
                  {post.store.verified && (
                    <BadgeCheck size={14} className="post-card__verified" aria-label="Təsdiqlənmiş mağaza" />
                  )}
                </p>
                <p className="post-card__sub">
                  <MapPin size={11} /> {post.store.location}
                </p>
              </div>
            </button>
            <span className="post-card__price">{formatPrice(post.price)}</span>
          </>
        ) : (
          <>
            <button
              type="button"
              className="post-card__profile-link"
              onClick={() => openUserProfile(post.user.handle)}
            >
              <Avatar initials={post.user.initials} src={post.user.avatarUrl} size={42} name={post.user.name} />
              <div className="post-card__meta">
                <p className="post-card__name">{post.user.name}</p>
                <p className="post-card__sub">
                  {post.user.handle}
                  <span className="post-card__dot">·</span>
                  {post.time}
                </p>
              </div>
            </button>

            {badge && isOwnPost && (
              <span className={`post-card__badge post-card__badge--${post.type}`}>
                <badge.icon size={12} />
                {badge.label}
              </span>
            )}

            {!isOwnPost && (
              <button
                type="button"
                className={`btn btn--follow ${isFollowing ? 'btn--follow-active' : ''}`}
                onClick={() => toggleFollow(post.user.handle, post.user)}
              >
                {isFollowing ? 'İzlənilir' : 'İzlə'}
              </button>
            )}
          </>
        )}
      </header>

      <p className="post-card__text">{post.text}</p>

      {post.book && post.type !== 'general' && (
        <div className="post-card__book">
          <button type="button" className="post-card__book-link" onClick={handleBookClick}>
            <BookSpine color={post.book.cover} />
            <div className="post-card__book-info">
              <p className="post-card__book-title font-display">{post.book.title}</p>
              <p className="post-card__book-author">{post.book.author}</p>

              {(post.type === 'review' || post.type === 'finished') && post.rating > 0 && (
                <RatingStars rating={post.rating} />
              )}

              {isSale && post.condition && (
                <p className="post-card__condition">{conditionLabels[post.condition]}</p>
              )}
            </div>
          </button>

          {isSale && (
            <div className="post-card__buy">
              {!isStore && (
                <span className="post-card__price-sm">{formatPrice(post.price)}</span>
              )}
              <button
                type="button"
                className="btn btn--primary btn--sm"
                onClick={() => requireAuth('Əlaqə üçün daxil ol.')}
              >
                {isStore ? 'Al' : 'Əlaqə'}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="post-card__stats">
        <span>{likeCount} bəyənmə</span>
        <button type="button" onClick={() => setCommentsOpen(true)} aria-label={`${post.comments.length} şərh`}>
          {post.comments.length} şərh
        </button>
      </div>

      <footer className="post-card__footer">
        <button
          type="button"
          className={`post-action ${liked ? 'post-action--active' : ''}`}
          onClick={handleLike}
          aria-pressed={liked}
          aria-label="Bəyən"
        >
          <Heart size={18} fill={liked ? 'var(--accent)' : 'none'} strokeWidth={1.7} aria-hidden="true" />
          <span className="post-action__label">Bəyən</span>
        </button>

        <CommentSection
          post={post}
          open={commentsOpen}
          onToggle={() => setCommentsOpen((v) => !v)}
        />

        <button
          type="button"
          className={`post-action ${isOwnPost ? 'post-action--end' : ''}`}
          onClick={() => requireAuth('Paylaşmaq üçün daxil ol və ya qeydiyyatdan keç.')}
          aria-label="Paylaş"
        >
          <Share2 size={17} strokeWidth={1.7} aria-hidden="true" />
          <span className="post-action__label">Paylaş</span>
        </button>

        {!isOwnPost && (
          <button
            type="button"
            className={`post-action post-action--save ${isSaved ? 'post-action--saved' : ''}`}
            onClick={() => toggleSave(post.id)}
            aria-pressed={isSaved}
            aria-label="Saxla"
          >
            <Bookmark size={18} fill={isSaved ? 'var(--gold)' : 'none'} strokeWidth={1.7} aria-hidden="true" />
            <span className="post-action__label">Saxla</span>
          </button>
        )}
      </footer>
    </article>
  );
}
