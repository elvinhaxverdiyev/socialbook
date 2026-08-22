import Avatar from '../ui/Avatar';
import { useApp } from '../../context/AppContext';
import { getDisplayUsername } from '../../data/mockData';

export default function SuggestedPeople({ users, subtitle }) {
  const { following, toggleFollow, openUserProfile } = useApp();

  if (!users?.length) return null;

  return (
    <section className="profile-suggestions" aria-label="İzləmə təklifləri">
      <div className="profile-suggestions__head">
        <h2 className="profile-suggestions__title">Sənin üçün təkliflər</h2>
        {subtitle && <p className="profile-suggestions__sub">{subtitle}</p>}
      </div>

      <div className="profile-suggestions__track">
        <ul className="profile-suggestions__list">
          {users.map((person) => {
            const isFollowing = following.has(person.handle);

            return (
              <li key={person.handle} className="profile-suggestions__card">
                <button
                  type="button"
                  className="profile-suggestions__profile"
                  onClick={() => openUserProfile(person.handle)}
                >
                  <Avatar
                    initials={person.initials}
                    src={person.avatarUrl}
                    size={56}
                    name={getDisplayUsername(person.handle)}
                  />
                  <span className="profile-suggestions__username">
                    {getDisplayUsername(person.handle)}
                  </span>
                </button>

                <button
                  type="button"
                  className={`btn btn--sm profile-suggestions__follow ${isFollowing ? 'btn--follow-active' : 'btn--primary'}`}
                  onClick={() => toggleFollow(person.handle, person)}
                  aria-pressed={isFollowing}
                >
                  {isFollowing ? 'İzlənir' : 'İzlə'}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
