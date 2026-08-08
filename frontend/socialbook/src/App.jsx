import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import RightPanel from './components/layout/RightPanel';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import StoresPage from './pages/StoresPage';
import NotificationsPage from './pages/NotificationsPage';
import SavedPage from './pages/SavedPage';
import SettingsPage from './pages/SettingsPage';
import UserProfilePage from './pages/UserProfilePage';
import WelcomePage from './pages/WelcomePage';
import { AppProvider, useApp } from './context/AppContext';

import { isAllowedPage } from './utils/security';

const pages = {
  home: HomePage,
  profile: ProfilePage,
  'user-profile': UserProfilePage,
  stores: StoresPage,
  notifications: NotificationsPage,
  saved: SavedPage,
  settings: SettingsPage,
};

function AppShell() {
  const { isLoggedIn, activePage } = useApp();

  if (!isLoggedIn) {
    return <WelcomePage />;
  }

  const Page = isAllowedPage(activePage) ? pages[activePage] : HomePage;
  const showRightPanel =
    activePage === 'home' || activePage === 'profile' || activePage === 'user-profile';

  return (
    <div className="app">
      <Header />

      <div className="app__body">
        <Sidebar />

        <div className={`app__main ${showRightPanel ? '' : 'app__main--wide'}`}>
          <main className="app__feed">
            <Page />
          </main>
        </div>

        {showRightPanel && <RightPanel />}
      </div>
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
