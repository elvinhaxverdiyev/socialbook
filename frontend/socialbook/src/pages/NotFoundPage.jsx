import { BookOpen } from '../icons';
import { useApp } from '../context/AppContext';

export default function NotFoundPage() {
  const { goHome } = useApp();

  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <div className="not-found__visual" aria-hidden="true">
        <span className="not-found__code">404</span>
        <span className="not-found__icon">
          <BookOpen size={44} strokeWidth={1.5} />
        </span>
      </div>

      <h1 id="not-found-title" className="not-found__title font-display">
        Səhifə tapılmadı
      </h1>

      <p className="not-found__text">
        Axtardığınız ünvan mövcud deyil, silinib və ya köçürülüb. Linki yoxlayın və ya ana
        səhifəyə qayıdın.
      </p>

      <div className="not-found__actions">
        <button type="button" className="btn btn--primary" onClick={goHome}>
          Ana səhifəyə qayıt
        </button>
      </div>
    </section>
  );
}
