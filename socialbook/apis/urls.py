from django.urls import path

from apis.search_apis import SearchAPIView

urlpatterns = [
    path('search/', SearchAPIView.as_view(), name='search'),
]
