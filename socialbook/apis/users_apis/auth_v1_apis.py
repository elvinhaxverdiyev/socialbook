from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status

from users.serializers.auth_serializers import (
    LoginSerializer,
    LogoutSerializer,
    RegisterSerializer,
)
from users.serializers.password_serializers import PasswordChangeSerializer
from apis.throttling import AuthRateThrottle


class RegisterAPIView(APIView):
    throttle_classes = [AuthRateThrottle]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "message": "Qeydiyyat uğurla tamamlandı.",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                    },
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                status=201,
            )
        return Response(serializer.errors, status=400)


class LoginAPIView(APIView):
    throttle_classes = [AuthRateThrottle]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        auth = serializer.save()
        user = auth["user"]

        return Response(
            {
                "message": "Giriş uğurla tamamlandı.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
                "access": auth["access"],
                "refresh": auth["refresh"],
            },
            status=status.HTTP_200_OK,
        )


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Çıxış uğurla tamamlandı."})


class PasswordChangeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PasswordChangeSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Parol uğurla dəyişdirildi."})
