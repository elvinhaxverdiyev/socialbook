import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Plus, Search } from 'lucide-react';
import BookSpine from '../ui/BookSpine';
import { sanitizeSearchQuery } from '../../utils/security';

const CUSTOM_BOOK = '__custom__';

export default function BookPicker({ books = [], value, onChange, customLabel = 'Digər kitab...' }) {
  const rootRef = useRef(null);
  const searchRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selected = useMemo(() => {
    if (!value) return null;
    if (value === CUSTOM_BOOK) return { id: CUSTOM_BOOK, title: customLabel };
    return books.find((book) => String(book.id) === String(value)) || null;
  }, [books, value, customLabel]);

  const filtered = useMemo(() => {
    const q = sanitizeSearchQuery(query).toLowerCase();
    if (!q) return books;
    return books.filter((book) => {
      const title = String(book.title || '').toLowerCase();
      const author = String(book.author || '').toLowerCase();
      return title.includes(q) || author.includes(q);
    });
  }, [books, query]);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
        setQuery('');
      }
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [open]);

  const pick = (nextValue) => {
    onChange(nextValue);
    setOpen(false);
    setQuery('');
  };

  return (
    <div className={`book-picker ${open ? 'book-picker--open' : ''}`} ref={rootRef}>
      <button
        type="button"
        className="book-picker__trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="book-picker__trigger-main">
          {selected && selected.id !== CUSTOM_BOOK && (
            <BookSpine color={selected.cover || '#7A2331'} width={18} height={26} />
          )}
          <span className="book-picker__trigger-text">
            {selected ? (
              <>
                <span className="book-picker__trigger-title">{selected.title}</span>
                {selected.author && (
                  <span className="book-picker__trigger-sub">{selected.author}</span>
                )}
              </>
            ) : (
              <span className="book-picker__placeholder">Kitab seç...</span>
            )}
          </span>
        </span>
        <ChevronDown size={16} className="book-picker__chevron" />
      </button>

      {open && (
        <div className="book-picker__menu" role="listbox">
          <div className="book-picker__search">
            <Search size={14} className="book-picker__search-icon" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(sanitizeSearchQuery(e.target.value))}
              placeholder="Axtar"
              className="book-picker__search-input"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <div className="book-picker__list">
            {filtered.length === 0 ? (
              <p className="book-picker__empty">
                {books.length === 0
                  ? 'Kitab tapılmadı. Digər kitab əlavə edə bilərsən.'
                  : 'Uyğun kitab tapılmadı.'}
              </p>
            ) : (
              filtered.map((book) => {
                const active = String(value) === String(book.id);
                return (
                  <button
                    key={book.id}
                    type="button"
                    className={`book-picker__option ${active ? 'book-picker__option--active' : ''}`}
                    onClick={() => pick(book.id)}
                    role="option"
                    aria-selected={active}
                  >
                    <BookSpine color={book.cover || '#7A2331'} width={22} height={32} />
                    <span className="book-picker__option-text">
                      <span className="book-picker__option-title">{book.title}</span>
                      {book.author && book.author !== 'Naməlum müəllif' && (
                        <span className="book-picker__option-sub">{book.author}</span>
                      )}
                    </span>
                    {active && <Check size={14} className="book-picker__check" />}
                  </button>
                );
              })
            )}
          </div>

          <button
            type="button"
            className={`book-picker__custom ${value === CUSTOM_BOOK ? 'book-picker__custom--active' : ''}`}
            onClick={() => pick(CUSTOM_BOOK)}
          >
            <Plus size={14} />
            {customLabel}
          </button>
        </div>
      )}
    </div>
  );
}

export { CUSTOM_BOOK };
