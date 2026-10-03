import re

from django.core.exceptions import ValidationError
from rest_framework import serializers

from stores.models.store_models import Store
from users.utils.image_validation import validate_store_cover_upload

PHONE_RE = re.compile(r"^[+\d][\d\s().-]{1,29}$")


class StoreShortSerializer(serializers.ModelSerializer):
    """
    Post/elan daxilində nested istifadə üçün qısa mağaza məlumatı.
    """

    class Meta:
        model = Store
        fields = ['id', 'name', 'location', 'verified', 'cover_image']


class StoreSerializer(serializers.ModelSerializer):
    """
    Mağaza detalı səhifəsi üçün tam serializer.
    """

    books_count = serializers.SerializerMethodField()

    class Meta:
        model = Store
        fields = [
            'id',
            'name',
            'location',
            'description',
            'about',
            'books_count',
            'rating',
            'verified',
            'hours',
            'phone',
            'cover_image',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def get_books_count(self, obj):
        annotated = getattr(obj, '_books_count', None)
        return annotated if annotated is not None else obj.books_count


class StoreUpdateSerializer(serializers.ModelSerializer):
    """
    Mağaza profilinin yenilənməsi — `name`, ünvan, təsvir, iş saatı, telefon və cover.
    Reytinq, təsdiq və sahib buradan dəyişmir.
    """

    description = serializers.CharField(
        required=False, allow_blank=True, max_length=500,
    )
    about = serializers.CharField(
        required=False, allow_blank=True, max_length=2000,
    )
    cover_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Store
        fields = [
            'name',
            'location',
            'description',
            'about',
            'hours',
            'phone',
            'cover_image',
        ]
        extra_kwargs = {
            'name': {'required': False, 'allow_blank': False},
            'location': {'required': False, 'allow_blank': True},
            'hours': {'required': False, 'allow_blank': True},
            'phone': {'required': False, 'allow_blank': True},
        }

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Mağaza adı tələb olunur.")
        return value

    def validate_location(self, value):
        return value.strip()

    def validate_description(self, value):
        return value.strip()

    def validate_about(self, value):
        return value.strip()

    def validate_hours(self, value):
        return value.strip()

    def validate_phone(self, value):
        value = value.strip()
        if value and not PHONE_RE.fullmatch(value):
            raise serializers.ValidationError(
                "Telefon yalnız rəqəm, boşluq, +, -, ( və ) ola bilər.",
            )
        return value

    def validate_cover_image(self, value):
        if not value:
            return value
        try:
            validate_store_cover_upload(value)
        except ValidationError as exc:
            message = exc.messages[0] if getattr(exc, "messages", None) else str(exc)
            raise serializers.ValidationError(message) from exc
        return value

    def update(self, instance, validated_data):
        old_cover = instance.cover_image if instance.cover_image else None
        cover_replaced = 'cover_image' in validated_data
        store = super().update(instance, validated_data)

        if cover_replaced and old_cover and old_cover.name != store.cover_image.name:
            old_cover.delete(save=False)

        return store
