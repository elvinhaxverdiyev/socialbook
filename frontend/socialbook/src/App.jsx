import { lazy, Suspense, useEffect, useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import SiteFooter from './components/layout/SiteFooter';
import RightPanel from './components/layout/RightPanel';
import AuthModal from './components/auth/AuthModal';
import PostDetailModal from './components/posts/PostDetailModal';
import BackButton from './components/ui/BackButton';
import PageLoader from './components/ui/PageLoader';
import { AppProvider, useApp } from './context/AppContext';
import usePageTitle from './hooks/usePageTitle';
import { isAllowedPage } from './utils/security';
import { getBookById, getAuthorById } from './data/books';
import { getStoreById } from './data/mockData';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const StoresPage = lazy(() => import('./pages/StoresPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const SavedPage = lazy(() => import('./pages/SavedPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const ShelfPage = lazy(() => import('./pages/ShelfPage'));
const BooksPage = lazy(() => import('./pages/BooksPage'));
const BookDetailPage = lazy(() => import('./pages/BookDetailPage'));
const AuthorPage = lazy(() => import('./pages/AuthorPage'));
const GenresPage = lazy(() => import('./pages/GenresPage'));
const StoreDetailPage = lazy(() => import('./pages/StoreDetailPage'));

const pages = {
  home: HomePage,
  books: BooksPage,
  book: BookDetailPage,
  author: AuthorPage,
  genres: GenresPage,
  profile: ProfilePage,
  'user-profile': UserProfilePage,
  shelf: ShelfPage,
  stores: StoresPage,
  store: StoreDetailPage,
  notifications: NotificationsPage,
  saved: SavedPage,
  settings: SettingsPage,
};

const WIDE_PAGES = new Set(['shelf', 'books', 'book', 'author', 'genres', 'stores', 'store']);

const PAGE_TITLES = {
  home: 'Əsas',
  books: 'Kitablar',
  genres: 'Janrlar',
  profile: 'Profil',
  shelf: 'Rəf',
  stores: 'Mağazalar',
  notifications: 'Bildirişlər',
  saved: 'Saxlanılanlar',
  settings: 'Parametrlər',
};

function resolvePageTitle({
  activePage,
  viewedBookId,
  viewedAuthorId,
  viewedStoreId,
  viewedUserHandle,
}) {
  if (activePage === 'book') {
    return getBookById(viewedBookId)?.title || 'Kitab';
  }
  if (activePage === 'author') {
    return getAuthorById(viewedAuthorId)?.name || 'Yazar';
  }
  if (activePage === 'store') {
    return getStoreById(viewedStoreId)?.name || 'Mağaza';
  }
  if (activePage === 'user-profile' && viewedUserHandle) {
    return viewedUserHandle;
  }
  return PAGE_TITLES[activePage] || null;
}

function AppShell() {
  const {
    activePage,
    canGoBack,
    viewedBookId,
    viewedAuthorId,
    viewedStoreId,
    viewedUserHandle,
  } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageKey = isAllowedPage(activePage) ? activePage : 'home';
  const Page = pages[pageKey] || HomePage;
  const showRightPanel =
    pageKey === 'home' || pageKey === 'profile' || pageKey === 'user-profile';

  usePageTitle(
    resolvePageTitle({
      activePage: pageKey,
      viewedBookId,
      viewedAuthorId,
      viewedStoreId,
      viewedUserHandle,
    }),
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageKey, viewedBookId, viewedAuthorId, viewedStoreId, viewedUserHandle]);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app">
      <a href="#main-content" className="skip-link">
        Əsas məzmuna keç
      </a>

      <Header
        onMenuClick={() => setSidebarOpen(true)}
        menuOpen={sidebarOpen}
      />

      <div className="app__body">
        <Sidebar open={sidebarOpen} onClose={closeSidebar} />

        <div className={`app__main ${WIDE_PAGES.has(pageKey) ? 'app__main--wide' : ''}`}>
          <main id="main-content" className="app__feed" tabIndex={-1}>
            {canGoBack && (
              <div className="app__back-bar">
                <BackButton />
              </div>
            )}
            <Suspense fallback={<PageLoader />}>
              <Page />
            </Suspense>
          </main>
        </div>

        {showRightPanel ? (
          <RightPanel />
        ) : WIDE_PAGES.has(pageKey) ? null : (
          <div className="right-panel right-panel--spacer" aria-hidden="true" />
        )}
      </div>

      <SiteFooter />

      <AuthModal />
      <PostDetailModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
