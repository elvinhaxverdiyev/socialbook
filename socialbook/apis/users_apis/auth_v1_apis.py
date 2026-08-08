from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from users.models.users_models import User
from users.serializers.auth_serializers import RegisterSerializer


class RegisterAPIView(APIView):
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
    def post(self, request):
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
            # timing fərqini azaltmaq üçün "boş" bir hash yoxlaması edirik
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