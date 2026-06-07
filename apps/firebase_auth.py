# ============================================================
# Bu faylni apps/views.py ga qo'shing (pastiga)
# ============================================================

# apps/views.py ga qo'shimcha import:
# from apps.firebase_auth import FirebaseLoginAPIView

# urls.py ga qo'shing:
# path('auth/firebase-login/', FirebaseLoginAPIView.as_view()),

import firebase_admin
from firebase_admin import auth as firebase_auth, credentials
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from apps.models import User

# Firebase admin SDK ni bir marta initialize qilish
# (agar allaqachon initialize qilingan bo'lsa xato bermaydi)
try:
    firebase_admin.get_app()
except ValueError:
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)


class FirebaseLoginAPIView(APIView):
    """
    Firebase Phone Auth token qabul qilib, JWT token qaytaradi.
    
    Request body:
        {
            "firebase_token": "Firebase ID token...",
            "phone_number": "+998901234567"  (ixtiyoriy)
        }
    
    Response:
        {
            "access": "JWT access token",
            "refresh": "JWT refresh token",
            "created": true/false  (yangi foydalanuvchi yaratildimi)
        }
    """

    def post(self, request):
        firebase_token = request.data.get("firebase_token")
        if not firebase_token:
            return Response(
                {"error": "firebase_token majburiy"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Firebase tokenni verify qilish
        try:
            decoded = firebase_auth.verify_id_token(firebase_token)
        except Exception:
            return Response(
                {"error": "Firebase token noto'g'ri yoki muddati tugagan"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        phone_number = decoded.get("phone_number") or request.data.get("phone_number")
        uid = decoded.get("uid")

        if not phone_number:
            return Response(
                {"error": "Telefon raqami topilmadi"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Foydalanuvchini topish yoki yaratish
        user, created = User.objects.get_or_create(
            phone_number=phone_number,
            defaults={
                "username": f"user_{uid[:8]}",
                "is_active": True,
            }
        )

        # JWT token yaratish
        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "created": created,
            "phone_number": phone_number,
        }, status=status.HTTP_200_OK)
