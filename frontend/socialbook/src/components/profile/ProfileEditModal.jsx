import { useEffect, useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { avatarPresets, findAvatarPreset } from '../../data/avatarPresets';
import { getDisplayUsername } from '../../data/mockData';
import {
  clampText,
  isValidUsername,
  LIMITS,
  sanitizeInitials,
  sanitizeUsername,
  usernameToHandle,
} from '../../utils/security';

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export default function ProfileEditModal({ user, onSave, onClose }) {
  const fileInputRef = useRef(null);
  const [username, setUsername] = useState(getDisplayUsername(user.handle));
  const [bio, setBio] = useState(user.bio ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? '');
  const [selectedPresetId, setSelectedPresetId] = useState(
    () => findAvatarPreset(user.avatarUrl)?.id ?? null,
  );
  const [initials, setInitials] = useState(user.initials);
  const [error, setError] = useState('');

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setError('Yalnız JPG, PNG və ya WEBP şəkil yükləyə bilərsiniz.');
      return;
    }

    if (file.size > MAX_AVATAR_BYTES) {
      setError('Şəkil 2 MB-dan kiçik olmalıdır.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
        setSelectedPresetId(null);
        setError('');
      }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const selectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setAvatarUrl(preset.src);
    setError('');
  };

  const removePhoto = () => {
    setAvatarUrl('');
    setSelectedPresetId(null);
    setInitials(sanitizeInitials(username.slice(0, 2).toUpperCase() || user.initials));
  };

  const submit = (event) => {
    event.preventDefault();
    setError('');

    const cleanUsername = sanitizeUsername(username);
    if (!isValidUsername(cleanUsername)) {
      setError('Username ən azı 3 simvol olmalıdır (hərf, rəqəm, _ və .).');
      return;
    }

    const nextHandle = usernameToHandle(cleanUsername);
    if (!nextHandle) {
      setError('Düzgün username daxil edin.');
      return;
    }

    onSave({
      handle: nextHandle,
      bio: clampText(bio, LIMITS.bio),
      avatarUrl: avatarUrl || null,
      avatarPresetId: selectedPresetId,
      initials: avatarUrl
        ? user.initials
        : sanitizeInitials(cleanUsername.slice(0, 2).toUpperCase() || user.initials),
    });
  };

  return (
    <div className="profile-edit-overlay" onClick={onClose} role="presentation">
      <div
        className="profile-edit-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-edit-title"
      >
        <header className="profile-edit-modal__header">
          <h3 id="profile-edit-title" className="profile-edit-modal__title font-display">
            Profili redaktə et
          </h3>
          <button type="button" className="profile-edit-modal__close" onClick={onClose} aria-label="Bağla">
            <X size={18} />
          </button>
        </header>

        <form className="profile-edit-modal__form" onSubmit={submit}>
          <div className="profile-edit-modal__photo">
            <Avatar initials={initials} src={avatarUrl} size={80} />
            <div className="profile-edit-modal__photo-actions">
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={14} />
                Öz şəklin
              </button>
              {avatarUrl && (
                <button type="button" className="btn btn--ghost btn--sm" onClick={removePhoto}>
                  Sil
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="profile-edit-modal__file"
              onChange={handlePhotoChange}
            />
          </div>

          <div className="profile-edit-modal__field">
            <p className="profile-edit-modal__label">Kitab qahramanı avatarı</p>
            <div className="profile-edit-modal__presets">
              {avatarPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`profile-edit-modal__preset ${
                    selectedPresetId === preset.id ? 'profile-edit-modal__preset--active' : ''
                  }`}
                  onClick={() => selectPreset(preset)}
                  title={`${preset.name} — ${preset.book}`}
                >
                  <img src={preset.src} alt={preset.name} />
                </button>
              ))}
            </div>
          </div>

          <div className="profile-edit-modal__field">
            <label htmlFor="profile-username">Username</label>
            <div className="profile-edit-modal__username">
              <span>@</span>
              <input
                id="profile-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(sanitizeUsername(e.target.value))}
                placeholder="aysel_reads"
                className="input"
                maxLength={LIMITS.username}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="profile-edit-modal__field">
            <label htmlFor="profile-bio">Bio</label>
            <textarea
              id="profile-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Özün haqqında qısa bir şey yaz..."
              className="input profile-edit-modal__bio"
              maxLength={LIMITS.bio}
              rows={3}
            />
            <span className="profile-edit-modal__counter">{bio.length}/{LIMITS.bio}</span>
          </div>

          {error && <p className="profile-edit-modal__error">{error}</p>}

          <div className="profile-edit-modal__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Ləğv et
            </button>
            <button type="submit" className="btn btn--primary">
              Yadda saxla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
