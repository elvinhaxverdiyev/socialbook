import uuid

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


def store_cover_path(instance, filename):
    ext = filename.split('.')[-1]
    return f'stores/{uuid.uuid4()}.{ext}'


class StoreQuerySet(models.QuerySet):
    def with_related(self):
        return self.select_related('owner')

    def with_counts(self):
        return self.annotate(_books_count=models.Count('posts', distinct=True))

    def for_list(self):
        return self.with_related().with_counts()


class Store(models.Model):
    """
    Kitab mağazası profili — `StoresPage`/`StoreDetailPage` ilə uyğun.
    `owner` gələcəkdə mağaza hesabı ilə giriş üçün (hələlik boş qala bilər).
    """

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='stores',
        blank=True,
        null=True,
    )
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    about = models.TextField(blank=True)
    rating = models.DecimalField(
        max_digits=3, decimal_places=2, default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
    )
    verified = models.BooleanField(default=False)
    hours = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    cover_image = models.ImageField(
        upload_to=store_cover_path,
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    objects = StoreQuerySet.as_manager()

    class Meta:
        ordering = ['-rating', 'name']

    def __str__(self):
        return self.name

    @property
    def books_count(self):
        return self.posts.count()
