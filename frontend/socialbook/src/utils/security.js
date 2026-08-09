export const LIMITS = {
  postText: 2000,
  commentText: 500,
  bookTitle: 200,
  bookAuthor: 120,
  searchQuery: 100,
  username: 30,
  email: 254,
  password: 128,
  shelfTitle: 200,
  shelfAuthor: 120,
  bio: 160,
};

const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const DEFAULT_COLOR = '#7A2331';

export const ALLOWED_POST_TYPES = new Set(['general', 'reading', 'finished', 'sale']);
export const ALLOWED_SHELF_STATUSES = new Set(['reading', 'finished', 'want']);
export const ALLOWED_CONDITIONS = new Set(['yeni', 'yaxşı', 'orta']);
export const ALLOWED_GENDERS = new Set(['female', 'male', 'other']);
export const ALLOWED_GENRES = new Set([
  'klassik',
  'fantastika',
  'detektiv',
  'poeziya',
  'bioqrafiya',
  'usaq',
  'elmi',
  'roman',
  'azerbaycan',
]);
export const ALLOWED_PAGES = new Set([
  'home',
  'books',
  'book',
  'author',
  'genres',
  'profile',
  'user-profile',
  'shelf',
  'stores',
  'store',
  'notifications',
  'saved',
  'settings',
]);

export function sanitizeHexColor(value, fallback = DEFAULT_COLOR) {
  if (typeof value === 'string' && HEX_COLOR.test(value.trim())) {
    return value.trim();
  }
  return fallback;
}

export function clampText(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, maxLength);
}

export function sanitizeSearchQuery(value, maxLength = LIMITS.searchQuery) {
  return clampText(value, maxLength);
}

export function sanitizeInitials(value, maxLength = 3) {
  const cleaned = String(value ?? '')
    .replace(/[^\p{L}\p{N}]/gu, '')
    .slice(0, maxLength);
  return cleaned.toUpperCase() || '?';
}

export function parsePositivePrice(value) {
  const num = Number.parseFloat(value);
  if (!Number.isFinite(num) || num < 0 || num > 1_000_000) return null;
  return Math.round(num * 100) / 100;
}

export function isAllowedPage(page) {
  return typeof page === 'string' && ALLOWED_PAGES.has(page);
}

export function isValidHandle(handle) {
  return typeof handle === 'string' && /^@[\w.]{1,30}$/.test(handle);
}

export function isValidEmail(value) {
  const email = clampText(value, LIMITS.email);
  return email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function sanitizeUsername(value) {
  return clampText(value, LIMITS.username).replace(/^@+/, '').replace(/[^\w.]/g, '').toLowerCase();
}

export function usernameToHandle(username) {
  const clean = sanitizeUsername(username);
  return clean.length >= 3 ? `@${clean}` : '';
}

export function isValidUsername(value) {
  const clean = sanitizeUsername(value);
  return /^[a-z0-9_][a-z0-9_.]{2,29}$/.test(clean);
}
