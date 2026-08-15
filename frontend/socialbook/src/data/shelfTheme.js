import { isValidHandle, sanitizeHexColor } from '../utils/security';

export const SHELF_THEME_STORAGE_KEY = 'kitabci-shelf-themes';

export const SHELF_WALL_PRESETS = [
  '#C9B89A',
  '#8B7355',
  '#7A1F2B',
  '#435A45',
  '#22304F',
  '#6B4C8A',
  '#2E6B5A',
  '#E8DFD0',
];

export const SHELF_PLANK_PRESETS = [
  '#C4A06A',
  '#9A7348',
  '#B08D3D',
  '#7A5534',
  '#A67B5B',
  '#D4A574',
  '#6A4D2E',
  '#E0C090',
];

export const SHELF_STICKER_OPTIONS = [
  '📚',
  '📖',
  '✨',
  '⭐',
  '🌙',
  '☕',
  '🌿',
  '🦋',
  '🔖',
  '💫',
  '🎭',
  '🖋️',
  '🌸',
  '🍂',
  '❤️',
  '🔥',
];

/** Abuse limit for tampered localStorage payloads (UI allows all preset emojis). */
const MAX_STORED_STICKERS = SHELF_STICKER_OPTIONS.length;

export const SHELF_STICKER_SLOTS = [
  { x: 6, y: 10 },
  { x: 22, y: 6 },
  { x: 78, y: 8 },
  { x: 92, y: 14 },
  { x: 48, y: 5 },
  { x: 64, y: 12 },
];

export const DEFAULT_SHELF_THEME = {
  wallColor: '#C9B89A',
  plankColor: '#C4A06A',
  stickers: [],
};

const STICKER_SET = new Set(SHELF_STICKER_OPTIONS);
const WALL_SET = new Set(SHELF_WALL_PRESETS);
const PLANK_SET = new Set(SHELF_PLANK_PRESETS);
const STICKER_ID = /^[\w-]{1,48}$/;
const UNSAFE_STORAGE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

export function createStickerId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `st-${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
  }
  return `st-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function clampPercent(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 50;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function sanitizeThemeColor(value, allowedSet, fallback) {
  const hex = sanitizeHexColor(value, fallback);
  return allowedSet.has(hex) ? hex : fallback;
}

function sanitizeStickerId(value, fallback) {
  if (typeof value === 'string' && STICKER_ID.test(value.trim())) {
    return value.trim().slice(0, 48);
  }
  return fallback;
}

/** Keep stickers slightly inside the rail edges while dragging. */
export function clampStickerPosition(x, y) {
  return {
    x: clampPercent(Math.min(94, Math.max(6, x))),
    y: clampPercent(Math.min(88, Math.max(6, y))),
  };
}

function hexShades(hex) {
  const safe = sanitizeHexColor(hex).replace('#', '');
  const r = parseInt(safe.slice(0, 2), 16);
  const g = parseInt(safe.slice(2, 4), 16);
  const b = parseInt(safe.slice(4, 6), 16);
  const clamp = (n) => Math.max(0, Math.min(255, n));
  const toHex = (rr, gg, bb) =>
    `#${[clamp(rr), clamp(gg), clamp(bb)]
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')}`;
  return {
    light: toHex(r + 28, g + 24, b + 20),
    base: `#${safe}`,
    dark: toHex(r - 32, g - 28, b - 24),
    edgeLight: toHex(r - 18, g - 16, b - 14),
    edgeDark: toHex(r - 48, g - 42, b - 38),
  };
}

export function sanitizeShelfTheme(raw, fallback = DEFAULT_SHELF_THEME) {
  const base = fallback || DEFAULT_SHELF_THEME;
  const wallColor = sanitizeThemeColor(raw?.wallColor, WALL_SET, base.wallColor);
  const plankColor = sanitizeThemeColor(raw?.plankColor, PLANK_SET, base.plankColor);

  const seenEmojis = new Set();
  const stickers = Array.isArray(raw?.stickers)
    ? raw.stickers
        .slice(0, MAX_STORED_STICKERS)
        .map((item, index) => {
          const emoji = STICKER_SET.has(item?.emoji) ? item.emoji : null;
          if (!emoji || seenEmojis.has(emoji)) return null;
          seenEmojis.add(emoji);

          const slot = SHELF_STICKER_SLOTS[index] || { x: 50, y: 40 };
          const pos = clampStickerPosition(item?.x ?? slot.x, item?.y ?? slot.y);
          const id = sanitizeStickerId(item?.id, createStickerId());
          return {
            id,
            emoji,
            x: pos.x,
            y: pos.y,
          };
        })
        .filter(Boolean)
    : [];

  return { wallColor, plankColor, stickers };
}

export function shelfThemeToCssVars(theme) {
  const safe = sanitizeShelfTheme(theme);
  const wall = hexShades(safe.wallColor);
  const plank = hexShades(safe.plankColor);

  return {
    '--shelf-wall-top': wall.light,
    '--shelf-wall-bottom': wall.dark,
    '--shelf-plank-light': plank.light,
    '--shelf-plank-base': plank.base,
    '--shelf-plank-dark': plank.dark,
    '--shelf-plank-edge-light': plank.edgeLight,
    '--shelf-plank-edge-dark': plank.edgeDark,
  };
}

export function loadShelfThemesFromStorage() {
  try {
    const raw = localStorage.getItem(SHELF_THEME_STORAGE_KEY);
    if (!raw || raw.length > 512_000) return {};

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

    const themes = {};
    for (const [handle, theme] of Object.entries(parsed)) {
      if (UNSAFE_STORAGE_KEYS.has(handle) || !isValidHandle(handle)) continue;
      themes[handle] = sanitizeShelfTheme(theme);
    }
    return themes;
  } catch {
    return {};
  }
}

export function saveShelfThemeToStorage(handle, theme) {
  if (!isValidHandle(handle)) return false;

  try {
    const all = loadShelfThemesFromStorage();
    all[handle] = sanitizeShelfTheme(theme);
    localStorage.setItem(SHELF_THEME_STORAGE_KEY, JSON.stringify(all));
    return true;
  } catch {
    return false;
  }
}
