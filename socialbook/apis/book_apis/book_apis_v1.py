from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from books.models.book_models import Book
from books.serializers.book_serializers import BookSerializer, RatingSerializer
from books.utils.choices import BOOK_TYPE_CHOICES
from socialbook.pagination import BookCatalogPagination, DefaultPagination

SORT_FIELDS = {
    'rating': '-_average_rating',
    'year': '-year',
    'title': 'title',
}


class BookListAPIView(APIView):
    """
    GET /api/v1/books/?q=&genre=&type=&sort=&page=&page_size= — kataloq (`BooksPage`).
    """

    permission_classes = [AllowAny]

    def get(self, request):
        # Filtrləmə (genres M2M join daxil) ayrıca, aggregate annotasiyasız
        # queryset üzərində aparılır — əks halda `with_ratings()`-dəki
        # Avg/Count JOIN çoxalmasından səhv nəticə verər.
        matching_ids = Book.objects.all()

        query = request.query_params.get('q', '').strip()
        if query:
            matching_ids = matching_ids.filter(
                Q(title__icontains=query)
                | Q(author__name__icontains=query)
                | Q(description__icontains=query)
                | Q(genres__name__icontains=query)
            )

        genre = request.query_params.get('genre')
        if genre:
            matching_ids = matching_ids.filter(genres__id=genre)

        book_type = request.query_params.get('type')
        if book_type:
            matching_ids = matching_ids.filter(book_type=book_type)

        books = Book.objects.filter(
            pk__in=matching_ids.values('pk'),
        ).for_list(request.user)

        sort = SORT_FIELDS.get(request.query_params.get('sort'), '-created_at')
        books = books.order_by(sort)

        paginator = BookCatalogPagination()
        page = paginator.paginate_queryset(books, request, view=self)
        serializer = BookSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)


class BookDetailAPIView(APIView):
    """
    GET /api/v1/books/<id>/ — kitab detalı.
    """

    permission_classes = [AllowAny]

    def get(self, request, book_id):
        book = get_object_or_404(Book.objects.for_list(request.user), pk=book_id)
        return Response(BookSerializer(book, context={'request': request}).data)


class BookTrendingAPIView(APIView):
    """
    GET /api/v1/books/trending/?limit=4 — ən yüksək reytinqli kitablar.
    """

    permission_classes = [AllowAny]

    def get(self, request):
        limit = min(int(request.query_params.get('limit', 4) or 4), 20)
        books = Book.objects.for_list(request.user).order_by(
            '-_average_rating', '-_ratings_count',
        )[:limit]
        serializer = BookSerializer(books, many=True, context={'request': request})
        return Response(serializer.data)


class BookRateAPIView(APIView):
    """
    POST /api/v1/books/<id>/rate/  { score } — reytinq ver/yenilə.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, book_id):
        book = get_object_or_404(Book, pk=book_id)
        serializer = RatingSerializer(
            data={**request.data, 'book': book.pk}, context={'request': request},
        )
        serializer.is_valid(raise_exception=True)
        rating = serializer.save()
        return Response(
            RatingSerializer(rating, context={'request': request}).data,
            status=status.HTTP_200_OK,
        )


class BookTypeListAPIView(APIView):
    """
    GET /api/v1/book-types/ — `bookTypes` sabit siyahısı (filter üçün).
    """

    permission_classes = [AllowAny]

    def get(self, request):
        return Response(
            [{'id': value, 'label': label} for value, label in BOOK_TYPE_CHOICES]
        )


class BookPostsAPIView(APIView):
    """
    GET /api/v1/books/<id>/posts/?post_type=store — kitab detalı səhifəsi.
    `post_type` vergüllə bir neçə tip qəbul edir və səhifədəki tabları verir:
    `store` (kitabın olduğu mağaza elanları), `sale` (ikinci əl elanları),
    parametrsiz isə bütün postlar (`Bu kitab haqqında`).
    """

    permission_classes = [AllowAny]

    def get(self, request, book_id):
        from users.models.user_posts import Post
        from users.serializers.user_post_serializers import PostSerializer

        get_object_or_404(Book, pk=book_id)
        posts = Post.objects.filter(book_id=book_id).for_feed(request.user)

        post_type = request.query_params.get('post_type', '').strip()
        if post_type:
            types = [item for item in post_type.split(',') if item.strip()]
            posts = posts.filter(post_type__in=types)

        paginator = DefaultPagination()
        page = paginator.paginate_queryset(posts, request, view=self)
        serializer = PostSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)
