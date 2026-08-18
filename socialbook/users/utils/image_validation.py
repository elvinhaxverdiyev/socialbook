from django.core.exceptions import ValidationError
from PIL import Image, UnidentifiedImageError

from .choices import (
    ALLOWED_AVATAR_CONTENT_TYPES,
    ALLOWED_IMAGE_FORMATS,
    MAX_AVATAR_BYTES,
    MAX_BACKGROUND_BYTES,
)


def _read_head(file_obj, size=32):
    pos = file_obj.tell()
    file_obj.seek(0)
    head = file_obj.read(size)
    file_obj.seek(pos)
    return head


def _validate_image_file(file_obj, *, max_bytes, allowed_content_types, label="Şəkil"):
    content_type = getattr(file_obj, "content_type", "") or ""
    if content_type and content_type not in allowed_content_types:
        raise ValidationError(f"{label}: yalnız JPG, PNG və ya WEBP yükləyə bilərsiniz.")

    size = getattr(file_obj, "size", 0) or 0
    if size > max_bytes:
        mb = max_bytes / (1024 * 1024)
        raise ValidationError(f"{label} {mb:.0f} MB-dan kiçik olmalıdır.")

    if not _read_head(file_obj):
        raise ValidationError(f"{label} boş fayldır.")

    try:
        file_obj.seek(0)
        with Image.open(file_obj) as img:
            img.verify()
        file_obj.seek(0)
        with Image.open(file_obj) as img:
            if img.format not in ALLOWED_IMAGE_FORMATS:
                raise ValidationError(f"{label}: yalnız JPG, PNG və ya WEBP yükləyə bilərsiniz.")
            if img.width < 1 or img.height < 1:
                raise ValidationError(f"{label} etibarsızdır.")
    except UnidentifiedImageError as exc:
        raise ValidationError(f"{label} etibarsızdır.") from exc
    except ValidationError:
        raise
    except Exception as exc:
        raise ValidationError(f"{label} oxunmadı.") from exc
    finally:
        file_obj.seek(0)

    return file_obj


def validate_avatar_upload(file_obj):
    return _validate_image_file(
        file_obj,
        max_bytes=MAX_AVATAR_BYTES,
        allowed_content_types=ALLOWED_AVATAR_CONTENT_TYPES,
        label="Avatar",
    )


def validate_background_upload(file_obj):
    return _validate_image_file(
        file_obj,
        max_bytes=MAX_BACKGROUND_BYTES,
        allowed_content_types=ALLOWED_AVATAR_CONTENT_TYPES,
        label="Banner",
    )
