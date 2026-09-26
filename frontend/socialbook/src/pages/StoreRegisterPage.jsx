import { useRef, useState } from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  ImagePlus,
  MapPin,
  Phone,
  Store,
  Users,
} from '../icons';
import { useApp } from '../context/AppContext';
import {
  clampText,
  isValidEmail,
  isValidPassword,
  LIMITS,
  sanitizeImageUrl,
} from '../utils/security';
import LegalModal from '../components/ui/LegalModal';
import { termsContent, communityRulesContent } from '../data/legal';
import { navigateGuestPath } from '../utils/routing';
import usePageTitle from '../hooks/usePageTitle';

const storeFeatures = [
  { icon: Store, text: 'Mağaza profili və elanlar' },
  { icon: Users, text: 'Oxucu icmasına birbaşa çıxış' },
  { icon: BadgeCheck, text: 'Təsdiqlənmə üçün müraciət' },
];

const ALLOWED_COVER_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export default function StoreRegisterPage() {
  const { registerStore } = useApp();
  const coverInputRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [about, setAbout] = useState('');
  const [hours, setHours] = useState('');
  const [phone, setPhone] = useState('');
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverUrl, setCoverUrl] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [legalModal, setLegalModal] = useState(null);
  const [error, setError] = useState('');

  usePageTitle('Mağaza qeydiyyatı');

  const handleCoverChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_COVER_MIMES.has(file.type)) {
      setError('Cover şəkli yalnız JPG, PNG və ya WEBP ola bilər.');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Cover şəkli 5 MB-dan böyük ola bilməz.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null;
      const safeUrl = sanitizeImageUrl(result);
      if (!safeUrl) {
        setError('Cover şəkli yüklənmədi.');
        return;
      }
      setCoverPreview(safeUrl);
      setCoverUrl(safeUrl);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const submit = (event) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password.trim() || !name.trim() || !location.trim()) {
      setError('Məcburi sahələri doldurun.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Düzgün email daxil edin.');
      return;
    }
    if (!isValidPassword(password)) {
      setError('Parol ən azı 6 simvol olmalıdır.');
      return;
    }
    if (!acceptedTerms) {
      setError('Qeydiyyat üçün istifadə şərtləri və topluluq qaydalarını qəbul etməlisiniz.');
      return;
    }

    const ok = registerStore({
      email,
      password,
      name: clampText(name, LIMITS.storeName),
      location: clampText(location, LIMITS.storeLocation),
      description: clampText(description, LIMITS.storeDescription),
      about: clampText(about, LIMITS.storeAbout),
      hours: clampText(hours, LIMITS.storeHours),
      phone: clampText(phone, LIMITS.storePhone),
      coverUrl,
    });

    if (!ok) {
      setError('Mağaza qeydiyyatı tamamlanmadı. Məlumatları yoxlayın.');
    }
  };

  return (
    <div className="welcome-page store-register">
      <div className="welcome-page__bg" aria-hidden="true">
        <div className="welcome-page__blob welcome-page__blob--1" />
        <div className="welcome-page__blob welcome-page__blob--2" />
        <div className="welcome-page__blob welcome-page__blob--3" />
      </div>

      <div className="welcome store-register__layout">
        <div className="welcome__hero store-register__hero">
          <button
            type="button"
            className="store-register__back"
            onClick={() => navigateGuestPath('/login')}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Oxucu girişinə qayıt
          </button>

          <div className="welcome__badge">
            <Store size={14} />
            Mağaza hesabı
          </div>

          <p className="welcome__logo font-display">
            Kitabci<span className="welcome__logo-dot">.com</span>
          </p>
          <h1 className="welcome__title font-display">Mağazanı qeydiyyatdan keçir</h1>
          <p className="welcome__subtitle">
            Mağaza adı, ünvan, qısa təsvir, haqqında mətn, iş saatı və telefon ilə profil
            yaradın — elanlarınızı oxucular birbaşa görəcək.
          </p>

          <div className="store-register__features">
            {storeFeatures.map(({ icon: Icon, text }) => (
              <div key={text} className="welcome__feature-card">
                <span className="welcome__feature-icon store-register__feature-icon">
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="welcome__panel store-register__panel">
          <div className="welcome__panel-header">
            <p className="welcome__panel-title font-display">Mağaza qeydiyyatı</p>
            <p className="welcome__panel-sub">
              Mağaza adı ilə profil yaradılır — ayrıca oxucu username lazım deyil
            </p>
          </div>

          <form className="welcome__form store-register__form" onSubmit={submit}>
            <section className="store-register__section">
              <h2 className="store-register__section-title">Giriş məlumatları</h2>

              <div className="welcome__field">
                <label htmlFor="store-owner-email">Email *</label>
                <input
                  id="store-owner-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="magaza@example.com"
                  className="input"
                  autoComplete="email"
                  maxLength={LIMITS.email}
                />
              </div>

              <div className="welcome__field">
                <label htmlFor="store-owner-password">Parol *</label>
                <input
                  id="store-owner-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input"
                  autoComplete="new-password"
                  maxLength={LIMITS.password}
                />
              </div>
            </section>

            <section className="store-register__section">
              <h2 className="store-register__section-title">Mağaza məlumatları</h2>

              <div className="welcome__field">
                <label htmlFor="store-name">Mağaza adı *</label>
                <input
                  id="store-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Məs: Kitab Klubu"
                  className="input"
                  maxLength={LIMITS.storeName}
                />
              </div>

              <div className="welcome__field">
                <label htmlFor="store-location">
                  <MapPin size={14} aria-hidden="true" /> Ünvan / yer *
                </label>
                <input
                  id="store-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Məs: Nizami küç., Bakı"
                  className="input"
                  maxLength={LIMITS.storeLocation}
                />
              </div>

              <div className="welcome__field">
                <label htmlFor="store-description">Qısa təsvir</label>
                <input
                  id="store-description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mağaza haqqında qısa məlumat"
                  className="input"
                  maxLength={LIMITS.storeDescription}
                />
              </div>

              <div className="welcome__field">
                <label htmlFor="store-about">Haqqında</label>
                <textarea
                  id="store-about"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Mağazanız, kolleksiyanız və xidmətləriniz haqqında"
                  className="input store-register__textarea"
                  rows={4}
                  maxLength={LIMITS.storeAbout}
                />
              </div>

              <div className="store-register__grid">
                <div className="welcome__field">
                  <label htmlFor="store-hours">
                    <Clock size={14} aria-hidden="true" /> İş saatı
                  </label>
                  <input
                    id="store-hours"
                    type="text"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="09:00 – 21:00"
                    className="input"
                    maxLength={LIMITS.storeHours}
                  />
                </div>

                <div className="welcome__field">
                  <label htmlFor="store-phone">
                    <Phone size={14} aria-hidden="true" /> Telefon
                  </label>
                  <input
                    id="store-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+994 12 555 12 34"
                    className="input"
                    maxLength={LIMITS.storePhone}
                  />
                </div>
              </div>

              <div className="welcome__field">
                <span className="store-register__label">Cover şəkli</span>
                <div className="store-register__cover">
                  <div className="store-register__cover-preview">
                    {coverPreview ? (
                      <img
                        src={coverPreview}
                        alt=""
                        className="store-register__cover-img"
                        decoding="async"
                      />
                    ) : (
                      <ImagePlus size={24} aria-hidden="true" />
                    )}
                  </div>
                  <div className="store-register__cover-actions">
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="store-register__file"
                      onChange={handleCoverChange}
                    />
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={() => coverInputRef.current?.click()}
                    >
                      Şəkil seç
                    </button>
                    {coverPreview && (
                      <button
                        type="button"
                        className="btn btn--ghost btn--sm"
                        onClick={() => {
                          setCoverPreview(null);
                          setCoverUrl(null);
                          if (coverInputRef.current) coverInputRef.current.value = '';
                        }}
                      >
                        Sil
                      </button>
                    )}
                    <p className="store-register__hint">JPG, PNG, WEBP · max 5 MB</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="welcome__consent">
              <input
                id="store-register-consent"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="welcome__consent-input"
              />
              <span className="welcome__consent-text">
                <button
                  type="button"
                  className="welcome__consent-link"
                  onClick={() => setLegalModal('terms')}
                >
                  İstifadə şərtlərini
                </button>
                {' '}və{' '}
                <button
                  type="button"
                  className="welcome__consent-link"
                  onClick={() => setLegalModal('community')}
                >
                  topluluq qaydalarını
                </button>
                {' '}
                <label htmlFor="store-register-consent" className="welcome__consent-label">
                  oxudum, qəbul edirəm.
                </label>
              </span>
            </div>

            {error && (
              <p className="welcome__error" role="alert" aria-live="assertive">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn btn--primary welcome__submit"
              disabled={!acceptedTerms}
            >
              Mağaza yarat
            </button>
          </form>

          <p className="auth-modal__switch">
            Fərdi oxucu hesabı lazımdır?{' '}
            <button
              type="button"
              className="welcome__link"
              onClick={() => navigateGuestPath('/register')}
            >
              Oxucu qeydiyyatı
            </button>
          </p>

          <p className="welcome__note">
            Demo rejimi — backend qoşulduqdan sonra mağaza profili API-yə göndəriləcək.
          </p>
        </div>
      </div>

      {legalModal === 'terms' && (
        <LegalModal content={termsContent} onClose={() => setLegalModal(null)} />
      )}

      {legalModal === 'community' && (
        <LegalModal content={communityRulesContent} onClose={() => setLegalModal(null)} />
      )}
    </div>
  );
}
