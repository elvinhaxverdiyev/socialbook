import { useApp } from '../context/AppContext';
import { genres, getGenreBookCount } from '../data/books';

export default function GenresPage() {
  const { openBooks } = useApp();

  return (
    <div className="genres-page">
      <section className="genres-page__intro">
        <p className="books-page__eyebrow">Kəşf</p>
        <h1 className="books-page__title font-display">Janrlar</h1>
        <p className="books-page__lead">Maraqlı janrı seç — kataloq filtrələnəcək.</p>
      </section>

      <div className="genres-grid">
        {genres.map((genre, index) => (
          <button
            key={genre.id}
            type="button"
            className="genre-card"
            onClick={() => openBooks({ genre: genre.id })}
            style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
          >
            <span className="genre-card__index">{String(index + 1).padStart(2, '0')}</span>
            <h2 className="genre-card__title font-display">{genre.label}</h2>
            <p className="genre-card__desc">{genre.description}</p>
            <span className="genre-card__count">{getGenreBookCount(genre.id)} kitab</span>
          </button>
        ))}
      </div>
    </div>
  );
}
