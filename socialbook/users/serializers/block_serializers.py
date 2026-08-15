from rest_framework import serializers

from users.models.block_models import BlockedUser
from users.serializers.user_serializers import UserShortSerializer


class BlockedUserSerializer(serializers.ModelSerializer):
    """
    `SettingsPage`-dəki bloklanmış istifadəçilər siyahısı.
    """

    blocked = UserShortSerializer(read_only=True)

    class Meta:
        model = BlockedUser
        fields = ['id', 'blocked', 'created_at']
        read_only_fields = fields
