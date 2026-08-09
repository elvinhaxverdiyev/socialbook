import BookShelf from '../components/profile/BookShelf';
import { getUserProfile } from '../data/mockData';
import { useApp } from '../context/AppContext';

export default function ShelfPage() {
  const { shelfView, shelfBooks, currentUser, isLoggedIn } = useApp();

  const ownerHandle = shelfView.handle;
  const isOwn = !ownerHandle || (isLoggedIn && ownerHandle === currentUser.handle);
  const otherProfile = ownerHandle && !isOwn ? getUserProfile(ownerHandle) : null;
  const displayBooks = isOwn ? shelfBooks : (otherProfile?.shelfBooks ?? []);

  return (
    <div className="shelf-page">
      <BookShelf
        books={displayBooks}
        readOnly={!isOwn}
        ownerHandle={ownerHandle}
        embedded
      />
    </div>
  );
}
