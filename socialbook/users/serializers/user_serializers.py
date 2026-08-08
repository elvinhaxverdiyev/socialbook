from rest_framework import serializers

from users.models.users_models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "avatar",
            "bio",
            "is_email_verified",
            "created_at",
            "updated_at",
        ]