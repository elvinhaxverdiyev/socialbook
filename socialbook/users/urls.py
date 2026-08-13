from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

from apis.users_apis.user_v1_apis import UserListAPIView
from apis.users_apis.auth_v1_apis import (
    RegisterAPIView,
    LoginAPIView,
)
from apis.users_apis.shelf_theme_v1_apis import (
    MyShelfThemeAPIView,
    UserShelfThemeAPIView,
)


urlpatterns = [
    path(
        'users/',
        UserListAPIView.as_view(),
        name='user-list'
    ),
    path(
        'register/',
        RegisterAPIView.as_view(),
        name='register'
    ),
    path(
        'login/',
        LoginAPIView.as_view(),
        name='login'
    ),

    # Rəf teması
    path(
        'me/shelf-theme/',
        MyShelfThemeAPIView.as_view(),
        name='my-shelf-theme',
    ),
    path(
        'users/<str:username>/shelf-theme/',
        UserShelfThemeAPIView.as_view(),
        name='user-shelf-theme',
    ),

    # JWT autentifikasiya (giriş yalnız /login/ — email ilə)
    path(
        'token/refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'
    ),
    path(
        'token/verify/',
        TokenVerifyView.as_view(),
        name='token_verify'
    ),
]