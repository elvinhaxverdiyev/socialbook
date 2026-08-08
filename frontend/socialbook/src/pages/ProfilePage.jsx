import { useState } from 'react';
import { Pencil, User } from 'lucide-react';
import PostCard from '../components/posts/PostCard';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import BookShelf from '../components/profile/BookShelf';
import UserListModal from '../components/profile/UserListModal';
import ProfileEditModal from '../components/profile/ProfileEditModal';
import { useApp } from '../context/AppContext';
import { getDisplayUsername } from '../data/mockData';

export default function ProfilePage() {
  const {
    currentUser,
    updateCurrentProfile,
    profilePosts,
    followingUsers,
    followerUsers,
  } = useApp();
  const [openList, setOpenList] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const username = getDisplayUsername(currentUser.handle);

  return (
    <>
      <section className="profile-header profile-header--own">
        <button
          type="button"
          className="profile-header__edit"
          onClick={() => setEditOpen(true)}
          aria-label="Profili redaktə et"
        >
          <Pencil size={16} />
        </button>

        <Avatar
          initials={currentUser.initials}
          src={currentUser.avatarUrl}
          size={72}
          className="profile-header__avatar"
        />

        <div className="profile-header__info">
          <h1 className="profile-header__username font-display">{username}</h1>

          {currentUser.bio && (
            <p className="profile-header__bio">{currentUser.bio}</p>
          )}

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

      {editOpen && (
        <ProfileEditModal
          user={currentUser}
          onSave={(updates) => {
            updateCurrentProfile(updates);
            setEditOpen(false);
          }}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
}
