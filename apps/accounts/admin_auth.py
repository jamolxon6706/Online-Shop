"""
Admin panel uchun maxsus login + email OTP tasdiqlash.
Faqat is_staff=True yoki is_superuser=True foydalanuvchilar kira oladi.
"""
import random
import string
from datetime import timedelta

from django.contrib.auth import authenticate, get_user_model
from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

# ─── Helpers ─────────────────────────────────────────────────────────────────

ADMIN_OTP_TTL     = 300   # 5 daqiqa
ADMIN_OTP_PREFIX  = "admin_otp:"
MAX_ATTEMPTS      = 5
LOCKOUT_TTL       = 600   # 10 daqiqa


def _otp_key(username: str) -> str:
    return f"{ADMIN_OTP_PREFIX}{username}"


def _lock_key(username: str) -> str:
    return f"admin_lock:{username}"


def _attempt_key(username: str) -> str:
    return f"admin_attempts:{username}"


def generate_otp(length: int = 6) -> str:
    return "".join(random.choices(string.digits, k=length))


def send_admin_otp(email: str, otp: str, username: str) -> bool:
    """OTP kodni email ga jo'natadi."""
    subject = "🔐 APEX Admin — Kirish kodi"
    message = (
        f"Salom, {username}!\n\n"
        f"APEX Admin panelga kirish uchun tasdiqlash kodingiz:\n\n"
        f"  ╔══════════════╗\n"
        f"  ║   {otp}   ║\n"
        f"  ╚══════════════╝\n\n"
        f"Bu kod 5 daqiqa davomida amal qiladi.\n"
        f"Agar siz kirmagan bo'lsangiz, bu xatni e'tiborsiz qoldiring.\n\n"
        f"— APEX Security Team"
    )
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"[AdminAuth] Email yuborishda xatolik: {e}")
        return False


# ─── Step 1: Login (credentials) ────────────────────────────────────────────

class AdminLoginView(APIView):
    """
    POST /api/admin/auth/login/
    Body: { "username": "admin", "password": "admin1234" }
    
    1. Username/password tekshiradi
    2. is_staff yoki is_superuser ekanligini tekshiradi
    3. OTP generatsiya qiladi va email ga jo'natadi
    4. { "message": "...", "email": "j***@gmail.com" } qaytaradi
    """
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        username = request.data.get("username", "").strip()
        password = request.data.get("password", "")

        if not username or not password:
            return Response(
                {"error": "Username va parol kiritish shart"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Lockout tekshirish
        if cache.get(_lock_key(username)):
            return Response(
                {"error": "Juda ko'p urinish. 10 daqiqadan keyin qayta urining."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        # Autentifikatsiya
        user = authenticate(request, username=username, password=password)
        if user is None:
            # Attempt counter
            attempts = cache.get(_attempt_key(username), 0) + 1
            cache.set(_attempt_key(username), attempts, LOCKOUT_TTL)
            if attempts >= MAX_ATTEMPTS:
                cache.set(_lock_key(username), True, LOCKOUT_TTL)
                cache.delete(_attempt_key(username))
                return Response(
                    {"error": "Juda ko'p noto'g'ri urinish. 10 daqiqaga bloklandi."},
                    status=status.HTTP_429_TOO_MANY_REQUESTS,
                )
            return Response(
                {"error": "Username yoki parol noto'g'ri"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Admin huquqi tekshirish
        if not (user.is_staff or user.is_superuser):
            return Response(
                {"error": "Sizda admin huquqi yo'q"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if not user.is_active:
            return Response(
                {"error": "Hisob faol emas"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # OTP generatsiya
        otp = generate_otp()
        cache.set(_otp_key(username), {
            "otp": otp,
            "user_id": user.id,
            "created_at": timezone.now().isoformat(),
        }, ADMIN_OTP_TTL)
        cache.delete(_attempt_key(username))

        # Email jo'natish
        sent = send_admin_otp(user.email, otp, username)
        if not sent:
            return Response(
                {"error": "Email jo'natishda xatolik. Server sozlamalarini tekshiring."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # Email ni qisman yashirish  j***@gmail.com
        email_parts = user.email.split("@")
        masked_email = email_parts[0][:1] + "***@" + email_parts[1] if len(email_parts) == 2 else "***"

        return Response({
            "message": f"Tasdiqlash kodi emailga yuborildi",
            "email": masked_email,
            "username": username,
        })


# ─── Step 2: Verify OTP ───────────────────────────────────────────────────────

class AdminVerifyOtpView(APIView):
    """
    POST /api/admin/auth/verify/
    Body: { "username": "admin", "code": "123456" }

    1. OTP ni tekshiradi
    2. To'g'ri bo'lsa JWT access/refresh token qaytaradi
    """
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        username = request.data.get("username", "").strip()
        code     = request.data.get("code", "").strip()

        if not username or not code:
            return Response(
                {"error": "Username va kod kiritish shart"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cached = cache.get(_otp_key(username))
        if not cached:
            return Response(
                {"error": "Kod muddati tugagan yoki topilmadi. Qayta kiring."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if cached["otp"] != code:
            return Response(
                {"error": "Kod noto'g'ri"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # OTP to'g'ri — o'chirib yuboramiz (bir martalik)
        cache.delete(_otp_key(username))

        try:
            user = User.objects.get(id=cached["user_id"])
        except User.DoesNotExist:
            return Response(
                {"error": "Foydalanuvchi topilmadi"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # JWT token generatsiya
        refresh = RefreshToken.for_user(user)
        access  = refresh.access_token

        return Response({
            "access":  str(access),
            "refresh": str(refresh),
            "user": {
                "id":         user.id,
                "username":   user.username,
                "email":      user.email,
                "first_name": user.first_name,
                "is_staff":   user.is_staff,
                "is_superuser": user.is_superuser,
            }
        })


# ─── Resend OTP ───────────────────────────────────────────────────────────────

class AdminResendOtpView(APIView):
    """
    POST /api/admin/auth/resend/
    Body: { "username": "admin" }
    """
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        username = request.data.get("username", "").strip()
        if not username:
            return Response({"error": "Username kiritish shart"}, status=400)

        try:
            user = User.objects.get(username=username, is_active=True)
        except User.DoesNotExist:
            return Response({"error": "Foydalanuvchi topilmadi"}, status=404)

        if not (user.is_staff or user.is_superuser):
            return Response({"error": "Ruxsat yo'q"}, status=403)

        otp = generate_otp()
        cache.set(_otp_key(username), {
            "otp": otp,
            "user_id": user.id,
            "created_at": timezone.now().isoformat(),
        }, ADMIN_OTP_TTL)

        sent = send_admin_otp(user.email, otp, username)
        if not sent:
            return Response({"error": "Email jo'natishda xatolik"}, status=500)

        return Response({"message": "Yangi kod yuborildi"})
