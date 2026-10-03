from django.contrib import admin

from books.models.author_models import Author
from books.models.book_models import Book, Rating
from books.models.genre_models import Genre


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    """Kataloq bazaya sayt tərəfindən buradan yüklənir (istifadəçi kitab yarada bilmir)."""

    list_display = ('title', 'author', 'book_type', 'year', 'language', 'created_at')
    list_filter = ('book_type', 'language', 'genres')
    search_fields = ('title', 'author__name', 'description')
    autocomplete_fields = ('author',)
    filter_horizontal = ('genres',)


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'created_at')
    search_fields = ('name', 'bio', 'country')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ('book', 'user', 'score', 'created_at')
    list_filter = ('score',)
    search_fields = ('book__title', 'user__username')
