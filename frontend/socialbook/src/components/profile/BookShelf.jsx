import { useState } from 'react';
import { Plus, X, BookMarked } from 'lucide-react';
import BookSpine from '../ui/BookSpine';
import { useApp } from '../../context/AppContext';
import { LIMITS } from '../../utils/security';

const coverColors = ['#7A2331', '#435A45', '#B08D3D', '#22304F', '#6B4C8A', '#2E6B5A'];

export default function BookShelf({ books, readOnly = false }) {
  const { shelfBooks, addShelfBook, removeShelfBook } = useApp();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const displayBooks = books ?? shelfBooks;

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addShelfBook({
      title: title.trim(),
      author: author.trim() || 'Naməlum müəllif',
      cover: coverColors[shelfBooks.length % coverColors.length],
    });

    setTitle('');
    setAuthor('');
    setOpen(false);
  };

  return (
    <section className={`book-shelf ${readOnly ? 'book-shelf--readonly' : ''}`}>
      <div className="book-shelf__header">
        <div className="book-shelf__heading">
          <BookMarked size={16} />
          <h2 className="font-display">Kitab rəfi</h2>
          <span className="book-shelf__count">{displayBooks.length}</span>
        </div>
        {!readOnly && (
          <button
            type="button"
            className="btn btn--ghost btn--sm book-shelf__toggle"
            onClick={() => setOpen(!open)}
          >
            <Plus size={14} />
            Kitab əlavə et
          </button>
        )}
      </div>

      {open && !readOnly && (
        <form className="book-shelf__form" onSubmit={submit}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Kitabın adı"
            className="input"
            maxLength={LIMITS.shelfTitle}
            autoFocus
          />
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Müəllif"
            className="input"
            maxLength={LIMITS.shelfAuthor}
          />
          <div className="book-shelf__form-actions">
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setOpen(false)}>
              Ləğv et
            </button>
            <button type="submit" className="btn btn--primary btn--sm">
              Əlavə et
            </button>
          </div>
        </form>
      )}

      {displayBooks.length === 0 ? (
        <div className="book-shelf__empty">
          <p>
            {readOnly
              ? 'Bu istifadəçi hələ kitab rəfinə heç nə əlavə etməyib.'
              : 'Hələ kitab əlavə etməmisən. Oxumaq istədiklərin burada görünəcək.'}
          </p>
        </div>
      ) : (
        <div className="book-shelf__rack">
          <div className="book-shelf__books">
            {displayBooks.map((book) => (
              <article key={book.id} className="book-shelf__item" title={`${book.title} — ${book.author}`}>
                {!readOnly && (
                  <button
                    type="button"
                    className="book-shelf__remove"
                    onClick={() => removeShelfBook(book.id)}
                    aria-label="Rəfdən sil"
                  >
                    <X size={12} />
                  </button>
                )}
                <BookSpine color={book.cover} width={42} height={62} />
                <p className="book-shelf__title">{book.title}</p>
                <p className="book-shelf__author">{book.author}</p>
              </article>
            ))}
          </div>
          <div className="book-shelf__board" aria-hidden="true" />
        </div>
      )}
    </section>
  );
}
