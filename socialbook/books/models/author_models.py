import uuid

from django.db import models


def author_cover_path(instance, filename):
    ext = filename.split('.')[-1]
    return f'authors/{uuid.uuid4()}.{ext}'


class Author(models.Model):
    """
    Müəllif profili — Müəllif səhifəsindəki bio/ölkə/kitablar bura bağlıdır.
    """

    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    bio = models.TextField(blank=True)
    country = models.CharField(max_length=120, blank=True)
    cover_image = models.ImageField(
        upload_to=author_cover_path,
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify

            base_slug = slugify(self.name) or 'muellif'
            slug = base_slug
            index = 1
            while Author.objects.exclude(pk=self.pk).filter(slug=slug).exists():
                index += 1
                slug = f'{base_slug}-{index}'
            self.slug = slug
        super().save(*args, **kwargs)

    @property
    def books_count(self):
        return self.books.count()
