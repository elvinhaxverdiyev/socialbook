import uuid

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from books.utils.choices import BOOK_TYPE_CHOICES, LANGUAGE_CHOICES

from .author_models import Author
from .genre_models import Genre


def book_cover_path(instance, filename):
    ext = filename.split('.')[-1]
    return f'books/{uuid.uuid4()}.{ext}'


class BookQuerySet(models.QuerySet):
    """
    Siyahı görünüşlərində N+1 sorğusuz istifadə üçün annotasiya edilmiş
    queryset-lər. Annotasiya adları model `@property`-ləri ilə toqquşmasın
    deyə `_` prefiksi ilə saxlanılır (serializer bunları `getattr` ilə oxuyur).
    """

    def with_related(self):
        return self.select_related('author').prefetch_related('genres')

    def with_ratings(self):
        return self.annotate(
            _average_rating=models.Avg('ratings__score'),
            _ratings_count=models.Count('ratings', distinct=True),
        )

    def with_viewer_flags(self, user):
        if not user or not user.is_authenticated:
            return self
        from shelves.models.shelves_models import Shelf

        return self.prefetch_related(
            models.Prefetch(
                'ratings',
                queryset=Rating.objects.filter(user=user),
                to_attr='_viewer_ratings',
            ),
            models.Prefetch(
                'shelf_items',
                queryset=Shelf.objects.filter(user=user),
                to_attr='_viewer_shelf_items',
            ),
        )

    def for_list(self, user=None):
        return self.with_related().with_ratings().with_viewer_flags(user)


class Book(models.Model):
    """
    Kitab detalı səhifəsindəki bütün məlumatlar. Seçim siyahıları
    `books/utils/choices.py`-dadır.
    """

    title = models.CharField(max_length=255)
    author = models.ForeignKey(
        Author,
        on_delete=models.SET_NULL,
        related_name='books',
        blank=True,
        null=True,
    )
    cover_image = models.ImageField(
        upload_to=book_cover_path,
        blank=True,
        null=True,
    )
    genres = models.ManyToManyField(Genre, related_name='books', blank=True)
    book_type = models.CharField(
        max_length=20,
        choices=BOOK_TYPE_CHOICES,
        blank=True,
    )
    year = models.PositiveIntegerField(blank=True, null=True)
    language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES, default='az')
    pages = models.PositiveIntegerField(blank=True, null=True)
    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    objects = BookQuerySet.as_manager()

    class Meta:
        unique_together = ('title', 'author')
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title} — {self.author}'

    @property
    def author_name(self):
        return self.author.name if self.author else ''

    @property
    def average_rating(self):
        result = self.ratings.aggregate(avg=models.Avg('score'))['avg']
        return round(result, 2) if result else None

    @property
    def ratings_count(self):
        return self.ratings.count()


class Rating(models.Model):
    """
    İstifadəçinin kitaba verdiyi qiymət (4.71, 340 qiymət göstəricisi buradan gəlir).
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='ratings',
    )
    book = models.ForeignKey(
        'books.Book',
        on_delete=models.CASCADE,
        related_name='ratings',
    )
    score = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'book')

    def __str__(self):
        return f'{self.user.username} -> {self.book.title}: {self.score}'
