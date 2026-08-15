import random

from django.contrib.auth import get_user_model
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from socialbook.pagination import DefaultPagination
from users.serializers.user_serializers import UserSerializer, UserUpdateSerializer
from users.utils import normalize_username

User = get_user_model()


class UserListAPIView(APIView):
    """
    GET /api/v1/users/?q=  — sadə axtarış + səhifələmə.
    """

    permission_classes = [AllowAny]

    def get(self, request):
        users = User.objects.filter(is_active=True).for_list(request.user)

        query = request.query_params.get('q', '').strip()
        if query:
            users = users.filter(
                Q(username__icontains=query) | Q(first_name__icontains=query) | Q(last_name__icontains=query)
            )

        paginator = DefaultPagination()
        page = paginator.paginate_queryset(users, request, view=self)
        serializer = UserSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)


class MeAPIView(APIView):
    """
    GET/PATCH /api/v1/me/ — cari istifadəçinin öz profili.
    """

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            UserSerializer(user, context={'request': request}).data,
            status=status.HTTP_200_OK,
        )


class UserDetailAPIView(APIView):
    """
    GET /api/v1/users/<username>/ — public profil (`UserProfilePage`).
    """

    permission_classes = [AllowAny]

    def get(self, request, username):
        clean = normalize_username(username)
        if not clean:
            return Response(
                {"error": "İstifadəçi adı tələb olunur."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = get_object_or_404(
            User.objects.for_list(request.user), username__iexact=clean,
        )
        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data)


class UserPostsAPIView(APIView):
    """
    GET /api/v1/users/<username>/posts/ — `ProfilePage` postları.
    """

    permission_classes = [AllowAny]

    def get(self, request, username):
        clean = normalize_username(username)
        user = get_object_or_404(User, username__iexact=clean)

        from users.models.user_posts import Post
        from users.serializers.user_post_serializers import PostSerializer

        posts = Post.objects.filter(user=user).for_feed(request.user)

        paginator = DefaultPagination()
        page = paginator.paginate_queryset(posts, request, view=self)
        serializer = PostSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)


class UserSuggestionsAPIView(APIView):
    """
    GET /api/v1/users/suggestions/?limit=3 — `RightPanel` izləmə təklifləri.
    Özünü, izlədiklərini və bloklananları çıxarır.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        limit = min(int(request.query_params.get('limit', 3) or 3), 20)

        excluded_ids = {request.user.pk}
        excluded_ids.update(request.user.following.values_list('pk', flat=True))
        excluded_ids.update(request.user.blocked_users.values_list('blocked_id', flat=True))
        excluded_ids.update(request.user.blocked_by.values_list('blocker_id', flat=True))

        pool = list(
            User.objects.filter(is_active=True)
            .exclude(pk__in=excluded_ids)
            .for_list(request.user)
        )
        sample = random.sample(pool, min(limit, len(pool)))

        serializer = UserSerializer(sample, many=True, context={'request': request})
        return Response(serializer.data)
