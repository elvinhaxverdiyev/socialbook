import { useCallback, useRef, useState } from 'react';
import { Camera, ImagePlus, X } from '../../icons';
import Avatar from '../ui/Avatar';
import { avatarPresets, findAvatarPreset, resolveAvatarPresetUrl } from '../../data/avatarPresets';
import { DEFAULT_BANNER, bannerPresets } from '../../data/media';
import { getDisplayUsername } from '../../data/mockData';
import {
  clampText,
  isValidUsername,
  LIMITS,
  sanitizeInitials,
  sanitizeImageUrl,
  sanitizeUsername,
  usernameToHandle,
} from '../../utils/security';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';
import useEscapeKey from '../../hooks/useEscapeKey';
import useFocusTrap from '../../hooks/useFocusTrap';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_AVATAR_BYTES = MAX_IMAGE_BYTES;
const MAX_BANNER_BYTES = MAX_IMAGE_BYTES;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function readImageFile(file, maxBytes, onSuccess, onError) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    onError('Yalnız JPG, PNG və ya WEBP şəkil yükləyə bilərsiniz.');
    return;
  }

  if (file.size > maxBytes) {
    onError(`Şəkil ${(maxBytes / (1024 * 1024)).toFixed(0)} MB-dan kiçik olmalıdır.`);
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === 'string') onSuccess(reader.result);
  };
  reader.readAsDataURL(file);
}

export default function ProfileEditModal({ user, onSave, onClose }) {
  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const [username, setUsername] = useState(getDisplayUsername(user.handle));
  const [bio, setBio] = useState(user.bio ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? '');
  const [bannerUrl, setBannerUrl] = useState(user.bannerUrl ?? DEFAULT_BANNER);
  const [selectedPresetId, setSelectedPresetId] = useState(
    () => user.avatarPresetId ?? findAvatarPreset(user.avatarUrl)?.id ?? null,
  );
  const [selectedBannerId, setSelectedBannerId] = useState(
    () => bannerPresets.find((preset) => preset.src === user.bannerUrl)?.id ?? null,
  );
  const [initials, setInitials] = useState(user.initials);
  const [error, setError] = useState('');

  const handleClose = useCallback(() => onClose?.(), [onClose]);
  const cardRef = useFocusTrap(true);
  useBodyScrollLock(true);
  useEscapeKey(handleClose, true);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    readImageFile(
      file,
      MAX_AVATAR_BYTES,
      (result) => {
        setAvatarUrl(result);
        setSelectedPresetId(null);
        setError('');
      },
      setError,
    );
    event.target.value = '';
  };

  const handleBannerChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    readImageFile(
      file,
      MAX_BANNER_BYTES,
      (result) => {
        setBannerUrl(result);
        setSelectedBannerId(null);
        setError('');
      },
      setError,
    );
    event.target.value = '';
  };

  const selectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setAvatarUrl(preset.src);
    setError('');
  };

  const selectBannerPreset = (preset) => {
    setSelectedBannerId(preset.id);
    setBannerUrl(preset.src);
    setError('');
  };

  const removePhoto = () => {
    setAvatarUrl('');
    setSelectedPresetId(null);
    setInitials(sanitizeInitials(username.slice(0, 2).toUpperCase() || user.initials));
  };

  const resetBanner = () => {
    setBannerUrl(DEFAULT_BANNER);
    setSelectedBannerId(null);
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

    let safeAvatarUrl = null;

    if (selectedPresetId) {
      safeAvatarUrl = resolveAvatarPresetUrl(selectedPresetId);
      if (!safeAvatarUrl) {
        setError('Seçilmiş avatar tapılmadı.');
        return;
      }
    } else if (avatarUrl) {
      safeAvatarUrl = sanitizeImageUrl(avatarUrl);
      if (!safeAvatarUrl) {
        setError('Şəkil formatı dəstəklənmir və ya çox böyükdür (max 10 MB).');
        return;
      }
    }

    const safeBannerUrl = sanitizeImageUrl(bannerUrl) ?? DEFAULT_BANNER;

    if (bannerUrl && bannerUrl !== DEFAULT_BANNER && !sanitizeImageUrl(bannerUrl)) {
      setError('Banner formatı dəstəklənmir və ya çox böyükdür (max 10 MB).');
      return;
    }

    onSave({
      handle: nextHandle,
      bio: clampText(bio, LIMITS.bio),
      avatarUrl: safeAvatarUrl,
      avatarPresetId: selectedPresetId,
      bannerUrl: safeBannerUrl,
      initials: safeAvatarUrl
        ? user.initials
        : sanitizeInitials(cleanUsername.slice(0, 2).toUpperCase() || user.initials),
    });
  };

  return (
    <div className="profile-edit-overlay" role="presentation">
      <button
        type="button"
        className="profile-edit-overlay__backdrop"
        onClick={handleClose}
        aria-label="Bağla"
      />
      <div
        ref={cardRef}
        className="profile-edit-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-edit-title"
      >
        <header className="profile-edit-modal__header">
          <h3 id="profile-edit-title" className="profile-edit-modal__title font-display">
            Profili redaktə et
          </h3>
          <button type="button" className="profile-edit-modal__close" onClick={handleClose} aria-label="Bağla">
            <X size={18} />
          </button>
        </header>

        <form className="profile-edit-modal__form" onSubmit={submit}>
          <div className="profile-edit-modal__field">
            <p className="profile-edit-modal__label">Banner</p>
            <div className="profile-edit-modal__banner">
              <img
                src={sanitizeImageUrl(bannerUrl) ?? DEFAULT_BANNER}
                alt=""
                className="profile-edit-modal__banner-img"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
              />
              <div className="profile-edit-modal__banner-actions">
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => bannerInputRef.current?.click()}
                >
                  <ImagePlus size={14} aria-hidden="true" />
                  Banner yüklə
                </button>
                {bannerUrl && bannerUrl !== DEFAULT_BANNER && (
                  <button type="button" className="btn btn--ghost btn--sm" onClick={resetBanner}>
                    Sıfırla
                  </button>
                )}
              </div>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="profile-edit-modal__file"
                onChange={handleBannerChange}
              />
            </div>
            <div className="profile-edit-modal__banner-presets">
              {bannerPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`profile-edit-modal__banner-preset ${
                    selectedBannerId === preset.id ? 'profile-edit-modal__banner-preset--active' : ''
                  }`}
                  onClick={() => selectBannerPreset(preset)}
                  title={preset.label}
                  aria-label={preset.label}
                  aria-pressed={selectedBannerId === preset.id}
                >
                  <img src={preset.src} alt="" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          </div>

          <div className="profile-edit-modal__photo">
            <Avatar
              initials={initials}
              src={avatarUrl}
              presetId={selectedPresetId}
              size={80}
              name={username || 'Profil'}
            />
            <div className="profile-edit-modal__photo-actions">
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => avatarInputRef.current?.click()}
              >
                <Camera size={14} aria-hidden="true" />
                Öz şəklin
              </button>
              {avatarUrl && (
                <button type="button" className="btn btn--ghost btn--sm" onClick={removePhoto}>
                  Sil
                </button>
              )}
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="profile-edit-modal__file"
              onChange={handleAvatarChange}
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
                  aria-label={`${preset.name} — ${preset.book}`}
                  aria-pressed={selectedPresetId === preset.id}
                >
                  <img src={preset.src} alt="" loading="lazy" decoding="async" />
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
                data-autofocus
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

          {error && (
            <p className="profile-edit-modal__error" role="alert" aria-live="assertive">
              {error}
            </p>
          )}

          <div className="profile-edit-modal__actions">
            <button type="button" className="btn btn--ghost" onClick={handleClose}>
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
