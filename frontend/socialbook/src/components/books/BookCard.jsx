import BookSpine from '../ui/BookSpine';
import { getGenreById } from '../../data/books';

export default function BookCard({ book, onClick, index = 0 }) {
  const primaryGenre = book.genres?.[0] ? getGenreById(book.genres[0]) : null;

  return (
    <button
      type="button"
      className="book-card"
      onClick={() => onClick?.(book)}
      style={{ animationDelay: `${Math.min(index, 11) * 35}ms` }}
      aria-label={`${book.title}, ${book.author}${book.avgRating ? `, reyting ${book.avgRating.toFixed(1)}` : ''}`}
    >
      <div className="book-card__cover" style={{ '--book-tint': book.cover }}>
        <BookSpine color={book.cover} width={64} height={96} />
      </div>
      <div className="book-card__body">
        <p className="book-card__title font-display">{book.title}</p>
        <p className="book-card__author">{book.author}</p>
        <div className="book-card__meta">
          <span className="book-card__rating">{book.avgRating?.toFixed(1)}</span>
          {primaryGenre && <span className="book-card__genre">{primaryGenre.label}</span>}
        </div>
      </div>
    </button>
  );
}
