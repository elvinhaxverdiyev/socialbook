from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from socialbook.pagination import DefaultPagination
from users.models.user_posts import Post
from users.serializers.user_post_serializers import PostSerializer
from users.utils.block_utils import raise_if_post_blocked
from users.utils.notifications import create_notification


class PostListCreateAPIView(APIView):
    """
    GET  /api/v1/posts/?search=&post_type=   — ana feed (`HomePage`).
    POST /api/v1/posts/                       — yeni post (`Composer`).
    """

    def get_permissions(self):
        return [IsAuthenticated()] if self.request.method == 'POST' else [AllowAny()]

    def get(self, request):
        posts = Post.objects.for_feed(request.user)

        post_type = request.query_params.get('post_type')
        if post_type:
            posts = posts.filter(post_type=post_type)

        query = request.query_params.get('search', '').strip()
        if query:
            posts = posts.filter(
                Q(text__icontains=query)
                | Q(book__title__icontains=query)
                | Q(book__author__name__icontains=query)
                | Q(user__username__icontains=query)
                | Q(store__name__icontains=query)
            )

        paginator = DefaultPagination()
        page = paginator.paginate_queryset(posts, request, view=self)
        serializer = PostSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = PostSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        post = serializer.save()
        return Response(
            PostSerializer(post, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )


class PostDetailAPIView(APIView):
    """
    GET/PATCH/DELETE /api/v1/posts/<id>/ — sahibi redaktə/silə bilər.
    """

    def get_permissions(self):
        return [AllowAny()] if self.request.method == 'GET' else [IsAuthenticated()]

    def get(self, request, post_id):
        post = get_object_or_404(Post.objects.for_feed(request.user), pk=post_id)
        return Response(PostSerializer(post, context={'request': request}).data)

    def patch(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id)
        self._check_owner(request, post)

        serializer = PostSerializer(
            post, data=request.data, partial=True, context={'request': request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id)
        self._check_owner(request, post)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def _check_owner(self, request, post):
        if post.user_id != request.user.pk:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("Bu postu yalnız sahibi dəyişə bilər.")


class PostLikeAPIView(APIView):
    """
    POST/DELETE /api/v1/posts/<id>/like/
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(Post.objects.for_feed(request.user), pk=post_id)
        raise_if_post_blocked(request.user, post)

        if not post.likes.filter(pk=request.user.pk).exists():
            post.likes.add(request.user)
            if post.user_id:
                create_notification(
                    recipient=post.user,
                    actor=request.user,
                    notification_type='like',
                    text=f'{request.user.username} postunu bəyəndi.',
                    post=post,
                )

        return self._response(request, post)

    def delete(self, request, post_id):
        post = get_object_or_404(Post.objects.for_feed(request.user), pk=post_id)
        raise_if_post_blocked(request.user, post)
        post.likes.remove(request.user)
        return self._response(request, post)

    def _response(self, request, post):
        post = get_object_or_404(Post.objects.for_feed(request.user), pk=post.pk)
        return Response(PostSerializer(post, context={'request': request}).data)


class PostSaveAPIView(APIView):
    """
    POST/DELETE /api/v1/posts/<id>/save/ — `toggleSave` (öz postunu save edə bilməz).
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(Post.objects.for_feed(request.user), pk=post_id)
        raise_if_post_blocked(request.user, post)
        if post.user_id == request.user.pk:
            return Response(
                {"error": "Öz postunu yadda saxlaya bilməzsən."}, status=status.HTTP_400_BAD_REQUEST,
            )
        post.saved_by.add(request.user)
        return self._response(request, post)

    def delete(self, request, post_id):
        post = get_object_or_404(Post.objects.for_feed(request.user), pk=post_id)
        raise_if_post_blocked(request.user, post)
        post.saved_by.remove(request.user)
        return self._response(request, post)

    def _response(self, request, post):
        post = get_object_or_404(Post.objects.for_feed(request.user), pk=post.pk)
        return Response(PostSerializer(post, context={'request': request}).data)


class SavedPostListAPIView(APIView):
    """
    GET /api/v1/posts/saved/ — `SavedPage` (öz postları xaric).
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        posts = (
            Post.objects.for_feed(request.user)
            .filter(saved_by=request.user)
            .exclude(user=request.user)
        )

        paginator = DefaultPagination()
        page = paginator.paginate_queryset(posts, request, view=self)
        serializer = PostSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)
