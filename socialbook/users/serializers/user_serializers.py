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

    Performans qeydi: sayğaç sahələri (`*_count`) `User.objects.for_list(viewer)`
    ilə annotasiya edilmiş `_*_count` atributlarını, `is_following` isə
    `with_viewer_flags` ilə prefetch edilmiş `_viewer_follow_match` siyahısını
    oxuyur (N+1 olmadan); annotasiya yoxdursa modelin adi sorğusuna fallback edir.
    """

    following_count = serializers.SerializerMethodField()
    followers_count = serializers.SerializerMethodField()
    posts_count = serializers.SerializerMethodField()
    shelf_count = serializers.SerializerMethodField()
    shelf_theme = serializers.SerializerMethodField()

    is_following = serializers.SerializerMethodField()
    is_blocked = serializers.SerializerMethodField()
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
            'avatar_preset_id',
            'backround_image',
            'bio',
            'age',
            'gender',
            'is_email_verified',
            'current_status',
            'following_count',
            'followers_count',
            'posts_count',
            'shelf_count',
            'shelf_theme',
            'is_following',
            'is_blocked',
            'is_self',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id', 'is_email_verified', 'created_at', 'updated_at',
        ]

    def _annotated_or(self, obj, attr, fallback_attr):
        value = getattr(obj, attr, None)
        return value if value is not None else getattr(obj, fallback_attr)

    def get_following_count(self, obj):
        return self._annotated_or(obj, '_following_count', 'following_count')

    def get_followers_count(self, obj):
        return self._annotated_or(obj, '_followers_count', 'followers_count')

    def get_posts_count(self, obj):
        return self._annotated_or(obj, '_posts_count', 'posts_count')

    def get_shelf_count(self, obj):
        return self._annotated_or(obj, '_shelf_count', 'shelf_count')

    def get_shelf_theme(self, obj):
        from users.shelf_theme import sanitize_shelf_theme

        return sanitize_shelf_theme(obj.shelf_theme)

    def get_is_following(self, obj):
        request = self.context.get('request')
        if not (request and request.user.is_authenticated):
            return False

        match = getattr(obj, '_viewer_follow_match', None)
        if match is not None:
            return bool(match)
        return obj.followers.filter(pk=request.user.pk).exists()

    def get_is_blocked(self, obj):
        request = self.context.get('request')
        if not (request and request.user.is_authenticated):
            return False
        return request.user.blocked_users.filter(blocked_id=obj.pk).exists()

    def get_is_self(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.pk == request.user.pk
        return False


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Profil düzəlişi üçün (yalnız icazə verilən sahələr) —
    `ProfileEditModal`/`updateCurrentProfile` ilə uyğun.
    """

    class Meta:
        model = User
        fields = [
            'username',
            'first_name',
            'last_name',
            'avatar',
            'avatar_preset_id',
            'backround_image',
            'bio',
            'age',
            'gender',
            'current_status',
        ]

    def validate_username(self, value):
        qs = User.objects.filter(username__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Bu istifadəçi adı artıq mövcuddur.")
        return value
