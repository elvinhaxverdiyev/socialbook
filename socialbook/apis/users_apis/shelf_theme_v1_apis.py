from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from users.shelf_theme import sanitize_shelf_theme
from users.serializers.shelf_theme_serializers import ShelfThemeSerializer
from users.utils import normalize_username

User = get_user_model()


class MyShelfThemeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        theme = sanitize_shelf_theme(request.user.shelf_theme)
        return Response(theme)

    def put(self, request):
        return self._save_theme(request)

    def patch(self, request):
        return self._save_theme(request)

    def _save_theme(self, request):
        serializer = ShelfThemeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        theme = serializer.validated_data  # to_internal_value artıq sanitize edir

        request.user.shelf_theme = theme
        request.user.save(update_fields=["shelf_theme", "updated_at"])

        return Response(theme, status=status.HTTP_200_OK)


class UserShelfThemeAPIView(APIView):
    """
    Başqa istifadəçinin rəf teması (oxumaq üçün, public).
    URL: /api/v1/users/<username>/shelf-theme/
    """

    permission_classes = [AllowAny]

    def get(self, request, username):
        clean = normalize_username(username)
        if not clean:
            return Response(
                {"error": "İstifadəçi adı tələb olunur."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = get_object_or_404(User, username__iexact=clean)
        theme = sanitize_shelf_theme(user.shelf_theme)
        return Response(theme)
