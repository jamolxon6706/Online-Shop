from django.urls import path
from . import views

urlpatterns = [
    # Public
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='category-detail'),
    path('products/', views.ProductListView.as_view(), name='product-list'),
    path('products/<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('products/search/', views.ProductSearchView.as_view(), name='product-search'),

    # Admin
    path('admin/products/', views.AdminProductListCreateView.as_view(), name='admin-product-list'),
    path('admin/products/<int:pk>/', views.AdminProductDetailView.as_view(), name='admin-product-detail'),
    path('admin/products/<int:product_id>/colors/', views.ColorVariantListCreateView.as_view(), name='admin-color-list'),
    path('admin/colors/<int:variant_id>/photos/', views.ColorVariantPhotoUploadView.as_view(), name='admin-color-photos'),
    path('admin/products/<int:product_id>/storage/', views.StorageOptionListCreateView.as_view(), name='admin-storage-list'),
    path('admin/storage/<int:pk>/', views.StorageOptionDetailView.as_view(), name='admin-storage-detail'),
    path('admin/stats/', views.AdminStatsView.as_view(), name='admin-stats'),
]
