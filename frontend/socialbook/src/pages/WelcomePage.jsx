import { useEffect, useState } from 'react';
import { BookOpen, Store, Users, MessageCircle, Star } from '../icons';
import { useApp } from '../context/AppContext';
import heroIllustration from '../assets/welcome-hero.svg';
import {
  isValidEmail,
  isValidPassword,
  isValidUsername,
  LIMITS,
  sanitizeUsername,
} from '../utils/security';
import LegalModal from '../components/ui/LegalModal';
import { termsContent, communityRulesContent } from '../data/legal';
import { genderOptions } from '../data/constants';
import usePageTitle from '../hooks/usePageTitle';
import { navigateGuestPath } from '../utils/routing';

const features = [
  { icon: BookOpen, text: 'Kitab paylaş, oxuma fikirlərini yaz', color: '#7A2331' },
  { icon: Store, text: 'Mağazalardan kitab al', color: '#435A45' },
  { icon: Users, text: 'Oxucu icmasına qoşul', color: '#22304F' },
  { icon: MessageCircle, text: 'Satış elanları və müzakirələr', color: '#B08D3D' },
];

const floatingBooks = [
  { color: '#7A2331', top: '12%', left: '6%', rotate: '-8deg', h: 72 },
  { color: '#435A45', top: '22%', right: '8%', rotate: '12deg', h: 64 },
  { color: '#B08D3D', bottom: '18%', left: '10%', rotate: '6deg', h: 56 },
  { color: '#22304F', bottom: '12%', right: '6%', rotate: '-10deg', h: 68 },
];

function getInitialMode() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  return path === '/register' ? 'register' : 'login';
}

function syncAuthPath(mode) {
  navigateGuestPath(mode === 'register' ? '/register' : '/login');
}

export default function WelcomePage() {
  const { login, register } = useApp();
  const [mode, setMode] = useState(getInitialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [legalModal, setLegalModal] = useState(null);
  const [error, setError] = useState('');

  usePageTitle(mode === 'login' ? 'Daxil ol' : 'Qeydiyyat');

  useEffect(() => {
    syncAuthPath(mode);
  }, []);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    syncAuthPath(nextMode);
    if (nextMode === 'login') {
      setAcceptedTerms(false);
      setGender('');
    }
  };

  const submit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (!username.trim() || !email.trim() || !password.trim()) {
        setError('Bütün sahələri doldurun.');
        return;
      }
      if (!isValidEmail(email)) {
        setError('Düzgün email daxil edin.');
        return;
      }
      if (!isValidUsername(username)) {
        setError('Username ən azı 3 simvol olmalıdır.');
        return;
      }
      if (!gender) {
        setError('Cinsiyyət seçin.');
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

      const ok = register({ username, gender, email, password });
      if (!ok) {
        setError('Qeydiyyat tamamlanmadı. Məlumatları yoxlayın.');
      }
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError('Email və parol daxil edin.');
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

    const ok = login({ email, password });
    if (!ok) {
      setError('Daxil olmaq mümkün olmadı. Məlumatları yoxlayın.');
    }
  };

  return (
    <div className="welcome-page">
      <div className="welcome-page__bg" aria-hidden="true">
        <div className="welcome-page__blob welcome-page__blob--1" />
        <div className="welcome-page__blob welcome-page__blob--2" />
        <div className="welcome-page__blob welcome-page__blob--3" />
      </div>

      {floatingBooks.map((book, i) => (
        <div
          key={i}
          className="welcome-page__float-book"
          style={{
            top: book.top,
            left: book.left,
            right: book.right,
            bottom: book.bottom,
            height: book.h,
            background: book.color,
            transform: `rotate(${book.rotate})`,
          }}
          aria-hidden="true"
        />
      ))}

      <div className="welcome">
        <div className="welcome__hero">
          <div className="welcome__badge">
            <Star size={14} />
            Kitabsevərlər üçün sosial platforma
          </div>

          <p className="welcome__logo font-display">
            Kitabci<span className="welcome__logo-dot">.com</span>
          </p>
          <h1 className="welcome__title font-display">
            Oxu. Paylaş.
            <br />
            Kəşf et.
          </h1>
          <p className="welcome__subtitle">
            Mağazalar və oxucular bir yerdə — kitab alış-verişi, sosial feed və satış
            elanları tək platformada.
          </p>

          <div className="welcome__visual">
            <img
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80"
              alt="Kitab rəfi"
              className="welcome__photo"
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
            />
            <img
              src={heroIllustration}
              alt=""
              className="welcome__illustration"
              aria-hidden="true"
            />
          </div>

          <div className="welcome__features">
            {features.map(({ icon: Icon, text, color }) => (
              <div key={text} className="welcome__feature-card">
                <span className="welcome__feature-icon" style={{ background: `${color}18`, color }}>
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="welcome__panel">
          <div className="welcome__panel-header">
            <p className="welcome__panel-title font-display">
              {mode === 'login' ? 'Xoş gəldin' : 'Hesab yarat'}
            </p>
            <p className="welcome__panel-sub">
              {mode === 'login'
                ? 'Kitabci.com icmasına qoşul'
                : 'Bir neçə addımda qeydiyyatdan keç'}
            </p>
          </div>

          <div className="welcome__tabs" role="tablist" aria-label="Giriş növü">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              className={`welcome__tab ${mode === 'login' ? 'welcome__tab--active' : ''}`}
              onClick={() => switchMode('login')}
            >
              Daxil ol
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              className={`welcome__tab ${mode === 'register' ? 'welcome__tab--active' : ''}`}
              onClick={() => switchMode('register')}
            >
              Qeydiyyat
            </button>
          </div>

          <form className="welcome__form" onSubmit={submit}>
            {mode === 'register' && (
              <div className="welcome__field">
                <label htmlFor="welcome-username">İstifadəçi adı</label>
                <input
                  id="welcome-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(sanitizeUsername(e.target.value))}
                  placeholder="məs: aysel_reads"
                  className="input"
                  autoComplete="username"
                  maxLength={LIMITS.username}
                />
              </div>
            )}

            {mode === 'register' && (
              <fieldset className="welcome__field welcome__gender">
                <legend>Cinsiyyət</legend>
                <div className="welcome__gender-options">
                  {genderOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`welcome__gender-btn ${gender === option.value ? 'welcome__gender-btn--active' : ''}`}
                      onClick={() => setGender(option.value)}
                      aria-pressed={gender === option.value}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="welcome__field">
              <label htmlFor="welcome-email">Email</label>
              <input
                id="welcome-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="input"
                autoComplete="email"
                maxLength={LIMITS.email}
              />
            </div>

            <div className="welcome__field">
              <label htmlFor="welcome-password">Parol</label>
              <input
                id="welcome-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                maxLength={LIMITS.password}
              />
            </div>

            {mode === 'register' && (
              <div className="welcome__consent">
                <input
                  id="welcome-register-consent"
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
                  <label htmlFor="welcome-register-consent" className="welcome__consent-label">
                    oxudum, qəbul edirəm.
                  </label>
                </span>
              </div>
            )}

            {error && (
              <p className="welcome__error" role="alert" aria-live="assertive">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn btn--primary welcome__submit"
              disabled={mode === 'register' && (!acceptedTerms || !gender)}
            >
              {mode === 'login' ? 'Daxil ol' : 'Hesab yarat'}
            </button>
          </form>

          <p className="auth-modal__switch">
            Kitab mağazanız var?{' '}
            <button
              type="button"
              className="welcome__link"
              onClick={() => navigateGuestPath('/register/store')}
            >
              Mağaza qeydiyyatı
            </button>
          </p>

          <p className="welcome__note">
            Demo rejimi — backend qoşulduqdan sonra real autentifikasiya aktiv olacaq.
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
