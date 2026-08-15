from django.db.models import Count, Q
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from books.models.author_models import Author
from books.models.book_models import Book
from books.serializers.author_serializers import AuthorShortSerializer
from books.serializers.book_serializers import BookShortSerializer


class SearchAPIView(APIView):
    """
    GET /api/v1/search/?q= — `Sidebar` axtarış overlay-i:
    ilk 5 kitab + ilk 4 müəllif (frontend limitləri ilə uyğun).
    """

    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({'books': [], 'authors': []})

        books = Book.objects.filter(
            Q(title__icontains=query)
            | Q(author__name__icontains=query)
            | Q(description__icontains=query)
            | Q(genres__name__icontains=query)
        ).select_related('author').distinct()[:5]

        authors = Author.objects.filter(
            Q(name__icontains=query) | Q(bio__icontains=query) | Q(country__icontains=query)
        ).annotate(_books_count=Count('books', distinct=True))[:4]

        return Response({
            'books': BookShortSerializer(books, many=True, context={'request': request}).data,
            'authors': AuthorShortSerializer(authors, many=True, context={'request': request}).data,
        })
