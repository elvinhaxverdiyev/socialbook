import { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { composerTypes } from '../../data/constants';
import { useApp } from '../../context/AppContext';
import { LIMITS } from '../../utils/security';

const coverColors = ['#7A2331', '#435A45', '#B08D3D', '#22304F'];

export default function Composer({ onSubmit }) {
  const { currentUser } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [type, setType] = useState('general');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('yaxşı');

  const needsBook = type === 'reading' || type === 'sale';

  const reset = () => {
    setTitle('');
    setAuthor('');
    setText('');
    setPrice('');
    setCondition('yaxşı');
    setType('general');
    setExpanded(false);
  };

  const submit = () => {
    if (!text.trim()) return;
    if (type === 'sale' && !price.trim()) return;

    const payload = {
      type,
      text: text.trim(),
    };

    if (needsBook) {
      payload.book = {
        title: title.trim() || 'Kitab',
        author: author.trim() || 'Naməlum müəllif',
        cover: coverColors[Math.floor(Math.random() * coverColors.length)],
      };
    }

    if (type === 'sale') {
      payload.price = parseFloat(price);
      payload.condition = condition;
    }

    onSubmit(payload);
    reset();
  };

  return (
    <section className="composer">
      <div className="composer__inner">
        <button type="button" className="composer__photo" title="Şəkil əlavə et">
          <Avatar initials={currentUser.initials} size={40} />
          <span className="composer__photo-icon">
            <ImageIcon size={12} />
          </span>
        </button>

        <div className="composer__body">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setExpanded(true)}
            placeholder="Post paylaş..."
            rows={expanded ? 3 : 2}
            className="composer__textarea"
            maxLength={LIMITS.postText}
          />

          {expanded && (
            <div className="composer__details">
              <div className="composer__types">
                {composerTypes.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`chip ${type === opt.value ? 'chip--active' : ''}`}
                    onClick={() => setType(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {needsBook && (
                <>
                  <div className="composer__row">
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Kitabın adı (istəyə görə)"
                      className="input"
                      maxLength={LIMITS.bookTitle}
                    />
                    <input
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Müəllif (istəyə görə)"
                      className="input"
                      maxLength={LIMITS.bookAuthor}
                    />
                  </div>

                  {type === 'sale' && (
                    <div className="composer__row">
                      <input
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Qiymət (₼)"
                        type="number"
                        min="0"
                        step="0.5"
                        className="input"
                      />
                      <select
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        className="input"
                      >
                        <option value="yeni">Yeni</option>
                        <option value="yaxşı">Yaxşı vəziyyətdə</option>
                        <option value="orta">Orta vəziyyətdə</option>
                      </select>
                    </div>
                  )}
                </>
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
