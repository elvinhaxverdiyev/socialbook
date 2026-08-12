import { Heart, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import Avatar from '../ui/Avatar';
import { LIMITS, clampText } from '../../utils/security';
import { useApp } from '../../context/AppContext';

export default function CommentSection({ post, open, onToggle }) {
  const {
    currentUser,
    isLoggedIn,
    requireAuth,
    addComment,
    toggleCommentLike,
    isCommentLiked,
  } = useApp();
  const [draft, setDraft] = useState('');

  const submit = () => {
    if (!requireAuth('Şərh yazmaq üçün daxil ol və ya qeydiyyatdan keç.')) return;
    const safeText = clampText(draft, LIMITS.commentText);
    if (!safeText) return;
    addComment(post.id, safeText);
    setDraft('');
  };

  return (
    <div className="comment-section">
      <button
        type="button"
        className={`post-action ${open ? 'post-action--open' : ''}`}
        onClick={onToggle}
        aria-expanded={open}
        aria-label={`Şərhlər (${post.comments.length})`}
      >
        <MessageCircle size={18} strokeWidth={1.7} aria-hidden="true" />
        <span>{post.comments.length}</span>
      </button>

      {open && (
        <div className="comment-section__panel">
          {post.comments.length === 0 ? (
            <p className="comment-section__empty">Hələ şərh yoxdur — ilk sən yaz.</p>
          ) : (
            <ul className="comment-section__list">
              {post.comments.map((comment) => {
                const liked = isCommentLiked(post.id, comment.id);
                const likes = Number(comment.likes) || 0;

                return (
                  <li key={comment.id} className="comment-section__item">
                    <Avatar
                      initials={comment.initials || comment.user}
                      src={comment.avatarUrl}
                      size={32}
                      name={comment.user}
                    />
                    <div className="comment-section__body">
                      <div className="comment-section__bubble">
                        <p className="comment-section__author">{comment.user}</p>
                        <p className="comment-section__text">{comment.text}</p>
                      </div>
                      <button
                        type="button"
                        className={`comment-section__like ${liked ? 'comment-section__like--active' : ''}`}
                        onClick={() => toggleCommentLike(post.id, comment.id)}
                        aria-label="Şərhi bəyən"
                      >
                        <Heart
                          size={13}
                          fill={liked ? 'var(--accent)' : 'none'}
                          strokeWidth={1.8}
                        />
                        <span>{likes}</span>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="comment-section__form">
            <Avatar
              initials={currentUser.initials}
              src={currentUser.avatarUrl}
              size={32}
            />
            <div className="comment-section__composer">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onFocus={() => {
                  if (!isLoggedIn) {
                    requireAuth('Şərh yazmaq üçün daxil ol və ya qeydiyyatdan keç.');
                  }
                }}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder={isLoggedIn ? 'Şərh yaz...' : 'Şərh üçün daxil ol...'}
                className="input comment-section__input"
                maxLength={LIMITS.commentText}
                readOnly={!isLoggedIn}
              />
              <button
                type="button"
                className="btn btn--primary btn--icon comment-section__send"
                onClick={submit}
                aria-label="Göndər"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
