from django.conf import settings
from django.db import models

from shelves.utils.choices import STATUS_CHOICES


class ShelfQuerySet(models.QuerySet):
    def with_related(self):
        return self.select_related('book', 'book__author', 'user').prefetch_related('book__genres')


class Shelf(models.Model):
    """
    'Rəfə əlavə et' funksiyası. Hər istifadəçi hər kitab üçün yalnız BİR
    status seçə bilər (unique_together) — status seçəndə əvvəlkini əvəz edir,
    məhz buna görə: 'Artıq rəfindədir: Oxuyuram. Yenisini seçərək dəyişə bilərsən.'
    Seçim siyahısı `shelves/utils/choices.py`-dadır.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='shelf_items',
    )
    book = models.ForeignKey(
        'books.Book',
        on_delete=models.CASCADE,
        related_name='shelf_items',
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='want')
    added_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = ShelfQuerySet.as_manager()

    class Meta:
        unique_together = ('user', 'book')
        ordering = ['-updated_at']

    def __str__(self):
        return f'{self.user.username}: {self.book.title} [{self.get_status_display()}]'
