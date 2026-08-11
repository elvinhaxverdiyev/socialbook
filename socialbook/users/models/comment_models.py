from django.db import models
from django.conf import settings

from .user_posts import Post


class Comment(models.Model):
    """
    Post altındakı şərhlər.
    """
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='comments',
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comments',
    )
    text = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        ordering = ['created_at']
 
    def __str__(self):
        return f'{self.user.username}: {self.text[:30]}'