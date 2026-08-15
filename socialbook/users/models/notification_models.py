from django.conf import settings
from django.db import models

from users.utils.choices import NOTIFICATION_TYPE_CHOICES


class NotificationQuerySet(models.QuerySet):
    def with_related(self):
        return self.select_related('actor', 'post')

    def unread(self):
        return self.filter(is_read=False)


class Notification(models.Model):
    """
    Bildirişlər siyahısı (`NotificationsPage`). `actor` bildirişi yaradan
    istifadəçi (like/comment/follow edən), `post` isə əlaqəli postdur.
    Seçim siyahısı `users/utils/choices.py`-dadır.
    """

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
    )
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='+',
        blank=True,
        null=True,
    )
    notification_type = models.CharField(
        max_length=20,
        choices=NOTIFICATION_TYPE_CHOICES,
        default='system',
    )
    post = models.ForeignKey(
        'users.Post',
        on_delete=models.SET_NULL,
        related_name='notifications',
        blank=True,
        null=True,
    )
    text = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = NotificationQuerySet.as_manager()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.recipient.username}: {self.text[:40]}'
