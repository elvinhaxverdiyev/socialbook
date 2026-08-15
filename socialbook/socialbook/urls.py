from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from django.urls import include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("users.urls")),
    path("api/v1/", include("books.urls")),
    path("api/v1/", include("shelves.urls")),
    path("api/v1/", include("stores.urls")),
    path("api/v1/", include("apis.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)