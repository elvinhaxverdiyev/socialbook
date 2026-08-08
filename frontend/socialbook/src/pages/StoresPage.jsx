import { MapPin, Star, BadgeCheck, Clock } from 'lucide-react';
import { stores } from '../data/mockData';

export default function StoresPage() {
  return (
    <>
      <section className="page-intro">
        <h1 className="page-intro__title font-display">Mağazalar</h1>
        <p className="page-intro__text">
          Bakıdakı kitab mağazaları burada elan paylaşır. Gələcəkdə birbaşa sifariş və çatdırılma əlavə olunacaq.
        </p>
      </section>

      <div className="stores-grid">
        {stores.map((store) => (
          <article key={store.id} className="store-card">
            <div className="store-card__icon">
              <MapPin size={20} color="var(--paper-raised)" />
            </div>

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

            <button type="button" className="btn btn--primary btn--sm">
              Elanlara bax
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
