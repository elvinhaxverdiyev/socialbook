import uuid
from django.db import models
from django.conf import settings

from books.models.book_models import Book


class Post(models.Model):
    """
    İstifadəçinin paylaşdığı post. Kitab detalı səhifəsindəki
    'Bu kitab haqqında' bölməsindəki postlar da elə bu modeldir (book FK dolu olur).
    """
    POST_TYPE_CHOICES = [
        ('normal', 'Adi post'),
        ('reading', 'Oxuyuram'),
        ('finished', 'Bitirdim'),
        ('selling', 'Satıram'),
    ]
 
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='posts',
    )
    post_type = models.CharField(
        max_length=20,
        choices=POST_TYPE_CHOICES,
        default='normal',
    )
    text = models.TextField(max_length=1000, blank=True)
 
    book = models.ForeignKey(
        'books.Book',
        on_delete=models.SET_NULL,
        related_name='posts',
        blank=True,
        null=True,
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
 
    class Meta:
        ordering = ['-created_at']
 
    def __str__(self):
        return f'{self.user.username} [{self.get_post_type_display()}] - {self.created_at:%Y-%m-%d %H:%M}'
 
    @property
    def likes_count(self):
        return self.likes.count()
 
    @property
    def comments_count(self):
        return self.comments.count()
 
 