"""apps/accounts/admin_urls.py"""
from django.urls import path
from .admin_auth import AdminLoginView, AdminVerifyOtpView, AdminResendOtpView

urlpatterns = [
    path("login/",  AdminLoginView.as_view(),    name="admin-login"),
    path("verify/", AdminVerifyOtpView.as_view(), name="admin-verify-otp"),
    path("resend/", AdminResendOtpView.as_view(), name="admin-resend-otp"),
]
