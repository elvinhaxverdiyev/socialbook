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
} from 'lucide-react';
import Avatar from '../ui/Avatar';
import BookSpine from '../ui/BookSpine';
import RatingStars from '../ui/RatingStars';
import CommentSection from './CommentSection';
import { useApp } from '../../context/AppContext';
import { conditionLabels, formatPrice } from '../../data/mockData';

const typeBadges = {
  reading: { label: 'Oxuyur', icon: BookOpen },
  sale: { label: 'Satış', icon: Tag },
};

export default function PostCard({ post }) {
  const { currentUser, following, toggleFollow, savedIds, toggleSave, addComment, openUserProfile } = useApp();
  const [liked, setLiked] = useState(false);

  const isStore = post.type === 'store';
  const isSale = post.type === 'sale' || isStore;
  const isOwnPost = !isStore && post.user?.handle === currentUser.handle;
  const isFollowing = !isStore && following.has(post.user?.handle);
  const isSaved = savedIds.has(post.id);
  const badge = typeBadges[post.type];

  return (
    <article className="post-card">
      <header className="post-card__header">
        {isStore ? (
          <>
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
            <span className="post-card__price font-display">{formatPrice(post.price)}</span>
          </>
        ) : (
          <>
            <button
              type="button"
              className="post-card__profile-link"
              onClick={() => openUserProfile(post.user.handle)}
            >
              <Avatar initials={post.user.initials} />
              <div className="post-card__meta">
                <p className="post-card__name">{post.user.name}</p>
                <p className="post-card__sub">
                  {post.user.handle} · {post.time}
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
          <BookSpine color={post.book.cover} />
          <div className="post-card__book-info">
            <p className="post-card__book-title font-display">{post.book.title}</p>
            <p className="post-card__book-author">{post.book.author}</p>

            {post.type === 'review' && <RatingStars rating={post.rating} />}

            {isSale && post.condition && (
              <p className="post-card__condition">{conditionLabels[post.condition]}</p>
            )}
          </div>

          {isSale && (
            <div className="post-card__buy">
              {!isStore && (
                <span className="post-card__price-sm font-display">{formatPrice(post.price)}</span>
              )}
              <button type="button" className="btn btn--primary btn--sm">
                {isStore ? 'Al' : 'Əlaqə'}
              </button>
            </div>
          )}
        </div>
      )}

      <footer className="post-card__footer">
        <button
          type="button"
          className={`post-action ${liked ? 'post-action--active' : ''}`}
          onClick={() => setLiked(!liked)}
        >
          <Heart size={17} fill={liked ? 'var(--accent)' : 'none'} strokeWidth={1.7} />
          {post.likes + (liked ? 1 : 0)}
        </button>

        <CommentSection post={post} onAddComment={addComment} />

        <button type="button" className={`post-action ${isOwnPost ? 'post-action--end' : ''}`}>
          <Share2 size={16} strokeWidth={1.7} />
        </button>

        {!isOwnPost && (
          <button
            type="button"
            className={`post-action post-action--save ${isSaved ? 'post-action--saved' : ''}`}
            onClick={() => toggleSave(post.id)}
          >
            <Bookmark size={17} fill={isSaved ? 'var(--gold)' : 'none'} strokeWidth={1.7} />
          </button>
        )}
      </footer>
    </article>
  );
}
