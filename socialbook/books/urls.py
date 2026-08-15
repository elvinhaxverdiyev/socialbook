from django.urls import path

from apis.book_apis import (
    AuthorBooksAPIView,
    AuthorDetailAPIView,
    AuthorListAPIView,
    BookDetailAPIView,
    BookListAPIView,
    BookPostsAPIView,
    BookRateAPIView,
    BookTrendingAPIView,
    BookTypeListAPIView,
    GenreBooksAPIView,
    GenreListAPIView,
)

urlpatterns = [
    path('books/', BookListAPIView.as_view(), name='book-list'),
    path('books/trending/', BookTrendingAPIView.as_view(), name='book-trending'),
    path('books/<int:book_id>/', BookDetailAPIView.as_view(), name='book-detail'),
    path('books/<int:book_id>/rate/', BookRateAPIView.as_view(), name='book-rate'),
    path('books/<int:book_id>/posts/', BookPostsAPIView.as_view(), name='book-posts'),

    path('book-types/', BookTypeListAPIView.as_view(), name='book-type-list'),

    path('genres/', GenreListAPIView.as_view(), name='genre-list'),
    path('genres/<int:genre_id>/books/', GenreBooksAPIView.as_view(), name='genre-books'),

    path('authors/', AuthorListAPIView.as_view(), name='author-list'),
    path('authors/<int:author_id>/', AuthorDetailAPIView.as_view(), name='author-detail'),
    path('authors/<int:author_id>/books/', AuthorBooksAPIView.as_view(), name='author-books'),
]
