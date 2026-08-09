import BookCard from './BookCard';
import { usePaginatedList } from '../../hooks/usePaginatedList';

export default function BooksGrid({ books, onBookClick, pageSize = 12 }) {
  const { visibleItems, hasMore, sentinelRef, total, loaded } = usePaginatedList(books, pageSize);

  return (
    <div className="books-grid-wrap">
      <div className="books-grid">
        {visibleItems.map((book, index) => (
          <BookCard
            key={book.id}
            book={book}
            index={index}
            onClick={onBookClick}
          />
        ))}
      </div>

      {hasMore && (
        <div className="books-grid__loader" ref={sentinelRef} role="status" aria-live="polite">
          <span className="visually-hidden">Daha çox kitab yüklənir…</span>
          <span className="books-grid__loader-dot" aria-hidden="true" />
          <span className="books-grid__loader-dot" aria-hidden="true" />
          <span className="books-grid__loader-dot" aria-hidden="true" />
        </div>
      )}

      {total > pageSize && (
        <p className="books-grid__count">
          {loaded} / {total} kitab
        </p>
      )}
    </div>
  );
}
