from rest_framework import serializers

from users.models.avatar_models import Avatar, AvatarKind


class AvatarSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Avatar
        fields = [
            "id",
            "kind",
            "label",
            "subtitle",
            "image",
            "sort_order",
        ]
        read_only_fields = fields

    def get_image(self, obj):
        if not obj.image:
            return None
        request = self.context.get("request")
        url = obj.image.url
        if request is not None:
            return request.build_absolute_uri(url)
        return url


class AvatarPresetListSerializer(AvatarSerializer):
    class Meta(AvatarSerializer.Meta):
        fields = [
            "id",
            "label",
            "subtitle",
            "image",
            "sort_order",
        ]


class ProfileAvatarSelectSerializer(serializers.Serializer):
    profile_avatar_id = serializers.IntegerField(min_value=1)

    def validate_profile_avatar_id(self, value):
        user = self.context["request"].user
        try:
            avatar = Avatar.objects.get(pk=value)
        except Avatar.DoesNotExist as exc:
            raise serializers.ValidationError("Avatar tapılmadı.") from exc

        if avatar.kind == AvatarKind.PRESET:
            if not avatar.is_active:
                raise serializers.ValidationError("Bu avatar aktiv deyil.")
            return value

        if avatar.kind == AvatarKind.UPLOAD and avatar.owner_id == user.pk:
            return value

        raise serializers.ValidationError("Bu avatarı seçmək icazəniz yoxdur.")
