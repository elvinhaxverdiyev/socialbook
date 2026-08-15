from django.db.models import Count
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from books.models.book_models import Book
from books.models.genre_models import Genre
from books.serializers.book_serializers import BookSerializer, GenreSerializer
from socialbook.pagination import BookCatalogPagination


class GenreListAPIView(APIView):
    """
    GET /api/v1/genres/ — `GenresPage`.
    """

    permission_classes = [AllowAny]

    def get(self, request):
        genres = Genre.objects.annotate(_books_count=Count('books', distinct=True))
        serializer = GenreSerializer(genres, many=True, context={'request': request})
        return Response(serializer.data)


class GenreBooksAPIView(APIView):
    """
    GET /api/v1/genres/<id>/books/ — janra görə kitablar.
    """

    permission_classes = [AllowAny]

    def get(self, request, genre_id):
        get_object_or_404(Genre, pk=genre_id)
        books = Book.objects.filter(genres__id=genre_id)
        books = Book.objects.filter(pk__in=books.values('pk')).for_list(request.user)

        paginator = BookCatalogPagination()
        page = paginator.paginate_queryset(books, request, view=self)
        serializer = BookSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)
