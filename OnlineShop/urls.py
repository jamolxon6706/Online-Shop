from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from apps.admin_api import (
    AdminStatsAPIView,
    AdminProductListCreateAPIView, AdminProductDetailAPIView,
    AdminColorVariantCreateAPIView, AdminColorPhotoUploadAPIView,
    AdminStorageOptionCreateAPIView,
    AdminOrderListAPIView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.urls')),

    # Admin auth (existing — must come before generic admin/)
    path('api/admin/auth/', include('apps.accounts.admin_urls')),

    # Admin CRUD API
    path('api/admin/stats/', AdminStatsAPIView.as_view()),
    path('api/admin/products/', AdminProductListCreateAPIView.as_view()),
    path('api/admin/products/<int:pk>/', AdminProductDetailAPIView.as_view()),
    path('api/admin/products/<int:pk>/colors/', AdminColorVariantCreateAPIView.as_view()),
    path('api/admin/colors/<int:pk>/photos/', AdminColorPhotoUploadAPIView.as_view()),
    path('api/admin/products/<int:pk>/storage/', AdminStorageOptionCreateAPIView.as_view()),
    path('api/admin/orders/', AdminOrderListAPIView.as_view()),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)