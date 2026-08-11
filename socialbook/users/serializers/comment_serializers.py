from rest_framework import serializers

from users.models.comment_models import Comment


class CommentSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(
        source='user.username',
        read_only=True,
    )

    class Meta:
        model = Comment
        fields = [
            'id',
            'post',
            'user',
            'user_username',
            'text',
            'created_at',
        ]
        read_only_fields = [
            'id',
            'user',
            'post',
            'created_at',
        ]