import os

from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.models import User


def _get_firebase_auth():
    """Lazy Firebase init — fails gracefully if SDK or credentials are missing."""
    try:
        import firebase_admin
        from firebase_admin import auth as fb_auth, credentials

        try:
            firebase_admin.get_app()
        except ValueError:
            cred_path = os.getenv('FIREBASE_CREDENTIALS', 'serviceAccountKey.json')
            if not os.path.exists(cred_path):
                return None, "Firebase credentials fayli topilmadi. FIREBASE_CREDENTIALS .env da ko'rsating."
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)

        return fb_auth, None
    except ImportError:
        return None, "firebase-admin o'rnatilmagan. pip install firebase-admin"


@extend_schema(tags=['Auth'])
class FirebaseLoginAPIView(APIView):
    """
    Firebase Phone Auth token qabul qilib, JWT token qaytaradi.
    Body: { "firebase_token": "...", "phone_number": "+998..." }
    """

    def post(self, request):
        fb_auth, error = _get_firebase_auth()
        if error:
            return Response({'error': error}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        firebase_token = request.data.get('firebase_token')
        if not firebase_token:
            return Response({'error': 'firebase_token majburiy'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded = fb_auth.verify_id_token(firebase_token)
        except Exception:
            return Response(
                {'error': "Firebase token noto'g'ri yoki muddati tugagan"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        phone_number = decoded.get('phone_number') or request.data.get('phone_number')
        uid = decoded.get('uid', '')

        if not phone_number:
            return Response({'error': 'Telefon raqami topilmadi'}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(
            phone_number=phone_number,
            defaults={'username': f'user_{uid[:8]}', 'is_active': True},
        )

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'created': created,
            'phone_number': phone_number,
        }, status=status.HTTP_200_OK)
