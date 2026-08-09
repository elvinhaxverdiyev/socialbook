import { sanitizeInitials } from '../../utils/security';

export default function Avatar({ initials, src, size = 40, className = '', alt, name }) {
  const safeInitials = sanitizeInitials(initials);
  const label = alt ?? (name ? `${name} avatarı` : undefined);

  if (src) {
    return (
      <img
        src={src}
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
