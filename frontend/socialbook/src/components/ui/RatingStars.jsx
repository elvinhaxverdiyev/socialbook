import { Star } from 'lucide-react';

export default function RatingStars({ rating, size = 14, interactive = false, onChange }) {
  return (
    <div className="rating-stars">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < rating;
        const star = (
          <Star
            key={i}
            size={size}
            fill={filled ? 'var(--gold)' : 'none'}
            color="var(--gold)"
            strokeWidth={1.5}
          />
        );

        if (interactive) {
          return (
            <button key={i} type="button" className="rating-stars__btn" onClick={() => onChange(i + 1)}>
              {star}
            </button>
          );
        }

        return star;
      })}
    </div>
  );
}
