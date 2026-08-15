from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from socialbook.pagination import DefaultPagination
from users.models.block_models import BlockedUser
from users.serializers.block_serializers import BlockedUserSerializer
from users.utils import normalize_username

User = get_user_model()


class BlockedUserListAPIView(APIView):
    """
    GET /api/v1/users/blocked/ — `SettingsPage` bloklanmış istifadəçilər siyahısı.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        blocked = BlockedUser.objects.filter(blocker=request.user).select_related('blocked')

        paginator = DefaultPagination()
        page = paginator.paginate_queryset(blocked, request, view=self)
        serializer = BlockedUserSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)


class BlockUserAPIView(APIView):
    """
    POST /api/v1/users/<username>/block/ — `blockUser`.
    DELETE /api/v1/users/<username>/block/ — `unblockUser`.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        clean = normalize_username(username)
        target = get_object_or_404(User, username__iexact=clean)

        if target.pk == request.user.pk:
            return Response(
                {"error": "Özünü bloklaya bilməzsən."}, status=status.HTTP_400_BAD_REQUEST,
            )

        BlockedUser.objects.get_or_create(blocker=request.user, blocked=target)
        request.user.followers.remove(target)
        target.followers.remove(request.user)

        return Response({"message": "İstifadəçi bloklandı."}, status=status.HTTP_200_OK)

    def delete(self, request, username):
        clean = normalize_username(username)
        target = get_object_or_404(User, username__iexact=clean)

        BlockedUser.objects.filter(blocker=request.user, blocked=target).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
