"""
`users` app-ının model sahələrində istifadə olunan seçim (choices) siyahıları.
"""

CURRENT_STATUS_CHOICES = [
    ('reading', 'Oxuyur'),
    ('idle', 'Aktiv deyil'),
]

GENDER_CHOICES = [
    ('female', 'Qadın'),
    ('male', 'Kişi'),
    ('other', 'Digər'),
]

POST_TYPE_CHOICES = [
    ('general', 'Adi post'),
    ('reading', 'Oxuyuram'),
    ('finished', 'Bitirdim'),
    ('sale', 'Satıram'),
    ('store', 'Mağaza postu'),
]

CONDITION_CHOICES = [
    ('yeni', 'Yeni'),
    ('yaxşı', 'Yaxşı'),
    ('orta', 'Orta'),
]

NOTIFICATION_TYPE_CHOICES = [
    ('like', 'Bəyənmə'),
    ('comment', 'Şərh'),
    ('follow', 'İzləmə'),
    ('store_post', 'Mağaza paylaşımı'),
    ('system', 'Sistem'),
]

MAX_AVATAR_BYTES = 10 * 1024 * 1024
MAX_BACKGROUND_BYTES = 10 * 1024 * 1024

ALLOWED_AVATAR_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}

ALLOWED_IMAGE_FORMATS = {"JPEG", "PNG", "WEBP"}