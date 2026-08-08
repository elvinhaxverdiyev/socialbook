import PostCard from '../components/posts/PostCard';
import Composer from '../components/posts/Composer';
import AdPanel from '../components/posts/AdPanel';
import EmptyState from '../components/ui/EmptyState';
import { useApp } from '../context/AppContext';
import { BookOpen } from 'lucide-react';

export default function HomePage() {
  const { homeFeed, addPost } = useApp();

  return (
    <>
      <Composer onSubmit={addPost} />

      {homeFeed.length === 0 && (
        <EmptyState text="Bu axtarışa uyğun paylaşım tapılmadı." icon={BookOpen} />
      )}

      {homeFeed.map((post, index) => (
        <div key={post.id}>
          <PostCard post={post} />
          {index === 0 && <AdPanel />}
        </div>
      ))}
    </>
  );
}
