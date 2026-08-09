export default function EmptyState({ text, icon: Icon, action }) {
  return (
    <div className="empty-state" role="status">
      {Icon && (
        <span className="empty-state__icon" aria-hidden="true">
          <Icon size={32} strokeWidth={1.5} />
        </span>
      )}
      <p className="empty-state__text">{text}</p>
      {action}
    </div>
  );
}
