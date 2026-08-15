import { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { Palette, RotateCcw, X } from 'lucide-react';
import {
  DEFAULT_SHELF_THEME,
  SHELF_PLANK_PRESETS,
  SHELF_STICKER_OPTIONS,
  SHELF_WALL_PRESETS,
  createStickerId,
  clampStickerPosition,
  sanitizeShelfTheme,
  shelfThemeToCssVars,
} from '../../data/shelfTheme';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';
import useEscapeKey from '../../hooks/useEscapeKey';
import useFocusTrap from '../../hooks/useFocusTrap';
import DraggableShelfSticker from './DraggableShelfSticker';

export default function ShelfCustomizeModal({ theme, onSave, onClose }) {
  const [draft, setDraft] = useState(() => sanitizeShelfTheme(theme));
  const cssVars = shelfThemeToCssVars(draft);

  const handleClose = useCallback(() => onClose?.(), [onClose]);
  const cardRef = useFocusTrap(true);
  useBodyScrollLock(true);
  useEscapeKey(handleClose, true);

  const toggleSticker = (emoji) => {
    setDraft((prev) => {
      const exists = prev.stickers.find((s) => s.emoji === emoji);
      if (exists) {
        return {
          ...prev,
          stickers: prev.stickers.filter((s) => s.emoji !== emoji),
        };
      }
      return {
        ...prev,
        stickers: [
          ...prev.stickers,
          { id: createStickerId(), emoji, x: 50, y: 38 },
        ],
      };
    });
  };

  const moveSticker = (id, x, y) => {
    const pos = clampStickerPosition(x, y);
    setDraft((prev) => ({
      ...prev,
      stickers: prev.stickers.map((sticker) =>
        sticker.id === id ? { ...sticker, x: pos.x, y: pos.y } : sticker,
      ),
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(sanitizeShelfTheme(draft));
  };

  const handleReset = () => {
    setDraft({ ...DEFAULT_SHELF_THEME, stickers: [] });
  };

  return createPortal(
    <div className="shelf-customize__backdrop" onClick={handleClose}>
      <form
        ref={cardRef}
        className="shelf-customize"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSave}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shelf-customize-title"
      >
        <header className="shelf-customize__head">
          <div className="shelf-customize__title-wrap">
            <span className="shelf-customize__icon">
              <Palette size={16} />
            </span>
            <div>
              <h2 id="shelf-customize-title" className="font-display">
                Rəfi bəzə
              </h2>
              <p className="shelf-customize__subtitle">
                Stikerləri seç, sürükləyib rəfdə istədiyin yerə qoy
              </p>
            </div>
          </div>
          <button
            type="button"
            className="shelf-customize__close"
            onClick={handleClose}
            aria-label="Bağla"
          >
            <X size={16} />
          </button>
        </header>

        <div className="shelf-customize__preview book-shelf--themed" style={cssVars}>
          <div className="shelf-customize__preview-rail" data-sticker-dropzone>
            <div className="book-shelf__rail-back" aria-hidden="true" />
            <div className="shelf-customize__preview-books" aria-hidden="true">
              <span style={{ background: '#7A2331' }} />
              <span style={{ background: '#435A45' }} />
              <span style={{ background: '#22304F' }} />
            </div>
            {draft.stickers.map((sticker) => (
              <DraggableShelfSticker
                key={sticker.id}
                sticker={sticker}
                editable
                onMove={moveSticker}
              />
            ))}
            <div className="book-shelf__plank" aria-hidden="true" />
            <div className="book-shelf__plank-edge" aria-hidden="true" />
            {draft.stickers.length === 0 && (
              <p className="shelf-customize__drop-hint">Stiker əlavə et və bura sürüklə</p>
            )}
          </div>
        </div>

        <div className="shelf-customize__field">
          <label>Arxa fon rəngi</label>
          <div className="book-shelf__swatches">
            {SHELF_WALL_PRESETS.map((color) => (
              <button
                key={`wall-${color}`}
                type="button"
                className={
                  'book-shelf__swatch' +
                  (draft.wallColor === color ? ' book-shelf__swatch--selected' : '')
                }
                style={{ background: color }}
                onClick={() => setDraft((prev) => ({ ...prev, wallColor: color }))}
                aria-label={`Arxa fon ${color}`}
              />
            ))}
          </div>
        </div>

        <div className="shelf-customize__field">
          <label>Taxta rəngi</label>
          <div className="book-shelf__swatches">
            {SHELF_PLANK_PRESETS.map((color) => (
              <button
                key={`plank-${color}`}
                type="button"
                className={
                  'book-shelf__swatch' +
                  (draft.plankColor === color ? ' book-shelf__swatch--selected' : '')
                }
                style={{ background: color }}
                onClick={() => setDraft((prev) => ({ ...prev, plankColor: color }))}
                aria-label={`Taxta ${color}`}
              />
            ))}
          </div>
        </div>

        <div className="shelf-customize__field">
          <label>
            Stikerlər{' '}
            <span className="shelf-customize__hint">sürüklə</span>
          </label>
          <div className="shelf-customize__stickers">
            {SHELF_STICKER_OPTIONS.map((emoji) => {
              const active = draft.stickers.some((s) => s.emoji === emoji);
              return (
                <button
                  key={emoji}
                  type="button"
                  className={
                    'shelf-customize__sticker-btn' +
                    (active ? ' shelf-customize__sticker-btn--active' : '')
                  }
                  onClick={() => toggleSticker(emoji)}
                  aria-pressed={active}
                  aria-label={`Stiker ${emoji}`}
                >
                  {emoji}
                </button>
              );
            })}
          </div>
        </div>

        <footer className="shelf-customize__actions">
          <button type="button" className="btn btn--ghost btn--sm" onClick={handleReset}>
            <RotateCcw size={14} />
            Standart
          </button>
          <div className="shelf-customize__actions-right">
            <button type="button" className="btn btn--ghost btn--sm" onClick={handleClose}>
              Ləğv et
            </button>
            <button type="submit" className="btn btn--primary btn--sm">
              Saxla
            </button>
          </div>
        </footer>
      </form>
    </div>,
    document.body,
  );
}
