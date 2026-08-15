from django.db import models


class Genre(models.Model):
    """
    Kitab taqları: Azərbaycan, Roman, Klassik və s.
    """
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    @property
    def books_count(self):
        return self.books.count()