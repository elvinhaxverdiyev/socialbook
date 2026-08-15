from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from socialbook.pagination import DefaultPagination
from users.models.comment_models import Comment
from users.models.user_posts import Post
from users.serializers.comment_serializers import CommentSerializer


class CommentListCreateAPIView(APIView):
    """
    GET  /api/v1/posts/<post_id>/comments/
    POST /api/v1/posts/<post_id>/comments/   { text }
    """

    def get_permissions(self):
        return [IsAuthenticated()] if self.request.method == 'POST' else [AllowAny()]

    def get(self, request, post_id):
        get_object_or_404(Post, pk=post_id)
        comments = Comment.objects.filter(post_id=post_id).for_list(request.user)

        paginator = DefaultPagination()
        page = paginator.paginate_queryset(comments, request, view=self)
        serializer = CommentSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

    def post(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id)
        serializer = CommentSerializer(
            data=request.data, context={'request': request, 'post': post},
        )
        serializer.is_valid(raise_exception=True)
        comment = serializer.save()
        return Response(
            CommentSerializer(comment, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )


class CommentDetailAPIView(APIView):
    """
    DELETE /api/v1/posts/<post_id>/comments/<id>/ — yalnız sahibi silə bilər.
    """

    permission_classes = [IsAuthenticated]

    def delete(self, request, post_id, comment_id):
        comment = get_object_or_404(Comment, pk=comment_id, post_id=post_id)
        if comment.user_id != request.user.pk:
            raise PermissionDenied("Bu şərhi yalnız sahibi silə bilər.")
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CommentLikeAPIView(APIView):
    """
    POST/DELETE /api/v1/posts/<post_id>/comments/<id>/like/ — `toggleCommentLike`.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, post_id, comment_id):
        comment = get_object_or_404(Comment, pk=comment_id, post_id=post_id)
        comment.likes.add(request.user)
        return self._response(request, comment)

    def delete(self, request, post_id, comment_id):
        comment = get_object_or_404(Comment, pk=comment_id, post_id=post_id)
        comment.likes.remove(request.user)
        return self._response(request, comment)

    def _response(self, request, comment):
        comment = get_object_or_404(
            Comment.objects.for_list(request.user), pk=comment.pk,
        )
        return Response(CommentSerializer(comment, context={'request': request}).data)
