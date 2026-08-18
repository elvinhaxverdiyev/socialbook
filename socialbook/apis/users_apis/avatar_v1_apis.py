from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from users.models.avatar_models import Avatar, AvatarKind
from users.serializers.avatar_serializers import (
    AvatarPresetListSerializer,
    AvatarSerializer,
    ProfileAvatarSelectSerializer,
)
from users.serializers.user_serializers import UserSerializer
from users.utils.image_validation import validate_avatar_upload

User = get_user_model()


class AvatarPresetListAPIView(APIView):
    """
    GET /api/v1/avatars/presets/
    Admin paneldən əlavə edilmiş aktiv preset avatarlar.
    """

    permission_classes = [AllowAny]

    def get(self, request):
        presets = Avatar.objects.filter(
            kind=AvatarKind.PRESET,
            is_active=True,
        ).order_by("sort_order", "id")
        serializer = AvatarPresetListSerializer(
            presets, many=True, context={"request": request},
        )
        return Response(serializer.data)


class MeAvatarUploadAPIView(APIView):
    """
    POST /api/v1/me/avatar/
    İstifadəçi öz şəklini yükləyir — eyni Avatar modelinə yazılır (kind=upload).
    """

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        image = request.FILES.get("image")
        if not image:
            return Response(
                {"error": "Şəkil faylı tələb olunur (image)."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            validate_avatar_upload(image)
        except ValidationError as exc:
            message = exc.messages[0] if getattr(exc, "messages", None) else str(exc)
            return Response({"error": message}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user

        old_uploads = Avatar.objects.filter(
            kind=AvatarKind.UPLOAD,
            owner=user,
        )
        if user.profile_avatar_id:
            old_uploads = old_uploads.exclude(pk=user.profile_avatar_id)
        old_uploads.delete()

        avatar = Avatar.objects.create(
            kind=AvatarKind.UPLOAD,
            owner=user,
            image=image,
        )
        user.profile_avatar = avatar
        user.save(update_fields=["profile_avatar", "updated_at"])
        user = User.objects.select_related("profile_avatar").get(pk=user.pk)

        return Response(
            {
                "profile_avatar": AvatarSerializer(avatar, context={"request": request}).data,
                "user": UserSerializer(user, context={"request": request}).data,
            },
            status=status.HTTP_201_CREATED,
        )


class MeAvatarSelectAPIView(APIView):
    """
    PUT /api/v1/me/avatar/select/
    Preset və ya öz əvvəlki yükləməsini seçmək üçün.
    """

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def put(self, request):
        serializer = ProfileAvatarSelectSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)

        avatar = Avatar.objects.get(pk=serializer.validated_data["profile_avatar_id"])
        request.user.profile_avatar = avatar
        request.user.save(update_fields=["profile_avatar", "updated_at"])
        user = User.objects.select_related("profile_avatar").get(pk=request.user.pk)

        return Response(
            UserSerializer(user, context={"request": request}).data,
            status=status.HTTP_200_OK,
        )
