export default function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-live="polite" aria-busy="true">
      <span className="page-loader__spinner" aria-hidden="true" />
      <span className="visually-hidden">Yüklənir…</span>
    </div>
  );
}
