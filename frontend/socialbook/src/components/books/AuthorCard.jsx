import { ChevronRight } from 'lucide-react';
import { getAuthorBookCount } from '../../data/books';

export default function AuthorCard({ author, onClick, compact = false }) {
  const bookCount = getAuthorBookCount(author.id);

  return (
    <button
      type="button"
      className={`author-card ${compact ? 'author-card--compact' : ''}`}
      onClick={() => onClick?.(author)}
    >
      <span className="author-card__avatar" style={{ background: author.cover }}>
        {author.name.charAt(0)}
      </span>
      <div className="author-card__body">
        <p className="author-card__name font-display">{author.name}</p>
        <p className="author-card__meta">
          {author.country}
          {bookCount > 0 && ` · ${bookCount}`}
        </p>
      </div>
      {!compact && <ChevronRight size={16} className="author-card__arrow" />}
    </button>
  );
}
