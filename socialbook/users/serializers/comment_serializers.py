from rest_framework import serializers

from users.models.comment_models import Comment
from users.serializers.user_serializers import UserShortSerializer


class CommentSerializer(serializers.ModelSerializer):
    """
    Performans qeydi: `likes_count`/`is_liked` `Comment.objects.for_list(viewer)`
    ilə annotasiya/prefetch edilmiş `_likes_count`/`_viewer_like_match`
    atributlarını oxuyur (N+1 olmadan).
    """

    user = UserShortSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id',
            'post',
            'user',
            'text',
            'likes_count',
            'is_liked',
            'created_at',
        ]
        read_only_fields = [
            'id',
            'user',
            'post',
            'created_at',
        ]

    def get_likes_count(self, obj):
        annotated = getattr(obj, '_likes_count', None)
        return annotated if annotated is not None else obj.likes_count

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if not (request and request.user.is_authenticated):
            return False

        match = getattr(obj, '_viewer_like_match', None)
        if match is not None:
            return bool(match)
        return obj.likes.filter(pk=request.user.pk).exists()

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['user'] = request.user
        validated_data['post'] = self.context['post']
        return super().create(validated_data)
