import { X } from 'lucide-react';
import { navItems } from '../../data/constants';
import { notifications } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export default function Sidebar({ open = false, onClose }) {
  const { activePage, setActivePage } = useApp();

  const go = (key) => {
    setActivePage(key);
    onClose?.();
  };

  return (
    <>
      {open && (
        <button
          type="button"
          className="sidebar__backdrop"
          onClick={onClose}
          aria-label="Menyunu bağla"
        />
      )}

      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
        <div className="sidebar__mobile-head">
          <p className="sidebar__mobile-title font-display">Menyu</p>
          <button
            type="button"
            className="sidebar__close"
            onClick={onClose}
            aria-label="Bağla"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar__nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;

            return (
              <button
                key={item.key}
                type="button"
                className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
                onClick={() => go(item.key)}
              >
                <Icon size={17} strokeWidth={1.8} />
                <span>{item.label}</span>
                {item.key === 'notifications' && (
                  <span className="sidebar__badge">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
