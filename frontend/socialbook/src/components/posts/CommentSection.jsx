import { MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { LIMITS } from '../../utils/security';
import { useApp } from '../../context/AppContext';

export default function CommentSection({ post, onAddComment }) {
  const { isLoggedIn, requireAuth } = useApp();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');

  const submit = () => {
    if (!requireAuth('Şərh yazmaq üçün daxil ol və ya qeydiyyatdan keç.')) return;
    if (!draft.trim()) return;
    onAddComment(post.id, draft.trim());
    setDraft('');
  };

  return (
    <div className="comment-section">
      <button type="button" className="post-action" onClick={() => setOpen(!open)}>
        <MessageCircle size={17} strokeWidth={1.7} />
        {post.comments.length}
      </button>

      {open && (
        <div className="comment-section__panel">
          {post.comments.map((comment) => (
            <div key={comment.id} className="comment-section__item">
              <span className="comment-section__author">{comment.user}</span>
              <span className="comment-section__text">{comment.text}</span>
            </div>
          ))}

          {post.comments.length === 0 && (
            <p className="comment-section__empty">Hələ şərh yoxdur, ilk sən yaz.</p>
          )}

          <div className="comment-section__form">
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
              className="input"
              maxLength={LIMITS.commentText}
              readOnly={!isLoggedIn}
            />
            <button type="button" className="btn btn--primary btn--icon" onClick={submit}>
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
