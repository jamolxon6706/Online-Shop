
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from apps.serializers import EmailTokenObtainPairView
from .views import (
    RegisterAPIView, VerifyEmailAPIView, VerifyOtpAPIView,
    ForgotPasswordAPIView, ForgotPasswordVerifyAPIView, ResetPasswordAPIView,
    ProductListAPIView, ProductDetailAPIView, ProductSearchAPIView,
    CategoryListAPIView, CategoryProductListAPIView,
    ProfileAPIView, ChangePasswordAPIView, CartAPIView, CartItemAPIView, WishlistAPIView
)

urlpatterns = [
    # ─── Auth ──────────────────────────────────────────────────────
    path('auth/register/', RegisterAPIView.as_view()),
    path('auth/verify-email/', VerifyEmailAPIView.as_view()),
    path('auth/verify-otp/', VerifyOtpAPIView.as_view()),
    path('auth/forgot-password/', ForgotPasswordAPIView.as_view()),
    path('auth/forgot-password-verify/', ForgotPasswordVerifyAPIView.as_view()),
    path('auth/reset-password/', ResetPasswordAPIView.as_view()),


    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/', EmailTokenObtainPairView.as_view()),

    # ─── Products ──────────────────────────────────────────────────
    path('products/', ProductListAPIView.as_view()),
    path('products/search/', ProductSearchAPIView.as_view()),
    path('products/<int:pk>/', ProductDetailAPIView.as_view()),

    # ─── Categories ────────────────────────────────────────────────
    path('categories/', CategoryListAPIView.as_view()),
    path('categories/<int:pk>/', CategoryProductListAPIView.as_view()),

    # ─── Profile (JWT talab qiladi) ────────────────────────────────
    path('profile/', ProfileAPIView.as_view()),
    path('profile/change-password/', ChangePasswordAPIView.as_view()),

    # ─── Cart (JWT talab qiladi) ───────────────────────────────────
    path('cart/', CartAPIView.as_view()),
    path('cart/<int:pk>/', CartItemAPIView.as_view()),

#     wishlist
    path('wishlist/', WishlistAPIView.as_view()),
# order
#     payments
#
]
