from rest_framework import serializers
from users.serializers.user_serializers import UserShortSerializer
from books.serializers.book_serializers import BookShortSerializer
from books.models.book_models import Book
from users.models.user_posts import Post


class PostSerializer(serializers.ModelSerializer):
    user = UserShortSerializer(read_only=True)
    book = BookShortSerializer(read_only=True)
    book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(),
        source='book',
        write_only=True,
        required=False,
        allow_null=True,
    )

    post_type_display = serializers.CharField(
        source='get_post_type_display', read_only=True
    )

    likes_count = serializers.IntegerField(read_only=True)
    comments_count = serializers.IntegerField(read_only=True)

    is_liked = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id',
            'user',
            'post_type',
            'post_type_display',
            'text',
            'book',
            'book_id',
            'likes_count',
            'comments_count',
            'is_liked',
            'is_saved',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(pk=request.user.pk).exists()
        return False

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.saved_by.filter(pk=request.user.pk).exists()
        return False

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['user'] = request.user
        return super().create(validated_data)