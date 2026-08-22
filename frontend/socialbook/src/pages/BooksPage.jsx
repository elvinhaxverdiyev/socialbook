import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Layers,
  X,
  SlidersHorizontal,
  MapPin,
  Star,
  BadgeCheck,
  ArrowRight,
  Store,
} from '../icons';
import { useApp } from '../context/AppContext';
import BooksGrid from '../components/books/BooksGrid';
import GenreChip from '../components/books/GenreChip';
import EmptyState from '../components/ui/EmptyState';
import {
  bookCatalog,
  genres,
  bookTypes,
  searchBooks,
  sortBooks,
} from '../data/books';
import { bookSortOptions } from '../data/constants';
import { stores } from '../data/mockData';

export default function BooksPage() {
  const { openBook, openGenres, openStore, booksGenreFilter, setActivePage } = useApp();
  const [localQuery, setLocalQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState(booksGenreFilter || '');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setGenreFilter(booksGenreFilter || '');
  }, [booksGenreFilter]);

  const filteredBooks = useMemo(() => {
    let list = localQuery.trim() ? searchBooks(localQuery) : [...bookCatalog];
    if (genreFilter) {
      list = list.filter((b) => b.genres.includes(genreFilter));
    }
    if (typeFilter) {
      list = list.filter((b) => b.type === typeFilter);
    }
    return sortBooks(list, sortBy);
  }, [localQuery, genreFilter, typeFilter, sortBy]);

  const activeGenre = genres.find((g) => g.id === genreFilter);
  const hasActiveFilters = Boolean(localQuery.trim() || genreFilter || typeFilter);
  const showStores = !hasActiveFilters;
  const popularStores = stores.slice(0, 3);

  const clearFilters = () => {
    setLocalQuery('');
    setGenreFilter('');
    setTypeFilter('');
  };

  return (
    <div className="books-page">
      <section className="books-page__intro">
        <p className="books-page__eyebrow">Kataloq</p>
        <h1 className="books-page__title font-display">Kitablar</h1>
        <p className="books-page__lead">
          Janr, növ və axtarışla kəşf et — sonra rəfinə əlavə et.
        </p>
      </section>

      <div className="books-page__toolbar">
        <div className="books-page__search">
          <Search size={16} className="books-page__search-icon" aria-hidden="true" />
          <input
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Kitab və ya müəllif axtar"
            className="input books-page__search-input"
            aria-label="Kataloqda axtar"
          />
          {localQuery && (
            <button
              type="button"
              className="books-page__search-clear"
              onClick={() => setLocalQuery('')}
              aria-label="Axtarışı təmizlə"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          type="button"
          className={`books-page__filters-toggle ${filtersOpen ? 'books-page__filters-toggle--open' : ''}`}
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
        >
          <SlidersHorizontal size={14} />
          Filtrlər
          {(genreFilter || typeFilter) && <span className="books-page__filters-dot" />}
        </button>

        <div className={`books-page__controls ${filtersOpen ? 'books-page__controls--open' : ''}`}>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input books-page__select"
            aria-label="Növ filtri"
          >
            <option value="">Bütün növlər</option>
            {bookTypes.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input books-page__select"
            aria-label="Sıralama"
          >
            {bookSortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="books-page__genres-row">
        <div className="books-page__genres" role="group" aria-label="Janr filtri">
          <GenreChip
            genre={{ id: '', label: 'Hamısı' }}
            active={!genreFilter}
            onClick={() => setGenreFilter('')}
          />
          {genres.map((genre) => (
            <GenreChip
              key={genre.id}
              genre={genre}
              active={genreFilter === genre.id}
              onClick={setGenreFilter}
            />
          ))}
        </div>
        <button type="button" className="books-page__genres-link" onClick={openGenres}>
          <Layers size={14} />
          Janrlar
        </button>
      </div>

      {(activeGenre || hasActiveFilters) && (
        <div className="books-page__status">
          <div className="books-page__status-copy">
            {activeGenre ? (
              <p>
                <strong>{activeGenre.label}</strong>
                <span> — {activeGenre.description}</span>
              </p>
            ) : (
              <p>
                <strong>{filteredBooks.length}</strong>
                <span> nəticə</span>
              </p>
            )}
          </div>
          {hasActiveFilters && (
            <button type="button" className="books-page__clear" onClick={clearFilters}>
              Filtrləri sıfırla
            </button>
          )}
        </div>
      )}

      {showStores && (
        <section className="books-page__stores" aria-label="Populyar mağazalar">
          <div className="books-page__section-head">
            <h2 className="books-page__section-title font-display">Populyar mağazalar</h2>
            <button
              type="button"
              className="books-page__section-action"
              onClick={() => setActivePage('stores')}
            >
              Hamısı
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="books-store-grid">
            {popularStores.map((store, index) => (
              <button
                key={store.id}
                type="button"
                className="books-store-card"
                onClick={() => openStore(store.id)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="books-store-card__icon">
                  <Store size={18} />
                </span>
                <div className="books-store-card__body">
                  <p className="books-store-card__name font-display">
                    {store.name}
                    {store.verified && (
                      <BadgeCheck size={14} className="books-store-card__verified" aria-label="Təsdiqlənmiş" />
                    )}
                  </p>
                  <p className="books-store-card__location">
                    <MapPin size={12} />
                    {store.location}
                  </p>
                  <div className="books-store-card__meta">
                    <span>
                      <Star size={12} fill="var(--gold)" color="var(--gold)" />
                      {store.rating}
                    </span>
                    <span>{store.booksCount} kitab</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="books-page__catalog" aria-label="Kitab siyahısı">
        <div className="books-page__section-head">
          <h2 className="books-page__section-title font-display">
            {hasActiveFilters ? 'Nəticələr' : 'Kataloq'}
          </h2>
          <span className="books-page__section-count">{filteredBooks.length} kitab</span>
        </div>

        {filteredBooks.length === 0 ? (
          <EmptyState
            icon={Search}
            text="Uyğun kitab tapılmadı. Filtrləri dəyişdir və ya axtarışı təmizlə."
          />
        ) : (
          <BooksGrid
            books={filteredBooks}
            onBookClick={(b) => openBook(b.id)}
          />
        )}
      </section>
    </div>
  );
}
