from django.db import models


class Genre(models.Model):
    """
    Kitab taqları: Azərbaycan, Roman, Klassik və s.
    """
    name = models.CharField(max_length=50, unique=True)
 
    def __str__(self):
        return self.name