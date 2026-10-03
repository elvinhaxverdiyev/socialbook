from django.urls import path

from apis.stores_apis import (
    StoreDetailAPIView,
    StoreListAPIView,
    StorePostsAPIView,
    StoreUpdateAPIView,
)

urlpatterns = [
    path('stores/', StoreListAPIView.as_view(), name='store-list'),
    path('stores/<int:store_id>/', StoreDetailAPIView.as_view(), name='store-detail'),
    path('stores/<int:store_id>/update/', StoreUpdateAPIView.as_view(), name='store-update'),
    path('stores/<int:store_id>/posts/', StorePostsAPIView.as_view(), name='store-posts'),
]
