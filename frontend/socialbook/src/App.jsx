import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import RightPanel from './components/layout/RightPanel';
import AuthModal from './components/auth/AuthModal';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import StoresPage from './pages/StoresPage';
import NotificationsPage from './pages/NotificationsPage';
import SavedPage from './pages/SavedPage';
import SettingsPage from './pages/SettingsPage';
import UserProfilePage from './pages/UserProfilePage';
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
  const { activePage } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const Page = isAllowedPage(activePage) ? pages[activePage] : HomePage;
  const showRightPanel =
    activePage === 'home' || activePage === 'profile' || activePage === 'user-profile';

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app">
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="app__body">
        <Sidebar open={sidebarOpen} onClose={closeSidebar} />

        <div className={`app__main ${showRightPanel ? '' : 'app__main--wide'}`}>
          <main className="app__feed">
            <Page />
          </main>
        </div>

        {showRightPanel && <RightPanel />}
      </div>

      <AuthModal />
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
