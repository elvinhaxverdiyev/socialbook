import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Layers,
  Tag,
  X,
  SlidersHorizontal,
  BookOpen,
  MapPin,
  Star,
  BadgeCheck,
  ArrowRight,
  Store,
} from 'lucide-react';
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
import { formatPrice, conditionLabels, stores } from '../data/mockData';
import BookSpine from '../components/ui/BookSpine';

export default function BooksPage() {
  const { openBook, openGenres, openStore, openPost, booksGenreFilter, posts, setActivePage } = useApp();
  const [localQuery, setLocalQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState(booksGenreFilter || '');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [tab, setTab] = useState('catalog');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [saleCategory, setSaleCategory] = useState('');
  const [saleAuthor, setSaleAuthor] = useState('');

  useEffect(() => {
    setGenreFilter(booksGenreFilter || '');
  }, [booksGenreFilter]);

  const salePosts = useMemo(
    () => posts.filter((p) => p.type === 'sale'),
    [posts],
  );

  const saleAuthors = useMemo(() => {
    const names = new Set();
    salePosts.forEach((post) => {
      const name = post.book?.author?.trim();
      if (name && name !== 'Naməlum müəllif') names.add(name);
    });
    return [...names].sort((a, b) => a.localeCompare(b, 'az'));
  }, [salePosts]);

  const filteredSalePosts = useMemo(() => {
    return salePosts.filter((post) => {
      if (saleCategory && post.category !== saleCategory) return false;
      if (saleAuthor && post.book?.author !== saleAuthor) return false;
      return true;
    });
  }, [salePosts, saleCategory, saleAuthor]);

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
  const hasSaleFilters = Boolean(saleCategory || saleAuthor);
  const showStores = !hasActiveFilters && tab === 'catalog';
  const popularStores = stores.slice(0, 3);

  const clearFilters = () => {
    setLocalQuery('');
    setGenreFilter('');
    setTypeFilter('');
  };

  const clearSaleFilters = () => {
    setSaleCategory('');
    setSaleAuthor('');
  };

  const genreLabel = (id) => genres.find((g) => g.id === id)?.label || id;

  return (
    <div className="books-page">
      <section className="books-page__intro">
        <p className="books-page__eyebrow">Kataloq</p>
        <h1 className="books-page__title font-display">Kitablar</h1>
        <p className="books-page__lead">
          Janr, növ və axtarışla kəşf et — sonra rəfinə əlavə et.
        </p>
      </section>

      <div className="books-page__tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'catalog'}
          className={`books-page__tab ${tab === 'catalog' ? 'books-page__tab--active' : ''}`}
          onClick={() => setTab('catalog')}
        >
          <BookOpen size={14} />
          Kataloq
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'sales'}
          className={`books-page__tab ${tab === 'sales' ? 'books-page__tab--active' : ''}`}
          onClick={() => setTab('sales')}
        >
          <Tag size={14} />
          İkinci əl
          {salePosts.length > 0 && (
            <span className="books-page__tab-count">{salePosts.length}</span>
          )}
        </button>
      </div>

      {tab === 'catalog' ? (
        <>
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
        </>
      ) : (
        <section className="books-sales" aria-label="İkinci əl satışlar">
          <div className="books-sales__toolbar">
            <select
              value={saleCategory}
              onChange={(e) => setSaleCategory(e.target.value)}
              className="input books-sales__select"
              aria-label="Kateqoriya filtri"
            >
              <option value="">Bütün kateqoriyalar</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>{genre.label}</option>
              ))}
            </select>

            <select
              value={saleAuthor}
              onChange={(e) => setSaleAuthor(e.target.value)}
              className="input books-sales__select"
              aria-label="Yazar filtri"
            >
              <option value="">Bütün yazarlar</option>
              {saleAuthors.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>

            {hasSaleFilters && (
              <button type="button" className="books-page__clear" onClick={clearSaleFilters}>
                Sıfırla
              </button>
            )}
          </div>

          <div className="books-page__section-head">
            <h2 className="books-page__section-title font-display">İkinci əl elanlar</h2>
            <span className="books-page__section-count">{filteredSalePosts.length} elan</span>
          </div>

          {filteredSalePosts.length === 0 ? (
            <EmptyState
              icon={Tag}
              text={
                salePosts.length === 0
                  ? 'Hazırda ikinci əl satış elanı yoxdur.'
                  : 'Bu filtrə uyğun elan tapılmadı.'
              }
            />
          ) : (
            filteredSalePosts.map((post, index) => (
              <button
                key={post.id}
                type="button"
                className="books-sales__item"
                style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
                onClick={() => openPost(post.id)}
                aria-label={`${post.book?.title || 'Elan'} — ${post.user?.name || 'satıcı'} postunu aç`}
              >
                <div className="books-sales__book">
                  <BookSpine color={post.book?.cover || '#7A2331'} width={44} height={64} />
                  <div>
                    <p className="books-sales__title font-display">{post.book?.title}</p>
                    <p className="books-sales__author">{post.book?.author}</p>
                    <div className="books-sales__tags">
                      {post.category && (
                        <span className="books-sales__tag">{genreLabel(post.category)}</span>
                      )}
                      {post.condition && (
                        <span className="books-sales__condition">{conditionLabels[post.condition]}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="books-sales__meta">
                  <span className="books-sales__price">{formatPrice(post.price)}</span>
                  <span className="books-sales__user">{post.user?.name}</span>
                </div>
              </button>
            ))
          )}
        </section>
      )}
    </div>
  );
}
