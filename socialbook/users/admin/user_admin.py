from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _

from ..models.users_models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # Siyahı görünüşündə göstəriləcək sütunlar
    list_display = (
        "id",
        "username",
        "email",
        "avatar_preview",
        "is_email_verified",
        "is_active",
        "is_staff",
        "created_at",
    )
    list_display_links = ("id", "username", "email")
    list_filter = (
        "is_active",
        "is_staff",
        "is_superuser",
        "is_email_verified",
        "created_at",
    )
    search_fields = ("username", "email", "first_name", "last_name")
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at", "last_login", "date_joined", "avatar_preview")

    # AbstractUser-dən gələn USERNAME_FIELD = "email" olduğu üçün
    # fieldsets-i yenidən qururuq
    fieldsets = (
        (None, {"fields": ("username", "email", "password")}),
        (_("Şəxsi məlumatlar"), {
            "fields": ("first_name", "last_name", "avatar", "avatar_preview", "bio")
        }),
        (_("Status"), {
            "fields": (
                "is_active",
                "is_staff",
                "is_superuser",
                "is_email_verified",
                "groups",
                "user_permissions",
            )
        }),
        (_("Vacib tarixlər"), {
            "fields": ("last_login", "date_joined", "created_at", "updated_at")
        }),
    )

    # Yeni istifadəçi yaradarkən görünən forma
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "email", "password1", "password2"),
        }),
    )

    filter_horizontal = ("groups", "user_permissions")

    def avatar_preview(self, obj):
        if obj.avatar:
            return format_html(
                '<img src="{}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />',
                obj.avatar.url,
            )
        return "-"

    avatar_preview.short_description = _("Avatar")