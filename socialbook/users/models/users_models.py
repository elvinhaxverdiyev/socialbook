from django.contrib.auth.models import AbstractUser, UserManager as DjangoUserManager
from django.db import models
from django.db.models import Exists, OuterRef
from django.utils import timezone

from users.shelf_theme import default_shelf_theme
from users.utils.choices import CURRENT_STATUS_CHOICES, GENDER_CHOICES


def user_avatar_path(instance, filename):
    """Köhnə migration-lar üçün saxlanılır (artıq istifadə olunmur)."""
    import uuid
    ext = filename.split(".")[-1]
    return f"avatars/{instance.id}/{uuid.uuid4()}.{ext}"


class UserQuerySet(models.QuerySet):
    """
    Siyahı görünüşlərində (istifadəçi siyahısı, izləyicilər/izlənənlər,
    profil) N+1 sorğusuz istifadə üçün. Annotasiya adları `@property`-lərlə
    toqquşmasın deyə `_` prefiksi ilə saxlanılır.
    """

    def with_counts(self):
        return self.annotate(
            _following_count=models.Count('following', distinct=True),
            _followers_count=models.Count('followers', distinct=True),
            _posts_count=models.Count('posts', distinct=True),
            _shelf_count=models.Count('shelf_items', distinct=True),
        )

    def with_viewer_flags(self, viewer):
        if not viewer or not getattr(viewer, 'is_authenticated', False):
            return self
        qs = self.prefetch_related(
            models.Prefetch(
                'followers',
                queryset=self.model.objects.filter(pk=viewer.pk),
                to_attr='_viewer_follow_match',
            ),
        )
        from users.models.block_models import BlockedUser

        return qs.annotate(
            _viewer_blocked_target=Exists(
                BlockedUser.objects.filter(
                    blocker=viewer,
                    blocked_id=OuterRef('pk'),
                ),
            ),
        )

    def for_list(self, viewer=None):
        return self.with_counts().with_viewer_flags(viewer).select_related("profile_avatar")


class UserManager(DjangoUserManager.from_queryset(UserQuerySet)):
    pass


class User(AbstractUser):
    """
    AbstractUser-i genişləndirir. username @handle kimi istifadə olunur
    (məs: @rashad_g), avatar yoxdursa initials frontend-də göstərilir.
    Seçim siyahıları `users/utils/choices.py`-dadır.
    """

    profile_avatar = models.ForeignKey(
        "users.Avatar",
        on_delete=models.SET_NULL,
        related_name="selected_by_users",
        null=True,
        blank=True,
    )
    backround_image = models.ImageField(
        upload_to='backgrounds/',
        blank=True,
        null=True,
    )
    email = models.EmailField(unique=True)
    bio = models.TextField(max_length=500, blank=True)
    age = models.PositiveIntegerField(blank=True, null=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)
    is_email_verified = models.BooleanField(default=False)
    password_changed_at = models.DateTimeField(null=True, blank=True)
    shelf_theme = models.JSONField(default=default_shelf_theme, blank=True)
    current_status = models.CharField(
        max_length=20,
        choices=CURRENT_STATUS_CHOICES,
        default='idle',
    )

    followers = models.ManyToManyField(
        'self',
        symmetrical=False,
        related_name='following',
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    def __str__(self):
        return self.username

    @property
    def following_count(self):
        return self.following.count()

    @property
    def followers_count(self):
        return self.followers.count()

    @property
    def posts_count(self):
        return self.posts.count()

    @property
    def shelf_count(self):
        return self.shelf_items.count()

    def shelf_count_by_status(self, status):
        return self.shelf_items.filter(status=status).count()

    def set_password(self, raw_password):
        super().set_password(raw_password)
        self.password_changed_at = timezone.now()
