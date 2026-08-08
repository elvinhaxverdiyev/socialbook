import { navItems } from '../../data/constants';
import { notifications } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const { activePage, setActivePage } = useApp();

  return (
    <aside className="sidebar">
      <nav className="sidebar__nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.key;

          return (
            <button
              key={item.key}
              type="button"
              className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
              onClick={() => setActivePage(item.key)}
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
  );
}
