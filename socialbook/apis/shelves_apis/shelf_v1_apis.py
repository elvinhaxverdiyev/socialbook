from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from shelves.models.shelves_models import Shelf
from shelves.serializers.shelves_serializers import ShelfSerializer
from users.utils import normalize_username

User = get_user_model()


class MyShelfListCreateAPIView(APIView):
    """
    GET  /api/v1/shelf/?status=reading|finished|want — öz rəfim (`ShelfPage`).
    POST /api/v1/shelf/  { book_id, status } — `addShelfBook` (upsert).
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = Shelf.objects.filter(user=request.user).with_related()

        status_filter = request.query_params.get('status')
        if status_filter and status_filter != 'all':
            items = items.filter(status=status_filter)

        serializer = ShelfSerializer(items, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = ShelfSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        shelf_item = serializer.save()
        return Response(
            ShelfSerializer(shelf_item, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )


class MyShelfDetailAPIView(APIView):
    """
    PATCH  /api/v1/shelf/<id>/  { status } — `updateShelfBookStatus`.
    DELETE /api/v1/shelf/<id>/  — `removeShelfBook`.
    """

    permission_classes = [IsAuthenticated]

    def patch(self, request, shelf_id):
        item = self._get_owned(request, shelf_id)
        serializer = ShelfSerializer(
            item, data=request.data, partial=True, context={'request': request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, shelf_id):
        item = self._get_owned(request, shelf_id)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def _get_owned(self, request, shelf_id):
        item = get_object_or_404(Shelf, pk=shelf_id)
        if item.user_id != request.user.pk:
            raise PermissionDenied("Bu rəf elementini yalnız sahibi dəyişə bilər.")
        return item


class UserShelfListAPIView(APIView):
    """
    GET /api/v1/users/<username>/shelf/?status= — public rəf görünüşü.
    """

    permission_classes = [AllowAny]

    def get(self, request, username):
        clean = normalize_username(username)
        user = get_object_or_404(User, username__iexact=clean)

        items = Shelf.objects.filter(user=user).with_related()

        status_filter = request.query_params.get('status')
        if status_filter and status_filter != 'all':
            items = items.filter(status=status_filter)

        serializer = ShelfSerializer(items, many=True, context={'request': request})
        return Response(serializer.data)
