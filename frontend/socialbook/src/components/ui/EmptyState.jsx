export default function EmptyState({ text, icon: Icon }) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={32} strokeWidth={1.5} />}
      <p>{text}</p>
    </div>
  );
}
