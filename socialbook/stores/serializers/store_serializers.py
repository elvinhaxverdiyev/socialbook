from rest_framework import serializers

from stores.models.store_models import Store


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
