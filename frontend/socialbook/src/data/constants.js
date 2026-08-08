import {
  Home,
  User,
  Store,
  Bell,
  Bookmark,
  Settings,
} from 'lucide-react';

export const navItems = [
  { key: 'home', label: 'Əsas səhifə', icon: Home },
  { key: 'profile', label: 'Profilim', icon: User },
  { key: 'stores', label: 'Mağazalar', icon: Store },
  { key: 'notifications', label: 'Bildirişlər', icon: Bell },
  { key: 'saved', label: 'Saxlanılanlar', icon: Bookmark },
  { key: 'settings', label: 'Parametrlər', icon: Settings },
];

export const composerTypes = [
  { value: 'general', label: 'Adi post' },
  { value: 'reading', label: 'Oxuyuram' },
  { value: 'sale', label: 'Satıram' },
];

export const genderOptions = [
  { value: 'female', label: 'Qadın' },
  { value: 'male', label: 'Kişi' },
  { value: 'other', label: 'Digər' },
];
