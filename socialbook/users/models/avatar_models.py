import uuid

from django.conf import settings
from django.db import models


class AvatarKind(models.TextChoices):
    PRESET = "preset", "Preset (admin)"
    UPLOAD = "upload", "İstifadəçi yükləməsi"


def avatar_image_path(instance, filename):
    ext = filename.rsplit(".", 1)[-1].lower()
    if instance.kind == AvatarKind.PRESET:
        return f"avatars/presets/{uuid.uuid4()}.{ext}"
    owner_id = instance.owner_id or "unknown"
    return f"avatars/users/{owner_id}/{uuid.uuid4()}.{ext}"


class Avatar(models.Model):
    """
    Vahid avatar modeli:
    - kind=preset  → admin paneldən əlavə olunur (owner boş)
    - kind=upload  → istifadəçi öz şəklini yükləyir (owner dolu)
    """

    kind = models.CharField(max_length=10, choices=AvatarKind.choices)
    image = models.ImageField(upload_to=avatar_image_path)
    label = models.CharField(max_length=80, blank=True, help_text="Preset adı, məs: Paul")
    subtitle = models.CharField(max_length=120, blank=True, help_text="Kitab adı, məs: Dune")
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="uploaded_avatars",
        null=True,
        blank=True,
    )
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["sort_order", "id"]
        constraints = [
            models.CheckConstraint(
                condition=(
                    models.Q(kind=AvatarKind.PRESET, owner__isnull=True)
                    | models.Q(kind=AvatarKind.UPLOAD, owner__isnull=False)
                ),
                name="avatar_kind_owner_consistency",
            ),
        ]
        indexes = [
            models.Index(fields=["kind", "is_active", "sort_order"]),
        ]

    def __str__(self):
        base = self.label or f"Avatar #{self.pk}"
        if self.subtitle:
            return f"{base} — {self.subtitle}"
        return base
