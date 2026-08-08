import { TrendingUp, Store, Users, UserPlus } from 'lucide-react';
import Avatar from '../ui/Avatar';
import BookSpine from '../ui/BookSpine';
import { trendingBooks, stores } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export default function RightPanel() {
  const { visibleSuggestions, followSuggestion, openUserProfile } = useApp();

  return (
    <aside className="right-panel">
      <section className="panel-card">
        <h3 className="panel-card__title">
          <TrendingUp size={13} /> Trend kitablar
        </h3>
        {trendingBooks.map((book) => (
          <div key={book.title} className="panel-card__row">
            <BookSpine color={book.cover} width={32} height={46} />
            <div>
              <p className="panel-card__name">{book.title}</p>
              <p className="panel-card__sub">{book.author}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="panel-card">
        <h3 className="panel-card__title">
          <Store size={13} /> Aktiv mağazalar
        </h3>
        {stores.slice(0, 3).map((store) => (
          <div key={store.id} className="panel-card__row">
            <span className="panel-card__dot" />
            <div>
              <p className="panel-card__name">{store.name}</p>
              <p className="panel-card__sub">{store.location}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="panel-card">
        <h3 className="panel-card__title">
          <Users size={13} /> İnsanlar
        </h3>
        {visibleSuggestions.map((person, index) => (
            <div key={person.handle} className="panel-card__row panel-card__row--person">
              <button
                type="button"
                className="panel-card__person-link"
                onClick={() => openUserProfile(person.handle)}
              >
                <Avatar initials={person.initials} size={32} />
                <div className="panel-card__person-info">
                  <p className="panel-card__name">{person.name}</p>
                  <p className="panel-card__sub">{person.handle}</p>
                </div>
              </button>
              <button
                type="button"
                className="btn btn--icon-only btn--primary btn--xs"
                onClick={() => followSuggestion(person.handle, person, index)}
                title="İzlə"
              >
                <UserPlus size={14} />
              </button>
            </div>
        ))}
      </section>
    </aside>
  );
}
