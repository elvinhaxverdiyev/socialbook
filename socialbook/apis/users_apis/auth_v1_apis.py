from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework import status

from users.serializers.auth_serializers import RegisterSerializer
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
        from users.models.users_models import User

        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Email və şifrə tələb olunur."}, status=400
            )

        generic_error = {"error": "İstifadəçi adı və ya şifrə yanlışdır."}

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            User().set_password(password)
            return Response(generic_error, status=400)

        if not user.check_password(password):
            return Response(generic_error, status=400)

        if not user.is_active:
            return Response(
                {"error": "Hesab deaktivdir."}, status=403
            )

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Giriş uğurla tamamlandı.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=200,
        )


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"error": "Refresh token tələb olunur."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            RefreshToken(refresh_token).blacklist()
        except TokenError:
            return Response(
                {"error": "Refresh token etibarsızdır."},
                status=status.HTTP_400_BAD_REQUEST,
            )

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
