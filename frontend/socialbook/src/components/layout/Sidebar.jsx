import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search, X, BookOpen, UserRound } from '../../icons';
import { navItems } from '../../data/constants';
import { searchBooks, searchAuthors } from '../../data/books';
import { useApp } from '../../context/AppContext';
import { LIMITS, sanitizeHexColor } from '../../utils/security';
import BookSpine from '../ui/BookSpine';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';
import useEscapeKey from '../../hooks/useEscapeKey';

export default function Sidebar({ open = false, onClose }) {
  const {
    activePage,
    setActivePage,
    query,
    setQuery,
    openBook,
    openAuthor,
    unreadNotificationsCount,
    shelfView,
    currentUser,
    isLoggedIn,
  } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  useBodyScrollLock(open || searchOpen);

  const isOwnShelfPage =
    activePage === 'shelf' &&
    (!shelfView?.handle || (isLoggedIn && shelfView.handle === currentUser.handle));

  const go = (key) => {
    setActivePage(key);
    setSearchOpen(false);
    onClose?.();
  };

  const openSearch = () => {
    setSearchOpen(true);
  };

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
  }, []);

  useEscapeKey(() => {
    if (searchOpen) closeSearch();
    else if (open) onClose?.();
  }, open || searchOpen);

  const handleQueryChange = (value) => {
    setQuery(value);
    if (activePage !== 'home') setActivePage('home');
  };

  const bookResults = useMemo(
    () => (query.trim() ? searchBooks(query).slice(0, 5) : []),
    [query],
  );

  const authorResults = useMemo(
    () => (query.trim() ? searchAuthors(query).slice(0, 4) : []),
    [query],
  );

  const hasCatalogResults = bookResults.length > 0 || authorResults.length > 0;

  useEffect(() => {
    if (!searchOpen) return undefined;
    const timer = requestAnimationFrame(() => searchInputRef.current?.focus());
    return () => cancelAnimationFrame(timer);
  }, [searchOpen]);

  const handleBookResult = (bookId) => {
    closeSearch();
    onClose?.();
    openBook(bookId);
  };

  const handleAuthorResult = (authorId) => {
    closeSearch();
    onClose?.();
    openAuthor(authorId);
  };

  return (
    <>
      {open && (
        <button
          type="button"
          className="sidebar__backdrop"
          onClick={onClose}
          aria-label="Menyunu bağla"
        />
      )}

      <aside
        id="app-sidebar"
        className={`sidebar ${open ? 'sidebar--open' : ''}`}
      >
        <div className="sidebar__mobile-head">
          <p className="sidebar__mobile-title font-display">Menyu</p>
          <button
            type="button"
            className="sidebar__close"
            onClick={onClose}
            aria-label="Bağla"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar__nav" aria-label="Əsas naviqasiya">
          <button
            type="button"
            className={`sidebar__link ${searchOpen ? 'sidebar__link--active' : ''}`}
            onClick={openSearch}
            aria-expanded={searchOpen}
          >
            <span className="sidebar__icon" aria-hidden="true">
              <Search size={17} fill={searchOpen ? 'currentColor' : 'none'} />
            </span>
            <span>Axtarış</span>
          </button>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              !searchOpen &&
              (activePage === item.key || (item.key === 'profile' && isOwnShelfPage));

            return (
              <button
                key={item.key}
                type="button"
                className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
                onClick={() => go(item.key)}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="sidebar__icon" aria-hidden="true">
                  <Icon size={17} fill={isActive ? 'currentColor' : 'none'} />
                </span>
                <span>{item.label}</span>
                {item.key === 'notifications' && unreadNotificationsCount > 0 && (
                  <span className="sidebar__badge" aria-label={`${unreadNotificationsCount} oxunmamış`}>
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {searchOpen && (
        <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Axtarış">
          <button
            type="button"
            className="search-overlay__backdrop"
            onClick={closeSearch}
            aria-label="Axtarışı bağla"
          />
          <div className="search-overlay__panel">
            <div className="search-overlay__head">
              <p className="search-overlay__title font-display">Axtarış</p>
              <button
                type="button"
                className="search-overlay__close"
                onClick={closeSearch}
                aria-label="Bağla"
              >
                <X size={18} />
              </button>
            </div>

            <div className="search-overlay__field">
              <Search size={16} className="search-overlay__icon" />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Kitab, müəllif və ya mağaza axtar"
                className="input search-overlay__input"
                maxLength={LIMITS.searchQuery}
                autoComplete="off"
                spellCheck={false}
              />
              {query && (
                <button
                  type="button"
                  className="search-overlay__clear"
                  onClick={() => handleQueryChange('')}
                >
                  Təmizlə
                </button>
              )}
            </div>

            {hasCatalogResults && (
              <div className="search-overlay__results">
                {bookResults.length > 0 && (
                  <div className="search-overlay__group">
                    <p className="search-overlay__group-title">
                      <BookOpen size={13} /> Kitablar
                    </p>
                    {bookResults.map((book) => (
                      <button
                        key={book.id}
                        type="button"
                        className="search-overlay__result"
                        onClick={() => handleBookResult(book.id)}
                      >
                        <BookSpine color={book.cover} width={24} height={34} />
                        <span>
                          <strong>{book.title}</strong>
                          <small>{book.author}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {authorResults.length > 0 && (
                  <div className="search-overlay__group">
                    <p className="search-overlay__group-title">
                      <UserRound size={13} /> Yazarlar
                    </p>
                    {authorResults.map((author) => (
                      <button
                        key={author.id}
                        type="button"
                        className="search-overlay__result"
                        onClick={() => handleAuthorResult(author.id)}
                      >
                        <span className="search-overlay__author-dot" style={{ background: sanitizeHexColor(author.cover) }}>
                          {author.name.charAt(0)}
                        </span>
                        <span>
                          <strong>{author.name}</strong>
                          <small>{author.country}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <p className="search-overlay__hint">
              {hasCatalogResults
                ? 'Post nəticələri əsas səhifə feed-ində göstərilir.'
                : 'Nəticələr əsas səhifə feed-ində süzülür.'}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
