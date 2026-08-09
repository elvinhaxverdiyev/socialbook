export default function GenreChip({ genre, active = false, onClick, size = 'md' }) {
  const label = typeof genre === 'string' ? genre : genre?.label;
  const id = typeof genre === 'string' ? genre : genre?.id;

  if (onClick) {
    return (
      <button
        type="button"
        className={`genre-chip genre-chip--${size} ${active ? 'genre-chip--active' : ''}`}
        onClick={() => onClick(id)}
      >
        {label}
      </button>
    );
  }

  return (
    <span className={`genre-chip genre-chip--${size} genre-chip--static`}>
      {label}
    </span>
  );
}
