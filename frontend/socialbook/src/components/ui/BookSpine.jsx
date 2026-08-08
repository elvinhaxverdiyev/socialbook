import { sanitizeHexColor } from '../../utils/security';

export default function BookSpine({ color, width = 56, height = 78 }) {
  const safeColor = sanitizeHexColor(color);

  return (
    <div
      className="book-spine"
      style={{ width, height, background: safeColor }}
      aria-hidden="true"
    />
  );
}
