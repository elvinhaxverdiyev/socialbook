from django.db import models
from django.conf import settings


class Shelf(models.Model):
    """
    'Rəfə əlavə et' funksiyası. Hər istifadəçi hər kitab üçün yalnız BİR
    status seçə bilər (unique_together) — status seçəndə əvvəlkini əvəz edir,
    məhz buna görə: 'Artıq rəfindədir: Oxuyuram. Yenisini seçərək dəyişə bilərsən.'
    """
    STATUS_CHOICES = [
        ('reading', 'Oxuyuram'),
        ('to_read', 'Oxuyacam'),
        ('finished', 'Bitirdim'),
    ]
 
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
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    added_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    class Meta:
        unique_together = ('user', 'book')
 
    def __str__(self):
        return f'{self.user.username}: {self.book.title} [{self.get_status_display()}]'
 
 