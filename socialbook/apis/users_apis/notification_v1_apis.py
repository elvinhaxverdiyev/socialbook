from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from socialbook.pagination import DefaultPagination
from users.models.notification_models import Notification
from users.serializers.notification_serializers import NotificationSerializer


class NotificationListAPIView(APIView):
    """
    GET /api/v1/notifications/ — `NotificationsPage`.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(
            recipient=request.user,
        ).with_related()

        paginator = DefaultPagination()
        page = paginator.paginate_queryset(notifications, request, view=self)
        serializer = NotificationSerializer(page, many=True, context={'request': request})
        response = paginator.get_paginated_response(serializer.data)
        response.data['unread_count'] = Notification.objects.filter(
            recipient=request.user,
        ).unread().count()
        return response


class NotificationMarkReadAPIView(APIView):
    """
    PATCH /api/v1/notifications/<id>/read/ — `markNotificationRead`.
    """

    permission_classes = [IsAuthenticated]

    def patch(self, request, notification_id):
        notification = get_object_or_404(
            Notification, pk=notification_id, recipient=request.user,
        )
        if not notification.is_read:
            notification.is_read = True
            notification.save(update_fields=['is_read'])
        return Response(NotificationSerializer(notification, context={'request': request}).data)


class NotificationMarkAllReadAPIView(APIView):
    """
    POST /api/v1/notifications/read-all/ — `markAllNotificationsRead`.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response({"message": "Bütün bildirişlər oxundu olaraq işarələndi."})


class NotificationDeleteAPIView(APIView):
    """
    DELETE /api/v1/notifications/<id>/ — `deleteNotification`.
    """

    permission_classes = [IsAuthenticated]

    def delete(self, request, notification_id):
        notification = get_object_or_404(
            Notification, pk=notification_id, recipient=request.user,
        )
        notification.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
