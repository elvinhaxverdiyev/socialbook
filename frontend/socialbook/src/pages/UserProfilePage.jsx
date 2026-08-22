import { useMemo, useState } from 'react';
import { User } from '../icons';
import PostCard from '../components/posts/PostCard';
import EmptyState from '../components/ui/EmptyState';
import BookShelf from '../components/profile/BookShelf';
import SuggestedPeople from '../components/profile/SuggestedPeople';
import UserListModal from '../components/profile/UserListModal';
import UserProfileActionsModal from '../components/profile/UserProfileActionsModal';
import ProfileHero from '../components/profile/ProfileHero';
import { useApp } from '../context/AppContext';
import { getUserProfile, getDisplayUsername, suggestionPool } from '../data/mockData';

export default function UserProfilePage() {
  const {
    viewedUserHandle,
    posts,
    following,
    toggleFollow,
    goHome,
    blockedUsers,
    isBlockedHandle,
    blockUser,
    reportUser,
    currentUser,
  } = useApp();
  const [openList, setOpenList] = useState(null);
  const [actionsOpen, setActionsOpen] = useState(false);

  const profile = viewedUserHandle ? getUserProfile(viewedUserHandle) : null;

  const userPosts = useMemo(
    () => posts.filter((post) => post.user?.handle === viewedUserHandle),
    [posts, viewedUserHandle],
  );

  const visibleFollowing = useMemo(
    () => profile?.followingList.filter((user) => !isBlockedHandle(user.handle)) ?? [],
    [profile, isBlockedHandle],
  );

  const visibleFollowers = useMemo(
    () => profile?.followersList.filter((user) => !isBlockedHandle(user.handle)) ?? [],
    [profile, isBlockedHandle],
  );

  const suggestedPeople = useMemo(() => {
    if (!profile) return [];

    const excluded = new Set([profile.handle, currentUser.handle, ...following]);
    const seen = new Set();
    const picked = [];

    const tryAdd = (user) => {
      if (!user?.handle || excluded.has(user.handle) || seen.has(user.handle)) return;
      if (isBlockedHandle(user.handle)) return;
      seen.add(user.handle);
      picked.push(user);
    };

    [...visibleFollowers, ...visibleFollowing].forEach(tryAdd);

    for (const person of suggestionPool) {
      if (picked.length >= 5) break;
      tryAdd(person);
    }

    return picked.slice(0, 5);
  }, [profile, visibleFollowing, visibleFollowers, following, currentUser.handle, isBlockedHandle]);

  if (!profile || isBlockedHandle(viewedUserHandle)) {
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
  const isBlocked = blockedUsers.some((user) => user.handle === profile.handle);
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
        followingCount={visibleFollowing.length}
        followersCount={visibleFollowers.length}
        postsCount={userPosts.length}
        shelfCount={shelfCount}
        isFollowing={isFollowing}
        onFollow={() => toggleFollow(profile.handle, profile)}
        onOpenFollowing={() => setOpenList('following')}
        onOpenFollowers={() => setOpenList('followers')}
        onOpenActions={() => setActionsOpen(true)}
      />

      <BookShelf books={profile.shelfBooks} readOnly ownerHandle={profile.handle} />

      <SuggestedPeople
        users={suggestedPeople}
        subtitle="Oxucular və yazarlar"
      />

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
          users={visibleFollowing}
          onClose={() => setOpenList(null)}
        />
      )}

      {openList === 'followers' && (
        <UserListModal
          title="İzləyənlər"
          users={visibleFollowers}
          onClose={() => setOpenList(null)}
        />
      )}

      {actionsOpen && (
        <UserProfileActionsModal
          user={profile}
          isBlocked={isBlocked}
          onBlock={() => blockUser(profile)}
          onReport={(reason) => reportUser(profile, reason)}
          onClose={() => setActionsOpen(false)}
        />
      )}
    </div>
  );
}
