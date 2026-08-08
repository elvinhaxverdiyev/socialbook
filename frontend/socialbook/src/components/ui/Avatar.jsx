import { sanitizeInitials } from '../../utils/security';

export default function Avatar({ initials, src, size = 40, className = '' }) {
  const safeInitials = sanitizeInitials(initials);

  if (src) {
    return (
      <img
        src={src}
        alt=""
        className={`avatar avatar--image ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`avatar ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-hidden="true"
    >
      {safeInitials}
    </div>
  );
}
