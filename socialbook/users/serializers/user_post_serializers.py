from rest_framework import serializers

from books.models.book_models import Book, Genre, Rating
from books.serializers.book_serializers import BookShortSerializer, GenreSerializer
from stores.serializers.store_serializers import StoreShortSerializer
from users.models.user_posts import Post
from users.serializers.user_serializers import UserShortSerializer

# Composer-in tələb etdiyi sahələr tip üzrə (bax `Composer.jsx`/`security.js`).
# `sale` postunda kitab yalnız kataloqdan (`Book`) seçilir — rəf elementinin
# öz `id`-si yox, onun göstərdiyi kitabın `id`-si göndərilməlidir.
TYPES_REQUIRING_BOOK = {'reading', 'finished', 'sale'}
TYPES_REQUIRING_SALE_FIELDS = {'sale', 'store'}


class PostSerializer(serializers.ModelSerializer):
    """
    Performans qeydi: `likes_count`/`comments_count`/`is_liked`/`is_saved`
    `Post.objects.for_feed(viewer)` ilə annotasiya/prefetch edilmiş
    `_likes_count`, `_comments_count`, `_viewer_like_match`,
    `_viewer_save_match` atributlarını oxuyur (N+1 olmadan); annotasiya
    yoxdursa modelin adi sorğusuna fallback edir (məs. tək post detalı).
    """

    user = UserShortSerializer(read_only=True)
    store = StoreShortSerializer(read_only=True)
    book = BookShortSerializer(read_only=True)
    category = GenreSerializer(read_only=True)

    book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(),
        source='book',
        write_only=True,
        required=False,
        allow_null=True,
    )
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Genre.objects.all(),
        source='category',
        write_only=True,
        required=False,
        allow_null=True,
    )
    store_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    post_type_display = serializers.CharField(
        source='get_post_type_display', read_only=True
    )
    condition_display = serializers.CharField(
        source='get_condition_display', read_only=True
    )

    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()

    is_liked = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id',
            'user',
            'store',
            'store_id',
            'post_type',
            'post_type_display',
            'text',
            'book',
            'book_id',
            'price',
            'condition',
            'condition_display',
            'category',
            'category_id',
            'rating',
            'likes_count',
            'comments_count',
            'is_liked',
            'is_saved',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def get_likes_count(self, obj):
        annotated = getattr(obj, '_likes_count', None)
        return annotated if annotated is not None else obj.likes_count

    def get_comments_count(self, obj):
        annotated = getattr(obj, '_comments_count', None)
        return annotated if annotated is not None else obj.comments_count

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if not (request and request.user.is_authenticated):
            return False

        match = getattr(obj, '_viewer_like_match', None)
        if match is not None:
            return bool(match)
        return obj.likes.filter(pk=request.user.pk).exists()

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if not (request and request.user.is_authenticated):
            return False

        match = getattr(obj, '_viewer_save_match', None)
        if match is not None:
            return bool(match)
        return obj.saved_by.filter(pk=request.user.pk).exists()

    def validate(self, attrs):
        post_type = attrs.get('post_type', getattr(self.instance, 'post_type', 'general'))

        if post_type in TYPES_REQUIRING_BOOK and not attrs.get('book', getattr(self.instance, 'book', None)):
            raise serializers.ValidationError(
                {'book_id': f"'{post_type}' postu üçün kitab tələb olunur."}
            )

        if post_type in TYPES_REQUIRING_SALE_FIELDS:
            for field in ('price', 'condition'):
                if not attrs.get(field, getattr(self.instance, field, None)):
                    raise serializers.ValidationError(
                        {field: "Satış elanı üçün bu sahə tələb olunur."}
                    )

        if post_type == 'store':
            store_id = attrs.get('store_id')
            if not store_id and not getattr(self.instance, 'store_id', None):
                raise serializers.ValidationError(
                    {'store_id': "Mağaza postu üçün mağaza tələb olunur."}
                )
        else:
            attrs.pop('store_id', None)

        if post_type != 'finished':
            attrs['rating'] = None

        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        store_id = validated_data.pop('store_id', None)

        if validated_data.get('post_type') == 'store':
            from stores.models.store_models import Store

            validated_data['store'] = Store.objects.get(pk=store_id)
        else:
            validated_data['user'] = request.user

        post = super().create(validated_data)
        self._sync_book_rating(post)
        return post

    def update(self, instance, validated_data):
        validated_data.pop('store_id', None)
        post = super().update(instance, validated_data)
        self._sync_book_rating(post)
        return post

    def _sync_book_rating(self, post):
        """`Bitirdim` postunda verilən qiymət kitabın Rating-ində də əks olunur."""
        if post.post_type == 'finished' and post.rating and post.book_id and post.user_id:
            Rating.objects.update_or_create(
                user=post.user, book=post.book, defaults={'score': post.rating},
            )
