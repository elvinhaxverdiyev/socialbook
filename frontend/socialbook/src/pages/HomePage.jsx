import PostCard from '../components/posts/PostCard';
import Composer from '../components/posts/Composer';
import AdPanel from '../components/posts/AdPanel';
import EmptyState from '../components/ui/EmptyState';
import { useApp } from '../context/AppContext';
import { BookOpen, Search } from 'lucide-react';

export default function HomePage() {
  const { homeFeed, addPost, isLoggedIn, query, setQuery } = useApp();
  const hasQuery = Boolean(query.trim());

  return (
    <>
      {isLoggedIn && <Composer onSubmit={addPost} />}

      {homeFeed.length === 0 && (
        <EmptyState
          text={
            hasQuery
              ? 'Bu axtarışa uyğun paylaşım tapılmadı.'
              : 'Hələ paylaşım yoxdur. İlk postu sən yaz.'
          }
          icon={hasQuery ? Search : BookOpen}
          action={
            hasQuery ? (
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setQuery('')}>
                Axtarışı təmizlə
              </button>
            ) : null
          }
        />
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
