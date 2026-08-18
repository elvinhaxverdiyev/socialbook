import { useState } from 'react';
import { User } from 'lucide-react';
import PostCard from '../components/posts/PostCard';
import Composer from '../components/posts/Composer';
import EmptyState from '../components/ui/EmptyState';
import BookShelf from '../components/profile/BookShelf';
import UserListModal from '../components/profile/UserListModal';
import ProfileEditModal from '../components/profile/ProfileEditModal';
import ProfileHero from '../components/profile/ProfileHero';
import { useApp } from '../context/AppContext';
import { getDisplayUsername } from '../data/mockData';

export default function ProfilePage() {
  const {
    currentUser,
    updateCurrentProfile,
    profilePosts,
    followingUsers,
    followerUsers,
    shelfBooks,
    addPost,
    isLoggedIn,
  } = useApp();
  const [openList, setOpenList] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const username = getDisplayUsername(currentUser.handle);

  return (
    <div className="profile-page">
      <ProfileHero
        variant="own"
        username={username}
        handle={currentUser.handle}
        bio={currentUser.bio}
        initials={currentUser.initials}
        avatarUrl={currentUser.avatarUrl}
        avatarPresetId={currentUser.avatarPresetId}
        bannerUrl={currentUser.bannerUrl}
        followingCount={followingUsers.length}
        followersCount={followerUsers.length}
        postsCount={profilePosts.length}
        shelfCount={shelfBooks.length}
        onEdit={() => setEditOpen(true)}
        onOpenFollowing={() => setOpenList('following')}
        onOpenFollowers={() => setOpenList('followers')}
      />

      <BookShelf />

      <section className="profile-feed">
        <div className="profile-feed__head">
          <h2 className="profile-feed__title">Paylaşımlar</h2>
          <span className="profile-feed__count">{profilePosts.length}</span>
        </div>

        {isLoggedIn && <Composer onSubmit={addPost} />}

        {profilePosts.length === 0 ? (
          <EmptyState text="Hələ paylaşımın yoxdur." icon={User} />
        ) : (
          profilePosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </section>

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
    </div>
  );
}
