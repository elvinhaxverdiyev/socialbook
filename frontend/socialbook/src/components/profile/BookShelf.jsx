import { useEffect, useRef, useState } from 'react';
import {
  Plus,
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  BookOpen,
  ArrowRight,
  Palette,
} from '../../icons';
import { shelfStatuses } from '../../data/constants';
import { findBookByTitle } from '../../data/books';
import { getShelfSectionTheme, shelfThemeToCssVars } from '../../data/shelfTheme';
import { useApp } from '../../context/AppContext';
import { LIMITS, sanitizeHexColor } from '../../utils/security';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';
import ShelfCustomizeModal from './ShelfCustomizeModal';
import DraggableShelfSticker from './DraggableShelfSticker';

const COVER_COLORS = ['#7A2331', '#435A45', '#B08D3D', '#22304F', '#6B4C8A', '#2E6B5A'];
const BOOK_HEIGHT = 108;
const BOOK_WIDTH = 26;

function hashCode(str) {
  let h = 0;
  const s = String(str);
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function deriveShape(id) {
  const h = hashCode(id);
  return {
    height: BOOK_HEIGHT,
    width: BOOK_WIDTH,
    rot: -2 + ((h >> 6) % 40) / 10,
  };
}

function coverShades(hex) {
  const safe = sanitizeHexColor(hex).replace('#', '');
  const r = parseInt(safe.slice(0, 2), 16);
  const g = parseInt(safe.slice(2, 4), 16);
  const b = parseInt(safe.slice(4, 6), 16);
  const clamp = (n) => Math.max(0, Math.min(255, n));
  const to = (rr, gg, bb) => `rgb(${clamp(rr)}, ${clamp(gg)}, ${clamp(bb)})`;
  return {
    light: to(r + 32, g + 28, b + 24),
    base: `#${safe}`,
    dark: to(r - 36, g - 32, b - 28),
  };
}

export default function BookShelf({
  books,
  readOnly = false,
  ownerHandle = null,
  embedded = false,
}) {
  const {
    shelfBooks,
    addShelfBook,
    removeShelfBook,
    updateShelfBookStatus,
    openShelfPage,
    openBook,
    currentUser,
    getShelfTheme,
    updateShelfTheme,
    isLoggedIn,
    requireAuth,
  } = useApp();

  const themeHandle = readOnly ? ownerHandle : currentUser.handle;
  const shelfTheme = getShelfTheme(themeHandle);

  const displayBooks = books ?? shelfBooks;
  const [showForm, setShowForm] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [selected, setSelected] = useState(null);
  const [justAdded, setJustAdded] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    author: '',
    cover: COVER_COLORS[0],
    status: 'reading',
  });
  const scrollRefs = useRef({});

  useBodyScrollLock(showForm || Boolean(selected));

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        setSelected(null);
        setShowForm(false);
        setShowCustomize(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openAddForm = (status) => {
    if (!requireAuth('Kitab əlavə etmək üçün daxil ol və ya qeydiyyatdan keç.')) return;
    setForm({
      title: '',
      author: '',
      cover: COVER_COLORS[Math.floor(Math.random() * COVER_COLORS.length)],
      status,
    });
    setShowForm(true);
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!form.title.trim() || readOnly) return;

    const addedId = addShelfBook({
      title: form.title.trim(),
      author: form.author.trim(),
      cover: form.cover,
      status: form.status,
    });
    if (!addedId) return;

    setJustAdded(addedId);
    setShowForm(false);
    setTimeout(() => {
      const el = scrollRefs.current[form.status];
      if (el) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    }, 50);
  };

  const deleteBook = (id) => {
    setSelected(null);
    setRemovingId(id);
    window.setTimeout(() => {
      removeShelfBook(id);
      setRemovingId((current) => (current === id ? null : current));
    }, 550);
  };

  const scrollShelf = (key, dir) => {
    const el = scrollRefs.current[key];
    if (el) el.scrollBy({ left: dir * 260, behavior: 'smooth' });
  };

  const openBookDetail = (book) => {
    const match = book.bookId ? { id: book.bookId } : findBookByTitle(book.title);
    if (match) openBook(match.id);
  };

  const selectedBook = displayBooks.find((b) => b.id === selected);
  const showViewAll = !embedded && displayBooks.length > 0;

  return (
    <section
      className={`book-shelf${readOnly ? ' book-shelf--readonly' : ''}${
        embedded ? ' book-shelf--embedded' : ''
      } book-shelf--themed`}
    >
      {!embedded && (
        <div className="book-shelf__header">
          <div className="book-shelf__heading">
            <span className="book-shelf__icon">
              <BookMarked size={15} />
            </span>
            <div>
              <h2 className="font-display">Kitab rəfi</h2>
              <p className="book-shelf__subtitle">Oxuma yolunu üç rəfdə izlə</p>
            </div>
            <span className="book-shelf__count">{displayBooks.length}</span>
          </div>
          {!readOnly && isLoggedIn && (
            <div className="book-shelf__header-actions">
              <button
                type="button"
                className="btn btn--ghost btn--sm book-shelf__toggle"
                onClick={() => setShowCustomize(true)}
              >
                <Palette size={14} />
                Rəfi bəzə
              </button>
              <button
                type="button"
                className="btn btn--ghost btn--sm book-shelf__toggle"
                onClick={() => openAddForm('reading')}
              >
                <Plus size={14} />
                Kitab əlavə et
              </button>
            </div>
          )}
        </div>
      )}

      {embedded && !readOnly && isLoggedIn && (
        <div className="book-shelf__embedded-actions">
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => setShowCustomize(true)}
          >
            <Palette size={14} />
            Rəfi bəzə
          </button>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => openAddForm('reading')}
          >
            <Plus size={14} />
            Kitab əlavə et
          </button>
        </div>
      )}

      {displayBooks.length === 0 && readOnly ? (
        <div className="book-shelf__empty">
          <p>Bu bölmədə hələ kitab yoxdur.</p>
        </div>
      ) : (
        shelfStatuses.map((cat) => {
          const catBooks = displayBooks.filter((b) => (b.status || 'want') === cat.value);
          const sectionTheme = getShelfSectionTheme(shelfTheme, cat.value);
          return (
            <div className="book-shelf__block" key={cat.value}>
              <div className="book-shelf__block-head">
                <div className="book-shelf__block-label">
                  <h3 className="font-display">{cat.label}</h3>
                  <span className="book-shelf__block-count">{catBooks.length}</span>
                </div>
                {catBooks.length > 3 && (
                  <div className="book-shelf__arrows">
                    <button
                      type="button"
                      className="book-shelf__arrow"
                      onClick={() => scrollShelf(cat.value, -1)}
                      aria-label="Sola"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      type="button"
                      className="book-shelf__arrow"
                      onClick={() => scrollShelf(cat.value, 1)}
                      aria-label="Sağa"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div
                className="book-shelf__rail-wrap"
                data-sticker-dropzone
                style={shelfThemeToCssVars(sectionTheme)}
              >
                <div className="book-shelf__rail-back" aria-hidden="true" />
                {sectionTheme.stickers.map((sticker) => (
                  <DraggableShelfSticker key={`${cat.value}-${sticker.id}`} sticker={sticker} />
                ))}
                <div
                  className="book-shelf__rail"
                  ref={(el) => {
                    scrollRefs.current[cat.value] = el;
                  }}
                >
                  {catBooks.length === 0 && (
                    <p className="book-shelf__rail-empty">
                      {readOnly ? 'Boş rəf' : cat.hint}
                    </p>
                  )}
                  {catBooks.map((book) => {
                    const shape = deriveShape(book.id);
                    const color = coverShades(book.cover);
                    const isRemoving = removingId === book.id;
                    const isNew = justAdded === book.id;

                    return (
                      <div
                        key={book.id}
                        role="button"
                        tabIndex={0}
                        title={book.title}
                        className={
                          'book-shelf__spine' +
                          (isNew ? ' book-shelf__spine--drop' : '') +
                          (isRemoving ? ' book-shelf__spine--remove' : '')
                        }
                        style={{
                          '--rot': `${shape.rot}deg`,
                          width: shape.width,
                          height: shape.height,
                          background: `linear-gradient(160deg, ${color.light}, ${color.base} 55%, ${color.dark})`,
                        }}
                        onClick={() => {
                          if (!isRemoving) setSelected(book.id);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelected(book.id);
                          }
                        }}
                        onAnimationEnd={() => {
                          if (isNew) setJustAdded(null);
                        }}
                      >
                        <span className="book-shelf__spine-title">{book.title}</span>
                      </div>
                    );
                  })}
                  {!readOnly && (
                    <button
                      type="button"
                      className="book-shelf__add-slot"
                      onClick={() => openAddForm(cat.value)}
                      aria-label={`${cat.label} rəfinə əlavə et`}
                    >
                      <Plus size={18} />
                    </button>
                  )}
                </div>
                <div className="book-shelf__plank" aria-hidden="true" />
                <div className="book-shelf__plank-edge" aria-hidden="true" />
              </div>
            </div>
          );
        })
      )}

      {showViewAll && (
        <div className="book-shelf__more">
          <button
            type="button"
            className="book-shelf__view-all"
            onClick={() =>
              openShelfPage({
                handle: readOnly ? ownerHandle : null,
                filter: 'all',
              })
            }
          >
            <span>
              Tam rəfə bax
              <small>{displayBooks.length} kitab</small>
            </span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {selectedBook && (
        <div className="book-shelf__backdrop" onClick={() => setSelected(null)}>
          <div
            className="book-shelf__modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {(() => {
              const color = coverShades(selectedBook.cover);
              return (
                <>
                  <div
                    className="book-shelf__modal-cover"
                    style={{
                      background: `linear-gradient(160deg, ${color.light}, ${color.base} 55%, ${color.dark})`,
                    }}
                  >
                    <button
                      type="button"
                      className="book-shelf__modal-close"
                      onClick={() => setSelected(null)}
                      aria-label="Bağla"
                    >
                      <X size={13} />
                    </button>
                    <BookOpen size={20} color="rgba(255,255,255,.55)" />
                    <div className="book-shelf__modal-cover-title font-display">
                      {selectedBook.title}
                    </div>
                  </div>
                  <div className="book-shelf__modal-info">
                    <div>
                      <h3 className="font-display">{selectedBook.title}</h3>
                      {selectedBook.author && selectedBook.author !== 'Naməlum müəllif' && (
                        <p className="book-shelf__modal-author">{selectedBook.author}</p>
                      )}
                    </div>

                    {!readOnly && (
                      <div className="book-shelf__field">
                        <label>Rəf</label>
                        <div className="book-shelf__segmented">
                          {shelfStatuses.map((c) => (
                            <button
                              key={c.value}
                              type="button"
                              className={
                                'book-shelf__seg-btn' +
                                (selectedBook.status === c.value ? ' book-shelf__seg-btn--active' : '')
                              }
                              onClick={() => updateShelfBookStatus(selectedBook.id, c.value)}
                            >
                              {c.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {readOnly && (
                      <p className="book-shelf__modal-status">
                        {shelfStatuses.find((s) => s.value === selectedBook.status)?.label ||
                          'Oxuyacam'}
                      </p>
                    )}

                    <div className="book-shelf__modal-actions">
                      {!readOnly ? (
                        <button
                          type="button"
                          className="book-shelf__text-btn book-shelf__text-btn--danger"
                          onClick={() => deleteBook(selectedBook.id)}
                        >
                          <Trash2 size={13} /> Sil
                        </button>
                      ) : (
                        <span />
                      )}
                      <div className="book-shelf__modal-actions-right">
                        <button
                          type="button"
                          className="book-shelf__text-btn"
                          onClick={() => openBookDetail(selectedBook)}
                        >
                          Kitab səhifəsi
                        </button>
                        <button
                          type="button"
                          className="book-shelf__text-btn"
                          onClick={() => setSelected(null)}
                        >
                          Bağla
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {showCustomize && !readOnly && isLoggedIn && (
        <ShelfCustomizeModal
          theme={shelfTheme}
          onSave={(nextTheme) => {
            if (updateShelfTheme(nextTheme)) setShowCustomize(false);
          }}
          onClose={() => setShowCustomize(false)}
        />
      )}

      {showForm && !readOnly && (
        <div className="book-shelf__backdrop" onClick={() => setShowForm(false)}>
          <form
            className="book-shelf__modal book-shelf__modal--form"
            onClick={(e) => e.stopPropagation()}
            onSubmit={submitForm}
          >
            <div className="book-shelf__modal-info book-shelf__modal-info--full">
              <h3 className="font-display">Yeni kitab əlavə et</h3>

              <div className="book-shelf__field">
                <label>Rəf</label>
                <div className="book-shelf__segmented">
                  {shelfStatuses.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      className={
                        'book-shelf__seg-btn' +
                        (form.status === c.value ? ' book-shelf__seg-btn--active' : '')
                      }
                      onClick={() => setForm((f) => ({ ...f, status: c.value }))}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="book-shelf__field">
                <label htmlFor="shelf-book-title">Kitabın adı</label>
                <input
                  id="shelf-book-title"
                  className="input"
                  autoFocus
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="məs. Əli və Nino"
                  maxLength={LIMITS.shelfTitle}
                  required
                />
              </div>

              <div className="book-shelf__field">
                <label htmlFor="shelf-book-author">Müəllif</label>
                <input
                  id="shelf-book-author"
                  className="input"
                  value={form.author}
                  onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                  placeholder="məs. Qurban Səid"
                  maxLength={LIMITS.shelfAuthor}
                />
              </div>

              <div className="book-shelf__field">
                <label>Cildin rəngi</label>
                <div className="book-shelf__swatches">
                  {COVER_COLORS.map((c) => (
                    <button
                      type="button"
                      key={c}
                      className={
                        'book-shelf__swatch' +
                        (form.cover === c ? ' book-shelf__swatch--selected' : '')
                      }
                      style={{ background: c }}
                      onClick={() => setForm((f) => ({ ...f, cover: c }))}
                      aria-label={`Rəng ${c}`}
                    />
                  ))}
                </div>
              </div>

              <div className="book-shelf__form-actions">
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => setShowForm(false)}
                >
                  Ləğv et
                </button>
                <button type="submit" className="btn btn--primary btn--sm">
                  <Plus size={14} /> Rəfə qoy
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
