import PostCard from '../components/posts/PostCard';
import EmptyState from '../components/ui/EmptyState';
import { useApp } from '../context/AppContext';
import { ShoppingBag } from 'lucide-react';

export default function MarketplacePage() {
  const { salePosts } = useApp();

  return (
    <>
      <section className="page-intro">
        <h1 className="page-intro__title font-display">Satış</h1>
        <p className="page-intro__text">
          Mağazalar və istifadəçilərin paylaşdığı kitab elanları. Tezliklə birbaşa alış da mümkün olacaq.
        </p>
      </section>

      {salePosts.length === 0 && (
        <EmptyState text="Hələ satış elanı yoxdur." icon={ShoppingBag} />
      )}

      {salePosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  );
}
