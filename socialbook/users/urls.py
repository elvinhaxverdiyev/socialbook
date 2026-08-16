from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

from apis.users_apis import (
    BlockedUserListAPIView,
    BlockUserAPIView,
    CommentDetailAPIView,
    CommentLikeAPIView,
    CommentListCreateAPIView,
    FollowAPIView,
    LoginAPIView,
    MeAPIView,
    MyShelfThemeAPIView,
    NotificationDeleteAPIView,
    NotificationListAPIView,
    NotificationMarkAllReadAPIView,
    NotificationMarkReadAPIView,
    PostDetailAPIView,
    PostLikeAPIView,
    PostListCreateAPIView,
    PostSaveAPIView,
    RegisterAPIView,
    ReportPostAPIView,
    ReportUserAPIView,
    SavedPostListAPIView,
    UserDetailAPIView,
    UserFollowersAPIView,
    UserFollowingAPIView,
    UserListAPIView,
    UserPostsAPIView,
    UserShelfThemeAPIView,
    UserSuggestionsAPIView,
)


urlpatterns = [
    # Autentifikasiya
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # Cari istifadəçi
    path('me/', MeAPIView.as_view(), name='me'),
    path('me/shelf-theme/', MyShelfThemeAPIView.as_view(), name='my-shelf-theme'),

    # İstifadəçilər
    path('users/', UserListAPIView.as_view(), name='user-list'),
    path('users/suggestions/', UserSuggestionsAPIView.as_view(), name='user-suggestions'),
    path('users/blocked/', BlockedUserListAPIView.as_view(), name='blocked-user-list'),
    path('users/<str:username>/', UserDetailAPIView.as_view(), name='user-detail'),
    path('users/<str:username>/posts/', UserPostsAPIView.as_view(), name='user-posts'),
    path('users/<str:username>/followers/', UserFollowersAPIView.as_view(), name='user-followers'),
    path('users/<str:username>/following/', UserFollowingAPIView.as_view(), name='user-following'),
    path('users/<str:username>/follow/', FollowAPIView.as_view(), name='user-follow'),
    path('users/<str:username>/block/', BlockUserAPIView.as_view(), name='user-block'),
    path('users/<str:username>/report/', ReportUserAPIView.as_view(), name='user-report'),
    path('users/<str:username>/shelf-theme/', UserShelfThemeAPIView.as_view(), name='user-shelf-theme'),

    # Postlar
    path('posts/', PostListCreateAPIView.as_view(), name='post-list-create'),
    path('posts/saved/', SavedPostListAPIView.as_view(), name='post-saved-list'),
    path('posts/<int:post_id>/', PostDetailAPIView.as_view(), name='post-detail'),
    path('posts/<int:post_id>/like/', PostLikeAPIView.as_view(), name='post-like'),
    path('posts/<int:post_id>/save/', PostSaveAPIView.as_view(), name='post-save'),
    path('posts/<int:post_id>/report/', ReportPostAPIView.as_view(), name='post-report'),

    # Şərhlər
    path('posts/<int:post_id>/comments/', CommentListCreateAPIView.as_view(), name='comment-list-create'),
    path(
        'posts/<int:post_id>/comments/<int:comment_id>/',
        CommentDetailAPIView.as_view(),
        name='comment-detail',
    ),
    path(
        'posts/<int:post_id>/comments/<int:comment_id>/like/',
        CommentLikeAPIView.as_view(),
        name='comment-like',
    ),

    # Bildirişlər
    path('notifications/', NotificationListAPIView.as_view(), name='notification-list'),
    path('notifications/read-all/', NotificationMarkAllReadAPIView.as_view(), name='notification-read-all'),
    path('notifications/<int:notification_id>/read/', NotificationMarkReadAPIView.as_view(), name='notification-read'),
    path('notifications/<int:notification_id>/', NotificationDeleteAPIView.as_view(), name='notification-delete'),
]
