from rest_framework import serializers

from users.models.notification_models import Notification
from users.serializers.user_serializers import UserShortSerializer


class NotificationSerializer(serializers.ModelSerializer):
    """
    `NotificationsPage` üçün bildiriş serializeri.
    """

    actor = UserShortSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id',
            'actor',
            'notification_type',
            'post',
            'text',
            'is_read',
            'created_at',
        ]
        read_only_fields = fields
