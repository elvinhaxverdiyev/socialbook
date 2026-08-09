import { Star } from 'lucide-react';

export default function AdPanel() {
  return (
    <aside className="ad-panel" aria-label="Reklam">
      <div className="ad-panel__icon" aria-hidden="true">
        <Star size={22} color="var(--paper-raised)" />
      </div>
      <div>
        <p className="ad-panel__label">Reklam</p>
        <p className="ad-panel__title">Kitab Klubu — payız kolleksiyası 20% endirimlə</p>
      </div>
    </aside>
  );
}
