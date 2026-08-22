import { useEffect, useMemo, useRef, useState } from 'react';
import Avatar from '../ui/Avatar';
import RatingStars from '../ui/RatingStars';
import BookPicker, { CUSTOM_BOOK } from './BookPicker';
import { composerTypes } from '../../data/constants';
import { bookCatalog, findBookByTitle, genres } from '../../data/books';
import { useApp } from '../../context/AppContext';
import { LIMITS, parsePositivePrice } from '../../utils/security';

const coverColors = ['#7A2331', '#435A45', '#B08D3D', '#22304F'];
const TEXTAREA_MIN = 72;
const TEXTAREA_MAX = 320;

export default function Composer({ onSubmit }) {
  const { currentUser, shelfBooks } = useApp();
  const textareaRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [type, setType] = useState('general');
  const [bookId, setBookId] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [text, setText] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('yaxşı');
  const [rating, setRating] = useState(0);

  const needsBook = type === 'reading' || type === 'finished' || type === 'sale';
  const isCustomBook = bookId === CUSTOM_BOOK;
  const isSale = type === 'sale';

  const shelfOptions = useMemo(
    () =>
      (shelfBooks || []).map((book) => ({
        id: String(book.id),
        title: book.title,
        author: book.author,
        cover: book.cover,
        bookId: book.bookId,
        source: 'shelf',
      })),
    [shelfBooks],
  );

  const catalogOptions = useMemo(
    () =>
      bookCatalog.map((book) => ({
        id: `cat-${book.id}`,
        bookId: book.id,
        title: book.title,
        author: book.author,
        cover: book.cover,
        genres: book.genres,
        source: 'catalog',
      })),
    [],
  );

  const readingPickerBooks = useMemo(() => {
    const shelfKeys = new Set(
      shelfBooks.map((b) => b.bookId || b.title.toLowerCase()),
    );
    const catalogOnly = catalogOptions.filter(
      (b) => !shelfKeys.has(b.bookId) && !shelfKeys.has(b.title.toLowerCase()),
    );
    return [...shelfOptions, ...catalogOnly];
  }, [shelfOptions, catalogOptions, shelfBooks]);

  const pickerBooks = isSale ? catalogOptions : readingPickerBooks;
  const selectedBook = pickerBooks.find((book) => book.id === bookId) || null;

  const resolvedCategory = useMemo(() => {
    if (isCustomBook) return category;

    if (selectedBook?.genres?.length) return selectedBook.genres[0];

    if (selectedBook?.bookId) {
      const catalogBook = bookCatalog.find((b) => b.id === selectedBook.bookId);
      if (catalogBook?.genres?.length) return catalogBook.genres[0];
    }

    if (selectedBook?.title) {
      const match = findBookByTitle(selectedBook.title);
      if (match?.genres?.length) return match.genres[0];
    }

    return category;
  }, [isCustomBook, selectedBook, category]);

  const needsManualCategory = isSale && Boolean(bookId) && !isCustomBook
    ? !resolvedCategory
    : isSale && isCustomBook;

  const categoryLabel = genres.find((g) => g.id === resolvedCategory)?.label;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = '0px';
    const next = Math.min(Math.max(el.scrollHeight, TEXTAREA_MIN), TEXTAREA_MAX);
    el.style.height = `${next}px`;
  }, [text, expanded]);

  const reset = () => {
    setBookId('');
    setTitle('');
    setAuthor('');
    setCategory('');
    setText('');
    setPrice('');
    setCondition('yaxşı');
    setRating(0);
    setType('general');
    setExpanded(false);
  };

  const resolveBook = () => {
    if (selectedBook) {
      return {
        title: selectedBook.title,
        author: selectedBook.author || 'Naməlum müəllif',
        cover: selectedBook.cover || coverColors[0],
        ...(selectedBook.bookId ? { bookId: selectedBook.bookId } : {}),
      };
    }

    if (isCustomBook) {
      return {
        title: title.trim() || 'Kitab',
        author: author.trim() || 'Naməlum müəllif',
        cover: coverColors[Math.floor(Math.random() * coverColors.length)],
      };
    }

    return null;
  };

  const submit = () => {
    if (!text.trim()) return;
    if (isSale && !price.trim()) return;

    if (needsBook) {
      if (!bookId) return;
      if (isCustomBook && !title.trim()) return;
    }

    if (isSale) {
      const nextCategory = isCustomBook || needsManualCategory ? category : resolvedCategory;
      if (!nextCategory) return;
    }

    const payload = {
      type,
      text: text.trim(),
    };

    if (needsBook) {
      const book = resolveBook();
      if (!book) return;
      payload.book = book;
    }

    if (isSale) {
      const parsedPrice = parsePositivePrice(price);
      if (parsedPrice === null) return;
      payload.price = parsedPrice;
      payload.condition = condition;
      payload.category = isCustomBook || needsManualCategory ? category : resolvedCategory;
    }

    if (type === 'finished' && rating > 0) {
      payload.rating = rating;
    }

    onSubmit(payload);
    reset();
  };

  const changeType = (nextType) => {
    setType(nextType);
    setBookId('');
    setTitle('');
    setAuthor('');
    setCategory('');
    if (nextType === 'general') {
      setRating(0);
    }
  };

  const handleBookChange = (nextId) => {
    setBookId(nextId);
    if (nextId !== CUSTOM_BOOK) {
      setTitle('');
      setAuthor('');
      setCategory('');
    }
  };

  return (
    <section className="composer">
      <div className="composer__inner">
        <div className="composer__photo">
          <Avatar
            initials={currentUser.initials}
            src={currentUser.avatarUrl}
            presetId={currentUser.avatarPresetId}
            size={40}
            name={currentUser.name}
          />
        </div>

        <div className="composer__body">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setExpanded(true)}
            placeholder="Post paylaş..."
            rows={1}
            className="composer__textarea"
            maxLength={LIMITS.postText}
          />

          {expanded && (
            <div className="composer__details">
              <div className="composer__types" role="group" aria-label="Post tipi">
                {composerTypes.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`chip composer__type ${type === opt.value ? 'chip--active' : ''}`}
                    onClick={() => changeType(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {needsBook && (
                <div className="composer__panel">
                  <div className="composer__block">
                    <p className="composer__label">Kitab</p>

                    <BookPicker
                      books={pickerBooks}
                      value={bookId}
                      onChange={handleBookChange}
                      customLabel={isSale ? 'Kataloqda yoxdur…' : 'Digər kitab...'}
                    />

                    {selectedBook && !isCustomBook && isSale && categoryLabel && (
                      <p className="composer__meta-line">
                        Kateqoriya: <strong>{categoryLabel}</strong>
                      </p>
                    )}

                    {isCustomBook && (
                      <div className="composer__grid">
                        <label className="composer__field">
                          <span className="composer__field-label">Kitabın adı</span>
                          <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Məs: Dune"
                            className="input"
                            maxLength={LIMITS.bookTitle}
                          />
                        </label>
                        {(isSale || type === 'finished') && (
                          <label className="composer__field">
                            <span className="composer__field-label">Müəllif</span>
                            <input
                              value={author}
                              onChange={(e) => setAuthor(e.target.value)}
                              placeholder={isSale ? 'Məs: Frank Herbert' : 'İstəyə görə'}
                              className="input"
                              maxLength={LIMITS.bookAuthor}
                            />
                          </label>
                        )}
                      </div>
                    )}

                    {isSale && (isCustomBook || needsManualCategory) && (
                      <label className="composer__field">
                        <span className="composer__field-label">Kateqoriya *</span>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="input"
                          aria-label="Kateqoriya"
                          required
                        >
                          <option value="">Seç</option>
                          {genres.map((genre) => (
                            <option key={genre.id} value={genre.id}>
                              {genre.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                  </div>

                  {type === 'finished' && (
                    <div className="composer__block">
                      <p className="composer__label">Reytinq</p>
                      <div className="composer__rating">
                        <RatingStars rating={rating} interactive onChange={setRating} size={18} />
                      </div>
                    </div>
                  )}

                  {isSale && (
                    <div className="composer__block">
                      <p className="composer__label">Satış detalları</p>
                      <div className="composer__grid">
                        <label className="composer__field">
                          <span className="composer__field-label">Qiymət (₼)</span>
                          <input
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0.00"
                            type="number"
                            min="0"
                            max="1000000"
                            step="0.5"
                            className="input"
                          />
                        </label>
                        <label className="composer__field">
                          <span className="composer__field-label">Vəziyyət</span>
                          <select
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                            className="input"
                          >
                            <option value="yeni">Yeni</option>
                            <option value="yaxşı">Yaxşı vəziyyətdə</option>
                            <option value="orta">Orta vəziyyətdə</option>
                          </select>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="composer__footer">
            <button type="button" className="btn btn--primary" onClick={submit}>
              Paylaş
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
