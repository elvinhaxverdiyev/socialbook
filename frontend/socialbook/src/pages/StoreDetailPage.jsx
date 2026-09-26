import { useApp } from '../context/AppContext';
import StoreProfileView from '../components/stores/StoreProfileView';

export default function StoreDetailPage() {
  const { viewedStoreId, posts, getStoreById, requireAuth } = useApp();
  const store = getStoreById(viewedStoreId);

  return (
    <StoreProfileView
      store={store}
      posts={posts}
      onContact={() => requireAuth('Əlaqə üçün daxil ol.')}
    />
  );
}
