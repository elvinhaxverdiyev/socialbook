from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _

from users.models.avatar_models import Avatar, AvatarKind


@admin.register(Avatar)
class AvatarAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "kind",
        "label",
        "subtitle",
        "is_active",
        "sort_order",
        "owner",
        "image_preview",
        "created_at",
    )
    list_filter = ("kind", "is_active")
    search_fields = ("label", "subtitle")
    ordering = ("sort_order", "id")
    readonly_fields = ("created_at", "image_preview")

    fieldsets = (
        (None, {
            "fields": (
                "kind",
                "image",
                "image_preview",
                "label",
                "subtitle",
                "is_active",
                "sort_order",
                "owner",
                "created_at",
            ),
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("owner")

    def save_model(self, request, obj, form, change):
        if obj.kind == AvatarKind.PRESET:
            obj.owner = None
        super().save_model(request, obj, form, change)

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;" />',
                obj.image.url,
            )
        return "-"

    image_preview.short_description = _("Önizləmə")
