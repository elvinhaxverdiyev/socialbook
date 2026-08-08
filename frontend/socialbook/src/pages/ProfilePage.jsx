import { useState } from 'react';
import PostCard from '../components/posts/PostCard';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import BookShelf from '../components/profile/BookShelf';
import UserListModal from '../components/profile/UserListModal';
import { useApp } from '../context/AppContext';
import { User } from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, profilePosts, followingUsers, followerUsers } = useApp();
  const [openList, setOpenList] = useState(null);

  return (
    <>
      <section className="profile-header">
        <Avatar initials={currentUser.initials} size={72} className="profile-header__avatar" />

        <div className="profile-header__info">
          <h1 className="profile-header__name font-display">{currentUser.name}</h1>
          <p className="profile-header__handle">{currentUser.handle}</p>

          <p className="profile-header__stats">
            <button
              type="button"
              className="profile-header__stat-btn"
              onClick={() => setOpenList('following')}
            >
              <strong>{followingUsers.length}</strong> izlədiyim
            </button>
            <span className="profile-header__dot">·</span>
            <button
              type="button"
              className="profile-header__stat-btn"
              onClick={() => setOpenList('followers')}
            >
              <strong>{followerUsers.length}</strong> izləyən
            </button>
          </p>
        </div>
      </section>

      <BookShelf />

      <h2 className="profile-feed__title">Mənim postlarım</h2>

      {profilePosts.length === 0 && (
        <EmptyState text="Hələ paylaşımın yoxdur." icon={User} />
      )}

      {profilePosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {openList === 'following' && (
        <UserListModal
          title="İzlədiyim"
          users={followingUsers}
          onClose={() => setOpenList(null)}
        />
      )}

      {openList === 'followers' && (
        <UserListModal
          title="İzləyənlər"
          users={followerUsers}
          onClose={() => setOpenList(null)}
        />
      )}
    </>
  );
}
