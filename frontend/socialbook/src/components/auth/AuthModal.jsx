import { useCallback, useEffect, useState } from 'react';
import { X } from '../../icons';
import { useApp } from '../../context/AppContext';
import { isValidEmail, isValidPassword, isValidUsername, LIMITS, sanitizeUsername } from '../../utils/security';
import LegalModal from '../ui/LegalModal';
import { termsContent, communityRulesContent } from '../../data/legal';
import { genderOptions } from '../../data/constants';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';
import useEscapeKey from '../../hooks/useEscapeKey';
import useFocusTrap from '../../hooks/useFocusTrap';

export default function AuthModal() {
  const { authModal, closeAuthModal, login, register } = useApp();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [legalModal, setLegalModal] = useState(null);
  const [error, setError] = useState('');

  const isOpen = authModal.open;
  const cardRef = useFocusTrap(isOpen && !legalModal);
  const handleClose = useCallback(() => {
    if (legalModal) {
      setLegalModal(null);
      return;
    }
    closeAuthModal();
  }, [closeAuthModal, legalModal]);

  useBodyScrollLock(isOpen);
  useEscapeKey(handleClose, isOpen);

  useEffect(() => {
    if (!isOpen) return;
    setMode(authModal.mode === 'register' ? 'register' : 'login');
    setError('');
    setPassword('');
    setAcceptedTerms(false);
    setGender('');
    setLegalModal(null);
  }, [isOpen, authModal.mode]);

  if (!isOpen) return null;

  const switchMode = (next) => {
    setMode(next);
    setError('');
    if (next === 'login') {
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
      if (password.length < 6) {
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
    <div className="auth-modal" role="presentation">
      <button type="button" className="auth-modal__backdrop" onClick={handleClose} aria-label="Bağla" />

      <div
        ref={cardRef}
        className="auth-modal__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <button type="button" className="auth-modal__close" onClick={handleClose} aria-label="Bağla">
          <X size={18} />
        </button>

        <div className="welcome__panel-header">
          <p id="auth-modal-title" className="welcome__panel-title font-display">
            {mode === 'login' ? 'Daxil ol' : 'Qeydiyyat'}
          </p>
          <p className="welcome__panel-sub">
            {authModal.reason
              || (mode === 'login'
                ? 'Paylaşım və digər əməliyyatlar üçün hesabına daxil ol'
                : 'Bir neçə addımda qeydiyyatdan keç')}
          </p>
        </div>

        <form className="welcome__form" onSubmit={submit}>
          {mode === 'register' && (
            <div className="welcome__field">
              <label htmlFor="auth-username">İstifadəçi adı</label>
              <input
                id="auth-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(sanitizeUsername(e.target.value))}
                placeholder="məs: aysel_reads"
                className="input"
                autoComplete="username"
                maxLength={LIMITS.username}
                data-autofocus
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
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="input"
              autoComplete="email"
              maxLength={LIMITS.email}
              data-autofocus={mode === 'login' ? true : undefined}
            />
          </div>

          <div className="welcome__field">
            <label htmlFor="auth-password">Parol</label>
            <input
              id="auth-password"
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
                id="auth-register-consent"
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
                <label htmlFor="auth-register-consent" className="welcome__consent-label">
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
          {mode === 'login' ? (
            <>
              Hesabınız yoxdursa{' '}
              <button type="button" className="welcome__link" onClick={() => switchMode('register')}>
                qeydiyyatdan keçin
              </button>
            </>
          ) : (
            <>
              Hesabınız var?{' '}
              <button type="button" className="welcome__link" onClick={() => switchMode('login')}>
                daxil olun
              </button>
            </>
          )}
        </p>

        <p className="welcome__note">
          Demo rejimi — backend qoşulduqdan sonra real autentifikasiya aktiv olacaq.
        </p>
      </div>

      {legalModal === 'terms' && (
        <LegalModal
          content={termsContent}
          onClose={() => setLegalModal(null)}
        />
      )}

      {legalModal === 'community' && (
        <LegalModal
          content={communityRulesContent}
          onClose={() => setLegalModal(null)}
        />
      )}
    </div>
  );
}
