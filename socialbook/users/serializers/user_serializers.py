from rest_framework import serializers
from django.contrib.auth import get_user_model

from books.models.book_models import Book
from users.models.users_models import Shelf  
from books.serializers.book_serializers import BookShortSerializer

User = get_user_model()


# ---------------------------------------------------------
# USER
# ---------------------------------------------------------

class UserShortSerializer(serializers.ModelSerializer):
    """
    Başqa serializer-lər (Post, Comment və s.) daxilində nested istifadə üçün
    qısa istifadəçi məlumatı.
    """

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'avatar',
            'current_status',
        ]


class UserSerializer(serializers.ModelSerializer):
    """
    Profil səhifəsi üçün tam istifadəçi serializeri (oxu üçün).
    """

    following_count = serializers.IntegerField(read_only=True)
    followers_count = serializers.IntegerField(read_only=True)
    posts_count = serializers.IntegerField(read_only=True)
    shelf_count = serializers.IntegerField(read_only=True)

    is_following = serializers.SerializerMethodField()
    is_self = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
            'avatar',
            'backround_image',
            'bio',
            'age',
            'is_email_verified',
            'current_status',
            'following_count',
            'followers_count',
            'posts_count',
            'shelf_count',
            'is_following',
            'is_self',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id', 'is_email_verified', 'created_at', 'updated_at',
        ]

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.followers.filter(pk=request.user.pk).exists()
        return False

    def get_is_self(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.pk == request.user.pk
        return False


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Profil düzəlişi üçün (yalnız icazə verilən sahələr).
    """

    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'avatar',
            'backround_image',
            'bio',
            'age',
            'current_status',
        ]


# ---------------------------------------------------------
# BOOK (Shelf daxilində nested göstəriş üçün qısa versiya)
# ---------------------------------------------------------

class ShelfBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'cover_image']


# ---------------------------------------------------------
# SHELF
# ---------------------------------------------------------

class ShelfSerializer(serializers.ModelSerializer):
    book = BookShortSerializer(read_only=True)
    book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(),
        source='book',
        write_only=True,
    )
    status_display = serializers.CharField(
        source='get_status_display', read_only=True
    )

    class Meta:
        model = Shelf
        fields = [
            'id',
            'book',
            'book_id',
            'status',
            'status_display',
            'added_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'added_at', 'updated_at']

    def create(self, validated_data):
        """
        unique_together = ('user', 'book') olduğu üçün eyni kitab üçün
        yeni status seçiləndə əvvəlkini əvəz edir.
        """
        request = self.context.get('request')
        user = request.user
        book = validated_data['book']
        status = validated_data['status']

        shelf, created = Shelf.objects.update_or_create(
            user=user,
            book=book,
            defaults={'status': status},
        )
        self.instance = shelf
        return shelf