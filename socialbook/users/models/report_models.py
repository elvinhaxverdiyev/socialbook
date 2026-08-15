from django.conf import settings
from django.db import models


class Report(models.Model):
    """
    İstifadəçi və ya post şikayəti — `UserProfileActionsModal`/`reportUser`-in
    backend qarşılığı. Ya `reported_user`, ya `reported_post` dolu olmalıdır.
    """

    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reports_made',
    )
    reported_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reports_received',
        blank=True,
        null=True,
    )
    reported_post = models.ForeignKey(
        'users.Post',
        on_delete=models.CASCADE,
        related_name='reports',
        blank=True,
        null=True,
    )
    reason = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.CheckConstraint(
                condition=models.Q(reported_user__isnull=False) | models.Q(reported_post__isnull=False),
                name='report_has_target',
            ),
        ]

    def __str__(self):
        target = self.reported_user.username if self.reported_user_id else f'post#{self.reported_post_id}'
        return f'{self.reporter.username} -> {target}'
