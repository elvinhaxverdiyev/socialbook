from rest_framework import serializers

from core.models.page_models import SitePage, SitePageSection


def validate_string_list(value, *, field_name='Siyahı'):
    if not isinstance(value, list):
        raise serializers.ValidationError(f'{field_name} siyahı olmalıdır.')

    cleaned = []
    for item in value:
        if not isinstance(item, str):
            raise serializers.ValidationError(f'{field_name} yalnız mətn elementləri ola bilər.')
        text = item.strip()
        if text:
            cleaned.append(text)
    return cleaned


class SitePageSectionSerializer(serializers.ModelSerializer):
    """
    Səhifənin bir bölməsi — başlıq, paraqraflar, siyahı və siyahıdan sonrakı mətn.
    """

    class Meta:
        model = SitePageSection
        fields = ['id', 'order', 'heading', 'paragraphs', 'items', 'after']
        read_only_fields = ['id']

    def validate_paragraphs(self, value):
        return validate_string_list(value, field_name='Paraqraflar')

    def validate_items(self, value):
        return validate_string_list(value, field_name='Siyahı')

    def validate_after(self, value):
        return validate_string_list(value, field_name='Siyahıdan sonra')


class SitePageSerializer(serializers.ModelSerializer):
    """
    Haqqımızda, İstifadə şərtləri və Topluluq qaydaları səhifəsi.
    """

    sections = SitePageSectionSerializer(many=True, read_only=True)
    kind_display = serializers.CharField(source='get_kind_display', read_only=True)

    class Meta:
        model = SitePage
        fields = [
            'id',
            'kind',
            'kind_display',
            'title',
            'document_title',
            'intro',
            'outro',
            'sections',
            'is_published',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_intro(self, value):
        return validate_string_list(value, field_name='Giriş')

    def validate_outro(self, value):
        return validate_string_list(value, field_name='Sonluq')
