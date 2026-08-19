import { legalNavItems } from '../../data/constants';
import { useApp } from '../../context/AppContext';

export default function SiteFooter() {
  const { openSettings } = useApp();

  return (
    <footer className="site-footer">
      <nav className="site-footer__nav" aria-label="Platforma sənədləri">
        {legalNavItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className="site-footer__link"
            onClick={() => openSettings(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <p className="site-footer__copy">Kitabci.com — Oxu. Paylaş. Kəşf et.</p>
    </footer>
  );
}
