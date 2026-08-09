import {
  Home,
  BookOpen,
  User,
  Store,
  Bell,
  Bookmark,
  Settings,
} from 'lucide-react';

export { genres, bookTypes } from './books';

export const navItems = [
  { key: 'home', label: 'Əsas səhifə', icon: Home },
  { key: 'books', label: 'Kitablar', icon: BookOpen },
  { key: 'profile', label: 'Profilim', icon: User },
  { key: 'stores', label: 'Mağazalar', icon: Store },
  { key: 'notifications', label: 'Bildirişlər', icon: Bell },
  { key: 'saved', label: 'Saxlanılanlar', icon: Bookmark },
  { key: 'settings', label: 'Parametrlər', icon: Settings },
];

export const composerTypes = [
  { value: 'general', label: 'Adi post' },
  { value: 'reading', label: 'Oxuyuram' },
  { value: 'finished', label: 'Bitirdim' },
  { value: 'sale', label: 'Satıram' },
];

export const genderOptions = [
  { value: 'female', label: 'Qadın' },
  { value: 'male', label: 'Kişi' },
  { value: 'other', label: 'Digər' },
];

export const bookSortOptions = [
  { value: 'rating', label: 'Reytinq' },
  { value: 'year', label: 'Nəşr ili' },
  { value: 'title', label: 'Ad (A-Z)' },
];

export const shelfStatuses = [
  {
    value: 'reading',
    label: 'Oxuyuram',
    short: 'Oxuyuram',
    hint: 'İndi oxuduğun kitab',
  },
  {
    value: 'finished',
    label: 'Bitirdim',
    short: 'Bitirdim',
    hint: 'Tamamladığın kitab',
  },
  {
    value: 'want',
    label: 'Oxuyacam',
    short: 'Oxuyacam',
    hint: 'Növbəti oxunacaqlar',
  },
];
