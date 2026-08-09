import { useMemo, useState } from 'react';
import { User } from 'lucide-react';
import PostCard from '../components/posts/PostCard';
import EmptyState from '../components/ui/EmptyState';
import BookShelf from '../components/profile/BookShelf';
import UserListModal from '../components/profile/UserListModal';
import ProfileHero from '../components/profile/ProfileHero';
import { useApp } from '../context/AppContext';
import { getUserProfile, getDisplayUsername } from '../data/mockData';

export default function UserProfilePage() {
  const {
    viewedUserHandle,
    posts,
    following,
    toggleFollow,
    goHome,
  } = useApp();
  const [openList, setOpenList] = useState(null);

  const profile = viewedUserHandle ? getUserProfile(viewedUserHandle) : null;

  const userPosts = useMemo(
    () => posts.filter((post) => post.user?.handle === viewedUserHandle),
    [posts, viewedUserHandle],
  );

  if (!profile) {
    return (
      <div className="profile-page">
        <EmptyState
          text="Profil tapılmadı."
          icon={User}
          action={
            <button type="button" className="btn btn--primary btn--sm" onClick={goHome}>
              Əsas səhifə
            </button>
          }
        />
      </div>
    );
  }

  const isFollowing = following.has(profile.handle);
  const username = getDisplayUsername(profile.handle);
  const shelfCount = profile.shelfBooks?.length ?? 0;

  return (
    <div className="profile-page">
      <ProfileHero
        variant="other"
        username={username}
        handle={profile.handle}
        bio={profile.bio}
        initials={profile.initials}
        avatarUrl={profile.avatarUrl}
        bannerUrl={profile.bannerUrl}
        followingCount={profile.followingList.length}
        followersCount={profile.followersList.length}
        postsCount={userPosts.length}
        shelfCount={shelfCount}
        isFollowing={isFollowing}
        onFollow={() => toggleFollow(profile.handle, profile)}
        onOpenFollowing={() => setOpenList('following')}
        onOpenFollowers={() => setOpenList('followers')}
      />

      <BookShelf books={profile.shelfBooks} readOnly ownerHandle={profile.handle} />

      <section className="profile-feed">
        <div className="profile-feed__head">
          <h2 className="profile-feed__title">{username} — paylaşımlar</h2>
          <span className="profile-feed__count">{userPosts.length}</span>
        </div>

        {userPosts.length === 0 ? (
          <EmptyState text="Hələ paylaşım yoxdur." icon={User} />
        ) : (
          userPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </section>

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
    </div>
  );
}
