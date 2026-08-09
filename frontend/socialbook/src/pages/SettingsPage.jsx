import { useState } from 'react';
import {
  Ban,
  Info,
  FileText,
  LogOut,
  LogIn,
  Moon,
  Sun,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import { useApp } from '../context/AppContext';
import { aboutContent, termsContent } from '../data/mockData';

export default function SettingsPage() {
  const {
    blockedUsers,
    unblockUser,
    colorMode,
    setColorMode,
    logout,
    isLoggedIn,
    openAuthModal,
  } = useApp();

  const [view, setView] = useState('main');

  const handleLogout = () => {
    if (window.confirm('Hesabdan çıxmaq istədiyinizə əminsiniz? Qonaq kimi baxmağa davam edəcəksiniz.')) {
      logout();
    }
  };

  if (view === 'blocked') {
    return (
      <SettingsPanel title="Blokladıqlarım" onBack={() => setView('main')}>
        {blockedUsers.length === 0 ? (
          <EmptyState text="Blokladığınız istifadəçi yoxdur." icon={Ban} />
        ) : (
          <ul className="settings-list">
            {blockedUsers.map((user) => (
              <li key={user.id} className="settings-list__item settings-list__item--row">
                <Avatar initials={user.initials} size={36} />
                <div className="settings-list__info">
                  <p className="settings-list__label">{user.name}</p>
                  <p className="settings-list__sub">{user.handle}</p>
                </div>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => unblockUser(user.id)}
                >
                  Blokdan çıxar
                </button>
              </li>
            ))}
          </ul>
        )}
      </SettingsPanel>
    );
  }

  if (view === 'about') {
    return (
      <SettingsPanel title={aboutContent.title} onBack={() => setView('main')}>
        <div className="settings-text">
          {aboutContent.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </SettingsPanel>
    );
  }

  if (view === 'terms') {
    return (
      <SettingsPanel title={termsContent.title} onBack={() => setView('main')}>
        <div className="settings-text">
          {termsContent.sections.map((section) => (
            <section key={section.heading}>
              <h3>{section.heading}</h3>
              <p>{section.text}</p>
            </section>
          ))}
        </div>
      </SettingsPanel>
    );
  }

  return (
    <>
      <section className="page-intro">
        <h1 className="page-intro__title font-display">Parametrlər</h1>
      </section>

      <div className="settings-card">
        <ul className="settings-list">
          <li>
            <button type="button" className="settings-list__item" onClick={() => setView('blocked')}>
              <Ban size={18} />
              <span className="settings-list__label">Blokladıqlarım</span>
              <ChevronRight size={16} className="settings-list__arrow" />
            </button>
          </li>

          <li>
            <button type="button" className="settings-list__item" onClick={() => setView('about')}>
              <Info size={18} />
              <span className="settings-list__label">Haqqımızda</span>
              <ChevronRight size={16} className="settings-list__arrow" />
            </button>
          </li>

          <li>
            <button type="button" className="settings-list__item" onClick={() => setView('terms')}>
              <FileText size={18} />
              <span className="settings-list__label">İstifadə şərtləri</span>
              <ChevronRight size={16} className="settings-list__arrow" />
            </button>
          </li>

          <li className="settings-list__item settings-list__item--mode">
            <div className="settings-list__mode-label">
              {colorMode === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
              <span className="settings-list__label">Dark / Light mode</span>
            </div>
            <div className="mode-toggle">
              <button
                type="button"
                className={`mode-toggle__btn ${colorMode === 'light' ? 'mode-toggle__btn--active' : ''}`}
                onClick={() => setColorMode('light')}
              >
                Light
              </button>
              <button
                type="button"
                className={`mode-toggle__btn ${colorMode === 'dark' ? 'mode-toggle__btn--active' : ''}`}
                onClick={() => setColorMode('dark')}
              >
                Dark
              </button>
            </div>
          </li>
        </ul>

        {isLoggedIn ? (
          <button type="button" className="settings-logout" onClick={handleLogout}>
            <LogOut size={18} />
            Çıxış
          </button>
        ) : (
          <button
            type="button"
            className="settings-logout"
            onClick={() => openAuthModal('login', 'Hesabına daxil ol.')}
          >
            <LogIn size={18} />
            Daxil ol
          </button>
        )}
      </div>
    </>
  );
}

function SettingsPanel({ title, onBack, children }) {
  return (
    <>
      <button type="button" className="settings-back" onClick={onBack}>
        <ArrowLeft size={16} />
        Geri
      </button>

      <section className="page-intro">
        <h1 className="page-intro__title font-display">{title}</h1>
      </section>

      <div className="settings-card">{children}</div>
    </>
  );
}
