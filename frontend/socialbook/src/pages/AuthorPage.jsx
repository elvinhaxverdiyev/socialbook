import { UserRound } from 'lucide-react';
import { useApp } from '../context/AppContext';
import BooksGrid from '../components/books/BooksGrid';
import EmptyState from '../components/ui/EmptyState';
import { getAuthorById, getBooksByAuthor } from '../data/books';
import { sanitizeHexColor } from '../utils/security';

export default function AuthorPage() {
  const { viewedAuthorId, openBook, openBooks } = useApp();
  const author = getAuthorById(viewedAuthorId);
  const books = author ? getBooksByAuthor(author.id) : [];

  if (!author) {
    return (
      <EmptyState
        text="Yazar tapılmadı."
        icon={UserRound}
        action={
          <button type="button" className="btn btn--primary btn--sm" onClick={() => openBooks()}>
            Kataloqa keç
          </button>
        }
      />
    );
  }

  const authorTint = sanitizeHexColor(author.cover);

  return (
    <div className="author-page">
      <header
        className="author-page__hero"
        style={{ '--author-tint': authorTint }}
      >
        <span className="author-page__avatar" style={{ background: authorTint }} aria-hidden="true">
          {author.name.charAt(0)}
        </span>
        <div className="author-page__intro">
          <p className="author-page__eyebrow">Yazar</p>
          <h1 className="author-page__name font-display">{author.name}</h1>
          <p className="author-page__country">{author.country}</p>
          <p className="author-page__bio">{author.bio}</p>
        </div>
      </header>

      <section className="author-page__books" aria-label={`${author.name} kitabları`}>
        <div className="books-page__section-head">
          <h2 className="author-page__section-title font-display">Kitablar</h2>
          <span className="books-page__section-count">{books.length}</span>
        </div>
        {books.length === 0 ? (
          <EmptyState text="Bu yazar üçün kataloqda kitab yoxdur." />
        ) : (
          <BooksGrid books={books} onBookClick={(b) => openBook(b.id)} />
        )}
      </section>
    </div>
  );
}
