from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from socialbook.pagination import DefaultPagination
from users.serializers.user_serializers import UserSerializer
from users.utils import normalize_username

User = get_user_model()


class FollowAPIView(APIView):
    """
    POST/DELETE /api/v1/users/<username>/follow/ — `toggleFollow`.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        target = self._get_target(request, username)
        if isinstance(target, Response):
            return target

        target.followers.add(request.user)
        return Response(
            UserSerializer(target, context={'request': request}).data,
            status=status.HTTP_200_OK,
        )

    def delete(self, request, username):
        target = self._get_target(request, username)
        if isinstance(target, Response):
            return target

        target.followers.remove(request.user)
        return Response(
            UserSerializer(target, context={'request': request}).data,
            status=status.HTTP_200_OK,
        )

    def _get_target(self, request, username):
        clean = normalize_username(username)
        target = get_object_or_404(User, username__iexact=clean)
        if target.pk == request.user.pk:
            return Response(
                {"error": "Özünü izləyə bilməzsən."}, status=status.HTTP_400_BAD_REQUEST,
            )
        return target


class UserFollowersAPIView(APIView):
    """
    GET /api/v1/users/<username>/followers/
    """

    permission_classes = [AllowAny]

    def get(self, request, username):
        clean = normalize_username(username)
        user = get_object_or_404(User, username__iexact=clean)

        followers = user.followers.filter(is_active=True).for_list(request.user)

        paginator = DefaultPagination()
        page = paginator.paginate_queryset(followers, request, view=self)
        serializer = UserSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)


class UserFollowingAPIView(APIView):
    """
    GET /api/v1/users/<username>/following/
    """

    permission_classes = [AllowAny]

    def get(self, request, username):
        clean = normalize_username(username)
        user = get_object_or_404(User, username__iexact=clean)

        following = user.following.filter(is_active=True).for_list(request.user)

        paginator = DefaultPagination()
        page = paginator.paginate_queryset(following, request, view=self)
        serializer = UserSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)
