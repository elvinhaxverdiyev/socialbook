import PostCard from '../components/posts/PostCard';
import EmptyState from '../components/ui/EmptyState';
import { useApp } from '../context/AppContext';
import { Bookmark } from '../icons';

export default function SavedPage() {
  const { savedPosts } = useApp();

  return (
    <>
      <section className="page-intro">
        <h1 className="page-intro__title font-display">Saxlanılanlar</h1>
        <p className="page-intro__text">Sonra oxumaq üçün saxladığın paylaşımlar.</p>
      </section>

      {savedPosts.length === 0 && (
        <EmptyState text="Hələ heç bir paylaşımı saxlamamısan." icon={Bookmark} />
      )}

      {savedPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  );
}
