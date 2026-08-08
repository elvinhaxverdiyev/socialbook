import { Star } from 'lucide-react';

export default function AdPanel() {
  return (
    <div className="ad-panel">
      <div className="ad-panel__icon">
        <Star size={22} color="var(--paper-raised)" />
      </div>
      <div>
        <p className="ad-panel__label">Reklam</p>
        <p className="ad-panel__title">Kitab Klubu — payız kolleksiyası 20% endirimlə</p>
      </div>
    </div>
  );
}
