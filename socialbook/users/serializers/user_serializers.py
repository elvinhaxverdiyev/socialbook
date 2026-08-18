from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from rest_framework import serializers

from users.serializers.avatar_serializers import AvatarSerializer
from users.utils.image_validation import validate_background_upload

User = get_user_model()


def _avatar_url(obj, context):
    avatar = getattr(obj, "profile_avatar", None)
    if not avatar or not avatar.image:
        return None
    request = context.get("request")
    url = avatar.image.url
    if request is not None:
        return request.build_absolute_uri(url)
    return url


# ---------------------------------------------------------
# USER
# ---------------------------------------------------------

class UserShortSerializer(serializers.ModelSerializer):
    """
    Başqa serializer-lər (Post, Comment və s.) daxilində nested istifadə üçün
    qısa istifadəçi məlumatı.
    """

    avatar = serializers.SerializerMethodField()

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

    def get_avatar(self, obj):
        return _avatar_url(obj, self.context)


class UserSerializer(serializers.ModelSerializer):
    """
    Profil səhifəsi üçün tam istifadəçi serializeri (oxu üçün).

    Performans qeydi: sayğaç sahələri (`*_count`) `User.objects.for_list(viewer)`
    ilə annotasiya edilmiş `_*_count` atributlarını, `is_following` isə
    `with_viewer_flags` ilə prefetch edilmiş `_viewer_follow_match` siyahısını
    oxuyur (N+1 olmadan); annotasiya yoxdursa modelin adi sorğusuna fallback edir.
    """

    avatar = serializers.SerializerMethodField()
    profile_avatar = AvatarSerializer(read_only=True)
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
            'profile_avatar',
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

    def get_avatar(self, obj):
        return _avatar_url(obj, self.context)

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

        annotated = getattr(obj, '_viewer_blocked_target', None)
        if annotated is not None:
            return bool(annotated)
        return request.user.blocked_users.filter(blocked_id=obj.pk).exists()

    def get_is_self(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.pk == request.user.pk
        return False

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if not self.get_is_self(instance):
            data.pop('email', None)
        return data


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Profil düzəlişi üçün (yalnız icazə verilən sahələr) —
    `ProfileEditModal`/`updateCurrentProfile` ilə uyğun.
    """

    profile_avatar_id = serializers.IntegerField(required=False, write_only=True, min_value=1)

    class Meta:
        model = User
        fields = [
            'username',
            'first_name',
            'last_name',
            'profile_avatar_id',
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

    def validate_backround_image(self, value):
        if not value:
            return value
        try:
            validate_background_upload(value)
        except ValidationError as exc:
            message = exc.messages[0] if getattr(exc, "messages", None) else str(exc)
            raise serializers.ValidationError(message) from exc
        return value

    def update(self, instance, validated_data):
        avatar_id = validated_data.pop("profile_avatar_id", None)
        user = super().update(instance, validated_data)

        if avatar_id is not None:
            from users.serializers.avatar_serializers import ProfileAvatarSelectSerializer

            select = ProfileAvatarSelectSerializer(
                data={"profile_avatar_id": avatar_id},
                context=self.context,
            )
            select.is_valid(raise_exception=True)
            user.profile_avatar_id = avatar_id
            user.save(update_fields=["profile_avatar", "updated_at"])

        return user
