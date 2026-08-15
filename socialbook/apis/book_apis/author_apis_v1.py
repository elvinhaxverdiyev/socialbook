from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from books.models.author_models import Author
from books.models.book_models import Book
from books.serializers.author_serializers import AuthorSerializer
from books.serializers.book_serializers import BookSerializer
from socialbook.pagination import BookCatalogPagination, DefaultPagination


class AuthorListAPIView(APIView):
    """
    GET /api/v1/authors/?q= — müəllif axtarışı (`searchAuthors`).
    """

    permission_classes = [AllowAny]

    def get(self, request):
        authors = Author.objects.annotate(_books_count=Count('books', distinct=True))

        query = request.query_params.get('q', '').strip()
        if query:
            authors = authors.filter(
                Q(name__icontains=query) | Q(bio__icontains=query) | Q(country__icontains=query)
            )

        paginator = DefaultPagination()
        page = paginator.paginate_queryset(authors, request, view=self)
        serializer = AuthorSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)


class AuthorDetailAPIView(APIView):
    """
    GET /api/v1/authors/<id>/ — `AuthorPage`.
    """

    permission_classes = [AllowAny]

    def get(self, request, author_id):
        author = get_object_or_404(
            Author.objects.annotate(_books_count=Count('books', distinct=True)), pk=author_id,
        )
        return Response(AuthorSerializer(author, context={'request': request}).data)


class AuthorBooksAPIView(APIView):
    """
    GET /api/v1/authors/<id>/books/
    """

    permission_classes = [AllowAny]

    def get(self, request, author_id):
        get_object_or_404(Author, pk=author_id)
        books = Book.objects.filter(author_id=author_id).for_list(request.user)

        paginator = BookCatalogPagination()
        page = paginator.paginate_queryset(books, request, view=self)
        serializer = BookSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)
