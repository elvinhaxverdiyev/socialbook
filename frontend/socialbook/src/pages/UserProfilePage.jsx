import { useMemo, useState } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import PostCard from '../components/posts/PostCard';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import BookShelf from '../components/profile/BookShelf';
import UserListModal from '../components/profile/UserListModal';
import { useApp } from '../context/AppContext';
import { getUserProfile } from '../data/mockData';

export default function UserProfilePage() {
  const {
    viewedUserHandle,
    closeUserProfile,
    posts,
    following,
    toggleFollow,
  } = useApp();
  const [openList, setOpenList] = useState(null);

  const profile = viewedUserHandle ? getUserProfile(viewedUserHandle) : null;

  const userPosts = useMemo(
    () => posts.filter((post) => post.user?.handle === viewedUserHandle),
    [posts, viewedUserHandle],
  );

  if (!profile) {
    return (
      <>
        <button type="button" className="user-profile-back" onClick={closeUserProfile}>
          <ArrowLeft size={16} />
          Geri
        </button>
        <EmptyState text="Profil tapılmadı." icon={User} />
      </>
    );
  }

  const isFollowing = following.has(profile.handle);
  const firstName = profile.name.split(' ')[0];

  return (
    <>
      <button type="button" className="user-profile-back" onClick={closeUserProfile}>
        <ArrowLeft size={16} />
        Geri
      </button>

      <section className="profile-header profile-header--other">
        <Avatar initials={profile.initials} size={72} className="profile-header__avatar" />

        <div className="profile-header__info">
          <h1 className="profile-header__name font-display">{profile.name}</h1>
          <p className="profile-header__handle">{profile.handle}</p>

          {profile.bio && <p className="profile-header__bio">{profile.bio}</p>}

          <p className="profile-header__stats">
            <button
              type="button"
              className="profile-header__stat-btn"
              onClick={() => setOpenList('following')}
            >
              <strong>{profile.followingList.length}</strong> izlədiyi
            </button>
            <span className="profile-header__dot">·</span>
            <button
              type="button"
              className="profile-header__stat-btn"
              onClick={() => setOpenList('followers')}
            >
              <strong>{profile.followersList.length}</strong> izləyən
            </button>
          </p>
        </div>

        <button
          type="button"
          className={`btn profile-header__follow ${isFollowing ? 'btn--ghost' : 'btn--primary'}`}
          onClick={() => toggleFollow(profile.handle, profile)}
        >
          {isFollowing ? 'İzlənilir' : 'İzlə'}
        </button>
      </section>

      <BookShelf books={profile.shelfBooks} readOnly />

      <h2 className="profile-feed__title">{firstName} postları</h2>

      {userPosts.length === 0 && (
        <EmptyState text="Hələ paylaşım yoxdur." icon={User} />
      )}

      {userPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {openList === 'following' && (
        <UserListModal
          title="İzlədiyi"
          users={profile.followingList}
          onClose={() => setOpenList(null)}
        />
      )}

      {openList === 'followers' && (
        <UserListModal
          title="İzləyənlər"
          users={profile.followersList}
          onClose={() => setOpenList(null)}
        />
      )}
    </>
  );
}
