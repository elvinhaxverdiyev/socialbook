"""
Rəf teması — frontend `shelfTheme.js` ilə uyğun sabitlər və təmizləmə.
"""
import re
import uuid

HEX_COLOR = re.compile(r"^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$")
STICKER_ID = re.compile(r"^[\w-]{1,48}$")

SHELF_WALL_PRESETS = (
    "#C9B89A",
    "#8B7355",
    "#7A1F2B",
    "#435A45",
    "#22304F",
    "#6B4C8A",
    "#2E6B5A",
    "#E8DFD0",
)

SHELF_PLANK_PRESETS = (
    "#C4A06A",
    "#9A7348",
    "#B08D3D",
    "#7A5534",
    "#A67B5B",
    "#D4A574",
    "#6A4D2E",
    "#E0C090",
)

SHELF_STICKER_OPTIONS = (
    "📚",
    "📖",
    "✨",
    "⭐",
    "🌙",
    "☕",
    "🌿",
    "🦋",
    "🔖",
    "💫",
    "🎭",
    "🖋️",
    "🌸",
    "🍂",
    "❤️",
    "🔥",
)

WALL_SET = set(SHELF_WALL_PRESETS)
PLANK_SET = set(SHELF_PLANK_PRESETS)
STICKER_SET = set(SHELF_STICKER_OPTIONS)
MAX_STORED_STICKERS = len(SHELF_STICKER_OPTIONS)

DEFAULT_SHELF_THEME = {
    "wallColor": "#C9B89A",
    "plankColor": "#C4A06A",
    "stickers": [],
}


def default_shelf_theme():
    """JSONField üçün callable default (mutable dict problemi olmasın)."""
    return {
        "wallColor": DEFAULT_SHELF_THEME["wallColor"],
        "plankColor": DEFAULT_SHELF_THEME["plankColor"],
        "stickers": [],
    }


def _clamp_percent(value, default=50):
    try:
        number = int(round(float(value)))
    except (TypeError, ValueError):
        return default
    return max(0, min(100, number))


def clamp_sticker_position(x, y):
    return {
        "x": _clamp_percent(x, 50),
        "y": _clamp_percent(y, 40),
    }


def _create_sticker_id():
    return f"st-{uuid.uuid4().hex[:16]}"


def _sanitize_hex(value, allowed, fallback):
    if not isinstance(value, str):
        return fallback
    cleaned = value.strip()
    if HEX_COLOR.match(cleaned) and cleaned in allowed:
        return cleaned
    return fallback


def _sanitize_sticker_id(value):
    if isinstance(value, str) and STICKER_ID.match(value.strip()):
        return value.strip()[:48]
    return _create_sticker_id()


def sanitize_shelf_theme(raw=None, fallback=None):
    """
    DB, request və ya pozulmuş JSON-dan təhlükəsiz tema qaytarır.
    Frontend `sanitizeShelfTheme` ilə eyni məntiq.
    """
    base = fallback or DEFAULT_SHELF_THEME
    if not isinstance(raw, dict):
        raw = {}

    wall_color = _sanitize_hex(raw.get("wallColor"), WALL_SET, base["wallColor"])
    plank_color = _sanitize_hex(raw.get("plankColor"), PLANK_SET, base["plankColor"])

    stickers_raw = raw.get("stickers")
    stickers = []
    seen_emojis = set()

    if isinstance(stickers_raw, list):
        for index, item in enumerate(stickers_raw[:MAX_STORED_STICKERS]):
            if not isinstance(item, dict):
                continue
            emoji = item.get("emoji")
            if emoji not in STICKER_SET or emoji in seen_emojis:
                continue
            seen_emojis.add(emoji)

            pos = clamp_sticker_position(item.get("x", 50), item.get("y", 38))
            stickers.append(
                {
                    "id": _sanitize_sticker_id(item.get("id")),
                    "emoji": emoji,
                    "x": max(6, min(94, pos["x"])),
                    "y": max(6, min(88, pos["y"])),
                }
            )

    return {
        "wallColor": wall_color,
        "plankColor": plank_color,
        "stickers": stickers,
    }
