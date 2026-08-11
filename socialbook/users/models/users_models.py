import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings



def user_avatar_path(instance, filename):
    ext = filename.split('.')[-1]
    return f'avatars/{instance.id}/{uuid.uuid4()}.{ext}'
 

class User(AbstractUser):
    """
    AbstractUser-i genişləndirir. username @handle kimi istifadə olunur
    (məs: @rashad_g), avatar yoxdursa initials frontend-də göstərilir.
    """

    CURRENT_STATUS_CHOICES = [
            ('reading', 'Oxuyur'),
            ('idle', 'Aktiv deyil'),
    ]
    
    avatar = models.ImageField(
        upload_to=user_avatar_path,
        blank=True,
        null=True,
    )
    backround_image = models.ImageField(
        upload_to='backgrounds/',
        blank=True,
        null=True,
    )
    bio = models.TextField(max_length=500, blank=True)
    age = models.PositiveIntegerField(blank=True, null=True)
    is_email_verified = models.BooleanField(default=False)
    current_status = models.CharField(
        max_length=20,
        choices=CURRENT_STATUS_CHOICES,
        default='idle',
    )
 
    followers = models.ManyToManyField(
        'self',
        symmetrical=False,
        related_name='following',
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    def __str__(self):
        return self.username
 
    @property
    def following_count(self):
        return self.following.count()
 
    @property
    def followers_count(self):
        return self.followers.count()
 
    @property
    def posts_count(self):
        return self.posts.count()
 
    @property
    def shelf_count(self):
        return self.shelf_items.count()
 
    def shelf_count_by_status(self, status):
        return self.shelf_items.filter(status=status).count()


