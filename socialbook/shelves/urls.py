from django.urls import path

from apis.shelves_apis import MyShelfDetailAPIView, MyShelfListCreateAPIView, UserShelfListAPIView

urlpatterns = [
    path('shelf/', MyShelfListCreateAPIView.as_view(), name='my-shelf-list-create'),
    path('shelf/<int:shelf_id>/', MyShelfDetailAPIView.as_view(), name='my-shelf-detail'),
    path('users/<str:username>/shelf/', UserShelfListAPIView.as_view(), name='user-shelf-list'),
]
