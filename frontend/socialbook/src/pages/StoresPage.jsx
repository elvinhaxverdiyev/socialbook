import { MapPin, Star, BadgeCheck, Clock, Store, ChevronRight } from 'lucide-react';
import { stores } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { sanitizeHexColor } from '../utils/security';

export default function StoresPage() {
  const { openStore } = useApp();

  return (
    <>
      <section className="page-intro">
        <h1 className="page-intro__title font-display">Mağazalar</h1>
        <p className="page-intro__text">
          Bakıdakı kitab mağazaları burada elan paylaşır. Mağazaya keçib elanları izləyə bilərsən.
        </p>
      </section>

      <div className="stores-grid">
        {stores.map((store) => (
          <button
            key={store.id}
            type="button"
            className="store-card"
            onClick={() => openStore(store.id)}
          >
            <span
              className="store-card__icon"
              style={{ background: sanitizeHexColor(store.cover) }}
            >
              <Store size={20} color="var(--paper-raised)" />
            </span>

            <div className="store-card__body">
              <h2 className="store-card__name">
                {store.name}
                {store.verified && (
                  <BadgeCheck size={16} className="store-card__verified" aria-label="Təsdiqlənmiş" />
                )}
              </h2>

              <p className="store-card__location">
                <MapPin size={12} /> {store.location}
              </p>

              <p className="store-card__desc">{store.description}</p>

              <div className="store-card__meta">
                <span className="store-card__rating">
                  <Star size={13} fill="var(--gold)" color="var(--gold)" />
                  {store.rating}
                </span>
                <span>{store.booksCount} kitab</span>
                <span className="store-card__hours">
                  <Clock size={12} /> {store.hours}
                </span>
              </div>
            </div>

            <ChevronRight size={18} className="store-card__arrow" aria-hidden />
          </button>
        ))}
      </div>
    </>
  );
}
