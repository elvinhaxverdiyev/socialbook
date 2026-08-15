from rest_framework import serializers

from books.models.author_models import Author
from books.models.book_models import Book, Genre, Rating
from books.serializers.author_serializers import AuthorShortSerializer

# ---------------------------------------------------------
# GENRE
# ---------------------------------------------------------

class GenreSerializer(serializers.ModelSerializer):
    books_count = serializers.SerializerMethodField()

    class Meta:
        model = Genre
        fields = ['id', 'name', 'description', 'books_count']

    def get_books_count(self, obj):
        annotated = getattr(obj, '_books_count', None)
        return annotated if annotated is not None else obj.books_count


# ---------------------------------------------------------
# BOOK
# ---------------------------------------------------------

class BookShortSerializer(serializers.ModelSerializer):
    """
    Siyahılarda (shelf, post, search nəticələri) nested istifadə üçün
    qısa kitab məlumatı.
    """

    author = AuthorShortSerializer(read_only=True)
    author_name = serializers.CharField(read_only=True)

    class Meta:
        model = Book
        fields = [
            'id',
            'title',
            'author',
            'author_name',
            'cover_image',
        ]


class BookSerializer(serializers.ModelSerializer):
    """
    Kitab detalı səhifəsi üçün tam serializer.

    Performans qeydi: `average_rating`/`ratings_count`/`user_rating`/`is_on_shelf`
    sahələri list view-larda `Book.objects.for_list(user)` ilə annotasiya/prefetch
    edilmiş queryset-dən gələn `_average_rating`, `_ratings_count`,
    `_viewer_ratings`, `_viewer_shelf_items` atributlarını oxuyur (N+1 olmadan);
    annotasiya yoxdursa modeldəki adi sorğuya fallback edir (məs. detail view).
    """

    author = AuthorShortSerializer(read_only=True)
    author_id = serializers.PrimaryKeyRelatedField(
        queryset=Author.objects.all(),
        source='author',
        write_only=True,
        required=False,
        allow_null=True,
    )
    genres = GenreSerializer(many=True, read_only=True)
    genre_ids = serializers.PrimaryKeyRelatedField(
        queryset=Genre.objects.all(),
        source='genres',
        write_only=True,
        many=True,
        required=False,
    )
    language_display = serializers.CharField(
        source='get_language_display', read_only=True
    )
    book_type_display = serializers.CharField(
        source='get_book_type_display', read_only=True
    )

    average_rating = serializers.SerializerMethodField()
    ratings_count = serializers.SerializerMethodField()

    user_rating = serializers.SerializerMethodField()
    is_on_shelf = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = [
            'id',
            'title',
            'author',
            'author_id',
            'cover_image',
            'genres',
            'genre_ids',
            'book_type',
            'book_type_display',
            'year',
            'language',
            'language_display',
            'pages',
            'description',
            'average_rating',
            'ratings_count',
            'user_rating',
            'is_on_shelf',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def get_average_rating(self, obj):
        if hasattr(obj, '_average_rating'):
            value = obj._average_rating
            return round(value, 2) if value is not None else None
        return obj.average_rating

    def get_ratings_count(self, obj):
        annotated = getattr(obj, '_ratings_count', None)
        return annotated if annotated is not None else obj.ratings_count

    def get_user_rating(self, obj):
        request = self.context.get('request')
        if not (request and request.user.is_authenticated):
            return None

        viewer_ratings = getattr(obj, '_viewer_ratings', None)
        if viewer_ratings is not None:
            return viewer_ratings[0].score if viewer_ratings else None

        rating = obj.ratings.filter(user=request.user).first()
        return rating.score if rating else None

    def get_is_on_shelf(self, obj):
        request = self.context.get('request')
        if not (request and request.user.is_authenticated):
            return None

        viewer_shelf_items = getattr(obj, '_viewer_shelf_items', None)
        if viewer_shelf_items is not None:
            return viewer_shelf_items[0].status if viewer_shelf_items else None

        shelf_item = obj.shelf_items.filter(user=request.user).first()
        return shelf_item.status if shelf_item else None


# ---------------------------------------------------------
# RATING
# ---------------------------------------------------------

class RatingSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Rating
        fields = [
            'id',
            'user',
            'book',
            'score',
            'created_at',
        ]
        read_only_fields = ['id', 'user', 'created_at']

    def get_user(self, obj):
        # burda circular import olmasın deyə lokal import
        from users.serializers import UserShortSerializer
        return UserShortSerializer(obj.user, context=self.context).data

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        book = validated_data['book']
        score = validated_data['score']

        # unique_together = ('user', 'book') — mövcud reytinq varsa yenilə
        rating, created = Rating.objects.update_or_create(
            user=user,
            book=book,
            defaults={'score': score},
        )
        self.instance = rating
        return rating

    def validate_score(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError("Qiymət 1 ilə 5 arasında olmalıdır.")
        return value
