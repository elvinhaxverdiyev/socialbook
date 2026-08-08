from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from django.utils.timezone import datetime, is_aware, make_aware


class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user = super().get_user(validated_token)

        token_iat = validated_token.get("iat")
        if token_iat is not None and getattr(user, "password_changed_at", None):
            token_issued_at = datetime.fromtimestamp(token_iat)
            if not is_aware(token_issued_at):
                token_issued_at = make_aware(token_issued_at)

            if token_issued_at < user.password_changed_at:
                raise AuthenticationFailed(
                    "Parol dəyişdirilib, zəhmət olmasa yenidən daxil olun.",
                    code="password_changed",
                )

        return user