from django.conf import settings
from django.db import models

from .user_posts import Post


class CommentQuerySet(models.QuerySet):
    def with_related(self):
        return self.select_related('user')

    def with_counts(self):
        return self.annotate(_likes_count=models.Count('likes', distinct=True))

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
        )

    def for_list(self, viewer=None):
        return self.with_related().with_counts().with_viewer_flags(viewer)


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
    likes = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='liked_comments',
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    objects = CommentQuerySet.as_manager()

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f'{self.user.username}: {self.text[:30]}'

    @property
    def likes_count(self):
        return self.likes.count()
