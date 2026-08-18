from users.models.notification_models import Notification


def create_notification(*, recipient, actor, notification_type, text, post=None):
    if not recipient or not actor or recipient.pk == actor.pk:
        return None

    return Notification.objects.create(
        recipient=recipient,
        actor=actor,
        notification_type=notification_type,
        text=text[:255],
        post=post,
    )
