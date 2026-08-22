import { Star } from '../../icons';

export default function RatingStars({ rating = 0, size = 14, interactive = false, onChange, label }) {
  const rounded = Math.round(Number(rating) || 0);
  const groupLabel = label || `${rounded} ulduzdan 5`;

  return (
    <div
      className="rating-stars"
      role={interactive ? 'group' : 'img'}
      aria-label={groupLabel}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const value = i + 1;
        const filled = i < rounded;
        const star = (
          <Star
            size={size}
            fill={filled ? 'var(--gold)' : 'none'}
            color="var(--gold)"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        );

        if (interactive) {
          return (
            <button
              key={value}
              type="button"
              className="rating-stars__btn"
              onClick={() => onChange?.(value)}
              aria-label={`${value} ulduz`}
              aria-pressed={rounded === value}
            >
              {star}
            </button>
          );
        }

        return (
          <span key={value} aria-hidden="true">
            {star}
          </span>
        );
      })}
    </div>
  );
}
