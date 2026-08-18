import { sanitizeImageUrl, sanitizeInitials } from '../../utils/security';
import { findAvatarPreset, resolveAvatarPresetUrl } from '../../data/avatarPresets';

export default function Avatar({ initials, src, presetId, size = 40, className = '', alt, name }) {
  const safeInitials = sanitizeInitials(initials);
  const presetSrc = resolveAvatarPresetUrl(presetId);
  const knownPresetSrc = !presetSrc && src ? findAvatarPreset(src)?.src : null;
  const safeSrc = presetSrc ?? knownPresetSrc ?? sanitizeImageUrl(src);
  const label = alt ?? (name ? `${name} avatarı` : undefined);

  if (safeSrc) {
    return (
      <img
        src={safeSrc}
        alt={label || ''}
        className={`avatar avatar--image ${className}`}
        style={{ width: size, height: size }}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      className={`avatar ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {safeInitials}
    </div>
  );
}
