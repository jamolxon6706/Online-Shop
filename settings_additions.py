# ============================================================
# OnlineShop/settings.py ga QO'SHISH kerak bo'lgan sozlamalar
# ============================================================
# Bu faylni to'g'ridan-to'g'ri settings.py ga ko'chiring

# ─── Email (Gmail SMTP) ──────────────────────────────────────
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = env('EMAIL_HOST_USER', default='')       # Gmail manzil
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD', default='') # Gmail App Password
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL', default='APEX Admin <noreply@apexstore.uz>')

# ─── Cache (OTP saqlash uchun) ───────────────────────────────
# Development uchun LocMemCache yetarli
# Production uchun Redis ishlatish tavsiya etiladi
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "apex-cache",
    }
}

# Redis ishlatmoqchi bo'lsangiz (ixtiyoriy):
# pip install django-redis
# CACHES = {
#     "default": {
#         "BACKEND": "django_redis.cache.RedisCache",
#         "LOCATION": env("REDIS_URL", default="redis://127.0.0.1:6379/1"),
#         "OPTIONS": {
#             "CLIENT_CLASS": "django_redis.client.DefaultClient",
#         }
#     }
# }

# ─── OnlineShop/urls.py ga QO'SHISH ─────────────────────────
# urlpatterns ichiga:
#
# path('api/admin/auth/', include('apps.accounts.admin_urls')),
#
# Misol:
# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/admin/auth/', include('apps.accounts.admin_urls')),
#     path('api/', include('apps.products.urls')),
#     ...
# ]

# ─── .env ga QO'SHISH ────────────────────────────────────────
# EMAIL_HOST_USER=sizning@gmail.com
# EMAIL_HOST_PASSWORD=xxxx xxxx xxxx xxxx   ← Gmail App Password
# DEFAULT_FROM_EMAIL=APEX Admin <sizning@gmail.com>
#
# Gmail App Password olish:
# 1. myaccount.google.com → Security
# 2. 2-Step Verification yoqing
# 3. App passwords → "Mail" → "Other (Custom name)" → "APEX"
# 4. 16 xonali parolni oling

# ─── Admin user yaratish ─────────────────────────────────────
# python manage.py createsuperuser
# Username: admin
# Email:    jamolxonyoldashaliyev3@gmail.com
# Password: admin1234
