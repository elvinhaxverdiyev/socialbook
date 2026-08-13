from rest_framework import serializers
from django.contrib.auth import get_user_model  

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
    shelf_theme = serializers.SerializerMethodField()

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
            'shelf_theme',
            'is_following',
            'is_self',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id', 'is_email_verified', 'created_at', 'updated_at',
        ]

    def get_shelf_theme(self, obj):
        from users.shelf_theme import sanitize_shelf_theme

        return sanitize_shelf_theme(obj.shelf_theme)

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


