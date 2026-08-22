import { Pencil, UserPlus, UserCheck, BookOpen, Library, MoreVertical } from '../../icons';
import Avatar from '../ui/Avatar';
import { DEFAULT_BANNER } from '../../data/media';
import { sanitizeImageUrl } from '../../utils/security';

export default function ProfileHero({
  variant = 'own',
  username,
  handle,
  bio,
  initials,
  avatarUrl,
  avatarPresetId,
  bannerUrl,
  followingCount = 0,
  followersCount = 0,
  postsCount = 0,
  shelfCount = 0,
  isFollowing = false,
  onEdit,
  onFollow,
  onOpenFollowing,
  onOpenFollowers,
  onOpenActions,
}) {
  const isOwn = variant === 'own';
  const cover = sanitizeImageUrl(bannerUrl) ?? DEFAULT_BANNER;

  return (
    <section className={`profile-hero ${isOwn ? 'profile-hero--own' : 'profile-hero--other'}`}>
      <div className="profile-hero__banner">
        <img
          src={cover}
          alt=""
          className="profile-hero__banner-img"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />
        <div className="profile-hero__banner-shade" aria-hidden="true" />
      </div>

      <div className="profile-hero__body">
        <div className="profile-hero__top">
          <div className="profile-hero__avatar-wrap">
            <Avatar
              initials={initials}
              src={avatarUrl}
              presetId={avatarPresetId}
              size={96}
              className="profile-hero__avatar"
              name={username}
            />
          </div>

          <div className="profile-hero__main">
            <div className="profile-hero__identity">
              <h1 className="profile-hero__username font-display">{username}</h1>
              {handle && <p className="profile-hero__handle">{handle}</p>}
            </div>

            <div className="profile-hero__actions">
              {isOwn ? (
                <button type="button" className="btn btn--ghost profile-hero__edit" onClick={onEdit}>
                  <Pencil size={15} aria-hidden="true" />
                  Profili redaktə et
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className={`btn profile-hero__follow ${isFollowing ? 'btn--ghost' : 'btn--primary'}`}
                    onClick={onFollow}
                    aria-pressed={isFollowing}
                  >
                    {isFollowing ? (
                      <UserCheck size={15} aria-hidden="true" />
                    ) : (
                      <UserPlus size={15} aria-hidden="true" />
                    )}
                    {isFollowing ? 'İzlənilir' : 'İzlə'}
                  </button>
                  <button
                    type="button"
                    className="profile-hero__menu"
                    onClick={onOpenActions}
                    aria-label="Profil seçimləri"
                  >
                    <MoreVertical size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {bio && <p className="profile-hero__bio">{bio}</p>}

        <div className="profile-hero__stats">
          <button type="button" className="profile-hero__stat" onClick={onOpenFollowing}>
            <strong>{followingCount}</strong>
            <span>izlədiyi</span>
          </button>
          <button type="button" className="profile-hero__stat" onClick={onOpenFollowers}>
            <strong>{followersCount}</strong>
            <span>izləyən</span>
          </button>
          <div className="profile-hero__stat profile-hero__stat--static">
            <strong>{postsCount}</strong>
            <span className="profile-hero__stat-with-icon">
              <BookOpen size={12} aria-hidden="true" />
              post
            </span>
          </div>
          <div className="profile-hero__stat profile-hero__stat--static">
            <strong>{shelfCount}</strong>
            <span className="profile-hero__stat-with-icon">
              <Library size={12} aria-hidden="true" />
              rəf
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
