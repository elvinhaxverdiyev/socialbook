import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings

from .genre_models import Genre


def book_cover_path(instance, filename):
    ext = filename.split('.')[-1]
    return f'books/{uuid.uuid4()}.{ext}'


class Book(models.Model):
    """
    Kitab detalı səhifəsindəki bütün məlumatlar.
    """
    LANGUAGE_CHOICES = [
        ('az', 'Azərbaycan'),
        ('en', 'İngilis'),
        ('ru', 'Rus'),
        ('tr', 'Türk'),
    ]
 
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    cover_image = models.ImageField(
        upload_to=book_cover_path,
        blank=True,
        null=True,
    )
    genres = models.ManyToManyField(Genre, related_name='books', blank=True)
    year = models.PositiveIntegerField(blank=True, null=True)
    language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES, default='az')
    pages = models.PositiveIntegerField(blank=True, null=True)
    description = models.TextField(blank=True)
 
    created_at = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        unique_together = ('title', 'author')
 
    def __str__(self):
        return f'{self.title} — {self.author}'
 
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