from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from apps.products.models import Product
from .models import Wishlist
from .serializers import WishlistSerializer


class WishlistView(APIView):
    """
    GET    /api/wishlist/         — Foydalanuvchining wishlistini qaytaradi
    POST   /api/wishlist/         — Wishlistga mahsulot qo'shadi
    DELETE /api/wishlist/         — Wishlistdan mahsulot o'chiradi
    """
    permission_classes = [IsAuthenticated]

    def _get_or_create_wishlist(self, user):
        """Foydalanuvchining wishlistini topadi yoki yaratadi"""
        wishlist, _ = Wishlist.objects.get_or_create(user=user)
        return wishlist

    def get(self, request):
        wishlist = self._get_or_create_wishlist(request.user)
        serializer = WishlistSerializer(wishlist, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        """Wishlistga mahsulot qo'shish"""
        product_id = request.data.get('product_id')
        if not product_id:
            return Response(
                {'error': 'product_id majburiy'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            product = Product.objects.get(pk=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response(
                {'error': 'Mahsulot topilmadi'},
                status=status.HTTP_404_NOT_FOUND
            )

        wishlist = self._get_or_create_wishlist(request.user)

        if wishlist.products.filter(pk=product_id).exists():
            return Response(
                {'message': 'Mahsulot allaqachon wishlistda bor'},
                status=status.HTTP_200_OK
            )

        wishlist.products.add(product)
        serializer = WishlistSerializer(wishlist, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request):
        """Wishlistdan mahsulot o'chirish"""
        product_id = request.data.get('product_id')
        if not product_id:
            return Response(
                {'error': 'product_id majburiy'},
                status=status.HTTP_400_BAD_REQUEST
            )

        wishlist = self._get_or_create_wishlist(request.user)

        try:
            product = Product.objects.get(pk=product_id)
            wishlist.products.remove(product)
        except Product.DoesNotExist:
            pass  # Allaqachon yo'q bo'lsa ham OK

        serializer = WishlistSerializer(wishlist, context={'request': request})
        return Response(serializer.data)


class WishlistClearView(APIView):
    """DELETE /api/wishlist/clear/ — Wishlistni to'liq tozalash"""
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        wishlist.products.clear()
        return Response({'message': 'Wishlist tozalandi', 'products': []})


class WishlistCheckView(APIView):
    """GET /api/wishlist/check/<product_id>/ — Mahsulot wishlistda bormi?"""
    permission_classes = [IsAuthenticated]

    def get(self, request, product_id):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        is_in_wishlist = wishlist.products.filter(pk=product_id).exists()
        return Response({'product_id': product_id, 'in_wishlist': is_in_wishlist})
