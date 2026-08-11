from rest_framework import serializers
from django.conf import settings

from books.models.book_models import Book, Genre, Rating

# ---------------------------------------------------------
# GENRE
# ---------------------------------------------------------

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']  # real sahələrə uyğun düzəlt


# ---------------------------------------------------------
# BOOK
# ---------------------------------------------------------

class BookShortSerializer(serializers.ModelSerializer):
    """
    Siyahılarda (shelf, post, search nəticələri) nested istifadə üçün
    qısa kitab məlumatı.
    """

    class Meta:
        model = Book
        fields = [
            'id',
            'title',
            'author',
            'cover_image',
        ]


class BookSerializer(serializers.ModelSerializer):
    """
    Kitab detalı səhifəsi üçün tam serializer.
    """
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

    average_rating = serializers.FloatField(read_only=True)
    ratings_count = serializers.IntegerField(read_only=True)

    user_rating = serializers.SerializerMethodField()
    is_on_shelf = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = [
            'id',
            'title',
            'author',
            'cover_image',
            'genres',
            'genre_ids',
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

    def get_user_rating(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            rating = obj.ratings.filter(user=request.user).first()
            return rating.score if rating else None
        return None

    def get_is_on_shelf(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            shelf_item = obj.shelf_items.filter(user=request.user).first()
            return shelf_item.status if shelf_item else None
        return None


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