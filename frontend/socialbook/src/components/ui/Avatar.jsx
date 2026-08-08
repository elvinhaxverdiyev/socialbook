import { sanitizeInitials } from '../../utils/security';

export default function Avatar({ initials, size = 40, className = '' }) {
  const safeInitials = sanitizeInitials(initials);

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
