from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from users.utils.choices import CONDITION_CHOICES, POST_TYPE_CHOICES


class PostQuerySet(models.QuerySet):
    """
    Feed/profil/kitab/mağaza siyahılarında N+1 sorğusuz istifadə üçün.
    Annotasiya adları model `@property`-ləri ilə toqquşmasın deyə `_`
    prefiksi ilə saxlanılır, serializer bunları `getattr` ilə oxuyur.
    """

    def with_related(self):
        return self.select_related(
            'user', 'book', 'book__author', 'store', 'category',
        ).prefetch_related('book__genres')

    def with_counts(self):
        return self.annotate(
            _likes_count=models.Count('likes', distinct=True),
            _comments_count=models.Count('comments', distinct=True),
        )

    def with_viewer_flags(self, viewer):
        if not viewer or not getattr(viewer, 'is_authenticated', False):
            return self
        from django.contrib.auth import get_user_model

        User = get_user_model()
        return self.prefetch_related(
            models.Prefetch(
                'likes',
                queryset=User.objects.filter(pk=viewer.pk),
                to_attr='_viewer_like_match',
            ),
            models.Prefetch(
                'saved_by',
                queryset=User.objects.filter(pk=viewer.pk),
                to_attr='_viewer_save_match',
            ),
        )

    def visible_to(self, viewer):
        """
        Bloklanmış istifadəçilərin postlarını gizlədir (qarşılıqlı blok).
        """
        if not viewer or not getattr(viewer, 'is_authenticated', False):
            return self

        from users.utils.block_utils import blocked_user_exists_subquery

        return self.exclude(
            models.Q(user_id__isnull=False) & blocked_user_exists_subquery(viewer),
        )

    def for_feed(self, viewer=None):
        return self.with_related().with_counts().with_viewer_flags(viewer).visible_to(viewer)


class Post(models.Model):
    """
    İstifadəçinin paylaşdığı post. Kitab detalı səhifəsindəki
    'Bu kitab haqqında' bölməsindəki postlar da elə bu modeldir (book FK dolu olur).
    Mağaza postlarında `user` boş, `store` dolu olur (Composer-dən deyil,
    mağaza panelindən yaradılır). Seçim siyahıları `users/utils/choices.py`-dadır.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='posts',
        blank=True,
        null=True,
    )
    store = models.ForeignKey(
        'stores.Store',
        on_delete=models.SET_NULL,
        related_name='posts',
        blank=True,
        null=True,
    )
    post_type = models.CharField(
        max_length=20,
        choices=POST_TYPE_CHOICES,
        default='general',
    )
    text = models.TextField(max_length=2000, blank=True)

    book = models.ForeignKey(
        'books.Book',
        on_delete=models.SET_NULL,
        related_name='posts',
        blank=True,
        null=True,
    )

    # `sale`/`store` tipli postlar üçün elan sahələri
    price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True,
        validators=[MinValueValidator(0)],
    )
    condition = models.CharField(
        max_length=10, choices=CONDITION_CHOICES, blank=True,
    )
    category = models.ForeignKey(
        'books.Genre',
        on_delete=models.SET_NULL,
        related_name='sale_posts',
        blank=True,
        null=True,
    )

    # `finished` tipli postda o an verilən qiymət (Rating modelinə də əks olunur)
    rating = models.PositiveSmallIntegerField(
        blank=True, null=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
    )

    likes = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='liked_posts',
        blank=True,
    )
    saved_by = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='saved_posts',
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = PostQuerySet.as_manager()

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.CheckConstraint(
                condition=models.Q(user__isnull=False) | models.Q(store__isnull=False),
                name='post_has_user_or_store',
            ),
        ]

    def __str__(self):
        author = self.user.username if self.user_id else (self.store.name if self.store_id else 'naməlum')
        return f'{author} [{self.get_post_type_display()}] - {self.created_at:%Y-%m-%d %H:%M}'

    @property
    def likes_count(self):
        return self.likes.count()

    @property
    def comments_count(self):
        return self.comments.count()
