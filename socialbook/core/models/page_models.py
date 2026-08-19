from django.db import models

from core.utils.choices import PAGE_KIND_CHOICES


class SitePageQuerySet(models.QuerySet):
    def published(self):
        return self.filter(is_published=True)

    def with_sections(self):
        return self.prefetch_related('sections')


class SitePage(models.Model):
    """
    Platform səhifələri — Haqqımızda, İstifadə şərtləri, Topluluq qaydaları.
    Hər `kind` üçün yalnız bir səhifə saxlanılır (front hələ bağlanmayıb).
    """

    kind = models.CharField(
        max_length=32,
        choices=PAGE_KIND_CHOICES,
        unique=True,
    )
    title = models.CharField(max_length=200)
    document_title = models.CharField(max_length=255, blank=True)
    intro = models.JSONField(default=list, blank=True)
    outro = models.JSONField(default=list, blank=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SitePageQuerySet.as_manager()

    class Meta:
        ordering = ['kind']
        verbose_name = 'Platforma səhifəsi'
        verbose_name_plural = 'Platforma səhifələri'

    def __str__(self):
        return self.title or self.get_kind_display()


class SitePageSection(models.Model):
    """
    Səhifənin nömrələnmiş bölməsi (başlıq, paraqraflar, siyahı, siyahıdan sonra mətn).
    """

    page = models.ForeignKey(
        SitePage,
        on_delete=models.CASCADE,
        related_name='sections',
    )
    order = models.PositiveIntegerField(default=0)
    heading = models.CharField(max_length=200)
    paragraphs = models.JSONField(default=list, blank=True)
    items = models.JSONField(default=list, blank=True)
    after = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Səhifə bölməsi'
        verbose_name_plural = 'Səhifə bölmələri'

    def __str__(self):
        return self.heading
