from rest_framework.pagination import PageNumberPagination


class DefaultPagination(PageNumberPagination):
    """
    Feed/siyahı endpoint-ləri üçün standart səhifələmə.
    """

    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 50


class BookCatalogPagination(PageNumberPagination):
    """
    `BooksGrid` infinite-scroll ilə uyğun (12 kart/səhifə).
    """

    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 48
