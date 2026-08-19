from django.contrib import admin

from core.models import SitePage, SitePageSection


class SitePageSectionInline(admin.TabularInline):
    model = SitePageSection
    extra = 0
    ordering = ('order', 'id')


@admin.register(SitePage)
class SitePageAdmin(admin.ModelAdmin):
    list_display = ('kind', 'title', 'is_published', 'updated_at')
    list_filter = ('kind', 'is_published')
    search_fields = ('title', 'document_title')
    inlines = (SitePageSectionInline,)
