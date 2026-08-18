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
const DEFAULT_COLOR = '#7A1F2B';

const ALLOWED_USER_IMAGE_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const ALLOWED_IMAGE_MIMES = new Set([
  ...ALLOWED_USER_IMAGE_MIMES,
  'image/svg+xml',
]);

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

// Profil şəkli/banner üçün base64 limiti (~10 MB fayl)
const PROFILE_DATA_URL_MAX = 15_000_000;

function isLocalDevHost(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
}

export function sanitizeImageUrl(value, { maxDataUrlLength = PROFILE_DATA_URL_MAX, allowSvg = false } = {}) {
  if (typeof value !== 'string') return null;
  const url = value.trim();
  if (!url) return null;

  if (url.startsWith('/') && !url.startsWith('//')) {
    return url.length <= 2048 ? url : null;
  }

  if (url.startsWith('data:image/')) {
    const semi = url.indexOf(';');
    if (semi === -1) return null;
    const mime = url.slice(5, semi).toLowerCase();
    const allowed = allowSvg ? ALLOWED_IMAGE_MIMES : ALLOWED_USER_IMAGE_MIMES;
    if (!allowed.has(mime)) return null;
    return url.length <= maxDataUrlLength ? url : null;
  }

  if (url.startsWith('blob:')) {
    return url.length <= 2048 ? url : null;
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:') return parsed.href;
    if (parsed.protocol === 'http:' && isLocalDevHost(parsed.hostname)) return parsed.href;
  } catch {
    return null;
  }

  return null;
}

export function sanitizeTelHref(phone) {
  const digits = String(phone ?? '').replace(/[^\d+]/g, '');
  if (!digits || digits.length > 20 || !/^\+?\d+$/.test(digits)) return null;
  return `tel:${digits}`;
}

export function sanitizeDocumentTitle(value, maxLength = 80) {
  return clampText(value, maxLength);
}

export function isValidPassword(value) {
  return typeof value === 'string' && value.length >= 6 && value.length <= LIMITS.password;
}
