import { useState } from 'react';
import { BookOpen, Store, Users, MessageCircle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import heroIllustration from '../assets/welcome-hero.svg';
import { isValidEmail, LIMITS } from '../utils/security';

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

export default function WelcomePage() {
  const { setIsLoggedIn } = useApp();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

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
      if (password.length < 6) {
        setError('Parol ən azı 6 simvol olmalıdır.');
        return;
      }
    } else if (!email.trim() || !password.trim()) {
      setError('Email və parol daxil edin.');
      return;
    } else if (!isValidEmail(email)) {
      setError('Düzgün email daxil edin.');
      return;
    }

    setPassword('');
    setIsLoggedIn(true);
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
            <Sparkles size={14} />
            Kitabsevərlər üçün yeni icma
          </div>

          <p className="welcome__logo font-display">Rəf</p>
          <h1 className="welcome__title font-display">
            Oxu. Paylaş.<br />Kəşf et.
          </h1>
          <p className="welcome__subtitle">
            Mağazalar və oxucular bir yerdə — kitab alış-verişi, sosial feed
            və satış elanları tək platformada.
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
                ? 'Rəf-də icmaya qoşul'
                : 'Bir neçə addımda qeydiyyatdan keç'}
            </p>
          </div>

          <div className="welcome__tabs">
            <button
              type="button"
              className={`welcome__tab ${mode === 'login' ? 'welcome__tab--active' : ''}`}
              onClick={() => { setMode('login'); setError(''); }}
            >
              Daxil ol
            </button>
            <button
              type="button"
              className={`welcome__tab ${mode === 'register' ? 'welcome__tab--active' : ''}`}
              onClick={() => { setMode('register'); setError(''); }}
            >
              Qeydiyyat
            </button>
          </div>

          <form className="welcome__form" onSubmit={submit}>
            {mode === 'register' && (
              <div className="welcome__field">
                <label htmlFor="username">İstifadəçi adı</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="məs: aysel_reads"
                  className="input"
                  autoComplete="username"
                  maxLength={LIMITS.username}
                />
              </div>
            )}

            <div className="welcome__field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
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
              <label htmlFor="password">Parol</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                maxLength={LIMITS.password}
              />
            </div>

            {error && <p className="welcome__error">{error}</p>}

            <button type="submit" className="btn btn--primary welcome__submit">
              {mode === 'login' ? 'Daxil ol' : 'Hesab yarat'}
            </button>
          </form>

          <p className="welcome__note">
            Demo rejimi — backend qoşulduqdan sonra real autentifikasiya aktiv olacaq.
          </p>
        </div>
      </div>
    </div>
  );
}
