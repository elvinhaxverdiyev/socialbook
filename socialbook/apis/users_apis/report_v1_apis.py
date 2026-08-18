from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from users.serializers.report_serializers import ReportSerializer
from users.utils import normalize_username

User = get_user_model()


class ReportUserAPIView(APIView):
    """
    POST /api/v1/users/<username>/report/  { reason }
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        clean = normalize_username(username)
        target = get_object_or_404(User, username__iexact=clean)

        if target.pk == request.user.pk:
            return Response(
                {"error": "Özünü şikayət edə bilməzsən."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = ReportSerializer(
            data={**request.data, 'reported_user': target.pk},
            context={'request': request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "Şikayət qeydə alındı."}, status=status.HTTP_201_CREATED,
        )


class ReportPostAPIView(APIView):
    """
    POST /api/v1/posts/<post_id>/report/  { reason }
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        from users.models.user_posts import Post

        post = get_object_or_404(Post, pk=post_id)

        serializer = ReportSerializer(
            data={**request.data, 'reported_post': post.pk},
            context={'request': request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "Şikayət qeydə alındı."}, status=status.HTTP_201_CREATED,
        )
