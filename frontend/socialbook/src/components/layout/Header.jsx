import { Search, Home, LogIn, Menu } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { useApp } from '../../context/AppContext';
import { LIMITS } from '../../utils/security';

export default function Header({ onMenuClick }) {
  const {
    query,
    setQuery,
    activePage,
    setActivePage,
    currentUser,
    closeUserProfile,
    isLoggedIn,
    openAuthModal,
  } = useApp();
  const onOwnProfile = activePage === 'profile';
  const onUserProfile = activePage === 'user-profile';

  const goHome = () => {
    if (onUserProfile) closeUserProfile();
    else setActivePage('home');
  };

  return (
    <header className="header">
      <div className="header__inner">
        <button
          type="button"
          className="header__menu"
          onClick={onMenuClick}
          aria-label="Menyu"
        >
          <Menu size={20} />
        </button>

        <button
          type="button"
          className="header__logo font-display"
          onClick={goHome}
        >
          Rəf
        </button>

        <div className="header__search">
          <Search size={15} className="header__search-icon" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kitab, müəllif və ya mağaza axtar"
            className="input input--search"
            maxLength={LIMITS.searchQuery}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="header__actions">
          {isLoggedIn ? (
            onOwnProfile || onUserProfile ? (
              <button
                type="button"
                className="header__profile header__profile--active"
                onClick={goHome}
              >
                <Home size={16} />
                <span>Əsas səhifə</span>
              </button>
            ) : (
              <button
                type="button"
                className="header__profile"
                onClick={() => setActivePage('profile')}
              >
                <Avatar initials={currentUser.initials} src={currentUser.avatarUrl} size={26} />
                <span>Profil</span>
              </button>
            )
          ) : (
            <button
              type="button"
              className="btn btn--primary header__login"
              onClick={() => openAuthModal('login')}
            >
              <LogIn size={15} />
              <span>Daxil ol</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
