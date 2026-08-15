from rest_framework import serializers

from users.models.report_models import Report


class ReportSerializer(serializers.ModelSerializer):
    """
    `UserProfileActionsModal`/`reportUser` — istifadəçi və ya post şikayəti.
    """

    class Meta:
        model = Report
        fields = ['id', 'reported_user', 'reported_post', 'reason', 'created_at']
        read_only_fields = ['id', 'created_at']
        extra_kwargs = {
            'reported_user': {'required': False},
            'reported_post': {'required': False},
        }

    def validate(self, attrs):
        if not attrs.get('reported_user') and not attrs.get('reported_post'):
            raise serializers.ValidationError("Şikayət ediləcək istifadəçi və ya post tələb olunur.")
        return attrs

    def validate_reason(self, value):
        cleaned = value.strip()
        if len(cleaned) < 3:
            raise serializers.ValidationError("Səbəb ən azı 3 simvol olmalıdır.")
        return cleaned

    def create(self, validated_data):
        validated_data['reporter'] = self.context['request'].user
        return super().create(validated_data)
