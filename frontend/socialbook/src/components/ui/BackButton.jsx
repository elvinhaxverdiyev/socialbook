import { ArrowLeft } from '../../icons';
import { useApp } from '../../context/AppContext';

export default function BackButton({ className = '', label = 'Geri' }) {
  const { goBack, canGoBack } = useApp();

  if (!canGoBack) return null;

  return (
    <button
      type="button"
      className={`nav-back ${className}`.trim()}
      onClick={goBack}
      aria-label="Əvvəlki səhifəyə qayıt"
    >
      <span className="nav-back__icon" aria-hidden="true">
        <ArrowLeft size={18} strokeWidth={2} />
      </span>
      <span className="nav-back__label">{label}</span>
    </button>
  );
}
