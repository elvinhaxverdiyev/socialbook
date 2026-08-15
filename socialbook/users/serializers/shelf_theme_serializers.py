import uuid

from rest_framework import serializers

from users.shelf_theme import (
    SHELF_PLANK_PRESETS,
    SHELF_SECTION_KEYS,
    SHELF_STICKER_OPTIONS,
    SHELF_WALL_PRESETS,
    clamp_sticker_position,
    sanitize_shelf_theme,
)


class ShelfStickerSerializer(serializers.Serializer):
    id = serializers.RegexField(
        regex=r"^[\w-]{1,48}$",
        required=False,
        allow_blank=False,
    )
    emoji = serializers.ChoiceField(choices=SHELF_STICKER_OPTIONS)
    x = serializers.IntegerField(min_value=0, max_value=100)
    y = serializers.IntegerField(min_value=0, max_value=100)

    def validate(self, attrs):
        pos = clamp_sticker_position(attrs["x"], attrs["y"])
        attrs["x"] = max(6, min(94, pos["x"]))
        attrs["y"] = max(6, min(88, pos["y"]))
        if not attrs.get("id"):
            attrs["id"] = f"st-{uuid.uuid4().hex[:16]}"
        return attrs


class ShelfSectionThemeSerializer(serializers.Serializer):
    """
    Tək bölmə (`reading`/`finished`/`want`) teması — frontend ilə eyni
    camelCase format.
    """

    wallColor = serializers.ChoiceField(choices=SHELF_WALL_PRESETS)
    plankColor = serializers.ChoiceField(choices=SHELF_PLANK_PRESETS)
    stickers = ShelfStickerSerializer(many=True, required=False, default=list)

    def validate_stickers(self, stickers):
        emojis = [item["emoji"] for item in stickers]
        if len(emojis) != len(set(emojis)):
            raise serializers.ValidationError("Eyni stiker bir dəfədən artıq ola bilməz.")
        if len(stickers) > len(SHELF_STICKER_OPTIONS):
            raise serializers.ValidationError("Stiker sayı limitdən artıqdır.")
        return stickers


class ShelfThemeSerializer(serializers.Serializer):
    """
    Bütün rəf teması — `{ sections: { reading, finished, want } }`.
    Çıxışda/daxilə alınan datada həmişə bu üç açar sanitize edilərək təmin
    olunur (bax `sanitize_shelf_theme`), ona görə `to_representation` və
    `create`/`update` birbaşa ora yönləndirir.
    """

    sections = serializers.DictField(
        child=ShelfSectionThemeSerializer(),
        required=False,
    )

    def validate_sections(self, sections):
        unknown = set(sections.keys()) - set(SHELF_SECTION_KEYS)
        if unknown:
            raise serializers.ValidationError(
                f"Naməlum rəf bölməsi: {', '.join(sorted(unknown))}"
            )
        return sections

    def to_internal_value(self, data):
        attrs = super().to_internal_value(data)
        return sanitize_shelf_theme(attrs)

    def to_representation(self, instance):
        if isinstance(instance, dict):
            return sanitize_shelf_theme(instance)
        return sanitize_shelf_theme(getattr(instance, "shelf_theme", None))

    def create(self, validated_data):
        return sanitize_shelf_theme(validated_data)

    def update(self, instance, validated_data):
        return sanitize_shelf_theme(validated_data)
