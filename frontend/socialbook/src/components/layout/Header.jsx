import { LogIn, Menu } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Header({ onMenuClick, menuOpen = false }) {
  const { goHome, isLoggedIn, openAuthModal } = useApp();

  return (
    <header className="header">
      <div className="header__inner">
        <button
          type="button"
          className="header__menu"
          onClick={onMenuClick}
          aria-label="Menyu"
          aria-expanded={menuOpen}
          aria-controls="app-sidebar"
        >
          <Menu size={20} />
        </button>

        <button
          type="button"
          className="header__logo font-display"
          onClick={goHome}
          aria-label="Rəf — əsas səhifə"
        >
          Rəf
        </button>

        <div className="header__actions">
          {!isLoggedIn && (
            <button
              type="button"
              className="btn btn--primary header__login"
              onClick={() => openAuthModal('login')}
            >
              <LogIn size={15} aria-hidden="true" />
              <span>Daxil ol</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
