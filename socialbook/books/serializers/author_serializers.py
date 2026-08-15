from rest_framework import serializers

from books.models.author_models import Author


class AuthorShortSerializer(serializers.ModelSerializer):
    """
    Kitab/post daxilində nested istifadə üçün qısa müəllif məlumatı.
    """

    class Meta:
        model = Author
        fields = ['id', 'name', 'slug', 'cover_image']


class AuthorSerializer(serializers.ModelSerializer):
    """
    Müəllif səhifəsi üçün tam serializer.
    """

    books_count = serializers.SerializerMethodField()

    class Meta:
        model = Author
        fields = [
            'id',
            'name',
            'slug',
            'bio',
            'country',
            'cover_image',
            'books_count',
            'created_at',
        ]
        read_only_fields = ['id', 'slug', 'created_at']

    def get_books_count(self, obj):
        annotated = getattr(obj, '_books_count', None)
        return annotated if annotated is not None else obj.books_count
