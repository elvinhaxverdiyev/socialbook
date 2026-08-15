from django.conf import settings
from django.db import models


class BlockedUser(models.Model):
    """
    `blocker` istifadəçisi `blocked` istifadəçisini bloklayıb — bloklanan
    tərəfin postları/bildirişləri feed-də gizlədilir (bax `Post.objects.visible_to`).
    """

    blocker = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='blocked_users',
    )
    blocked = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='blocked_by',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('blocker', 'blocked')
        ordering = ['-created_at']
        constraints = [
            models.CheckConstraint(
                condition=~models.Q(blocker=models.F('blocked')),
                name='cannot_block_self',
            ),
        ]

    def __str__(self):
        return f'{self.blocker.username} blocked {self.blocked.username}'
