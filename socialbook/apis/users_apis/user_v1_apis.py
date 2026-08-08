from rest_framework.response import Response
from rest_framework.views import APIView

from users.models.users_models import User
from users.serializers.user_serializers import UserSerializer


class UserListAPIView(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)