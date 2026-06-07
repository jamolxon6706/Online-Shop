import os
from random import randint

from drf_spectacular.utils import extend_schema
from redis import Redis
from rest_framework import status
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, RetrieveUpdateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.models import Product, Category, User
from apps.serializers import ProductListSerializer, ProductDetailSerializer, CategorySerializer, UserModelSerializer, \
    EmailVerifySerializer, VerifyOtpCodeSerializer, ForgotPasswordSerializer, ForgotPasswordVerifySerializer, \
    ResetPasswordSerializer, CategoryProductSerializer, ProductSearchSerializer, ChangePasswordSerializer, \
    ProfileSerializer
from apps.send_message import send_email

redis_client = Redis(
    host=os.getenv('REDIS_HOST', 'localhost'),
    port=int(os.getenv('REDIS_PORT', 6379)),
    password=os.getenv('REDIS_PASSWORD') or None,
    decode_responses=True,
)



@extend_schema(tags=['Auth'])
class RegisterAPIView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserModelSerializer


@extend_schema(tags=['Auth'])
class VerifyEmailAPIView(APIView):

    @extend_schema(
        request=EmailVerifySerializer,
        responses={200: None},
        summary="Email ga OTP kod yuborish"
    )
    def post(self, request):
        serializer = EmailVerifySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        code = str(randint(10 ** 5, 10 ** 6))
        send_email(email, code)

        redis_client.set(f"{email}_code", code, ex=60)

        return Response(
            {'message': 'Tasdiqlash kodi emailga yuborildi!'},
            status=status.HTTP_200_OK
        )


@extend_schema(tags=['Auth'])
class VerifyOtpAPIView(APIView):

    @extend_schema(
        request=VerifyOtpCodeSerializer,
        responses={200: None},
        summary="OTP kodni tasdiqlash"
    )
    def post(self, request):
        serializer = VerifyOtpCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response(
            {'message': 'OTP kod muvaffaqiyatli tasdiqlandi!'},
            status=status.HTTP_200_OK
        )



@extend_schema(tags=['Auth'])
class ForgotPasswordAPIView(APIView):

    @extend_schema(
        request=ForgotPasswordSerializer,
        responses={200: None},
        summary="Parolni tiklash uchun kod yuborish"
    )
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        code = str(randint(10 ** 5, 10 ** 6))
        send_email(email, code)

        redis_client.set(f"{email}_reset_code", code, ex=120)

        return Response(
            {'message': 'Tasdiqlash kodi emailga yuborildi!'},
            status=status.HTTP_200_OK
        )


@extend_schema(tags=['Auth'])
class ForgotPasswordVerifyAPIView(APIView):

    @extend_schema(
        request=ForgotPasswordVerifySerializer,
        responses={200: None},
        summary="Parolni tiklash kodini tasdiqlash"
    )
    def post(self, request):
        serializer = ForgotPasswordVerifySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        redis_client.delete(f"{email}_reset_code")
        redis_client.set(f"{email}_verified", "1", ex=300)

        return Response(
            {'message': "Kod tasdiqlandi! Yangi parol o'rnating."},
            status=status.HTTP_200_OK
        )


@extend_schema(tags=['Auth'])
class ResetPasswordAPIView(APIView):

    @extend_schema(
        request=ResetPasswordSerializer,
        responses={200: None},
        summary="Yangi parol o'rnatish"
    )
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        new_password = serializer.validated_data['new_password']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'Foydalanuvchi topilmadi!'},
                status=status.HTTP_404_NOT_FOUND
            )

        user.set_password(new_password)
        user.save()

        redis_client.delete(f"{email}_verified")

        return Response(
            {'message': "Parol muvaffaqiyatli o'zgartirildi!"},
            status=status.HTTP_200_OK
        )



@extend_schema(tags=['Products'], summary= "product view")
class ProductListAPIView(ListAPIView):
    queryset = Product.objects.select_related('category').prefetch_related('photos').all()
    serializer_class = ProductListSerializer


@extend_schema(tags=['Products'] , summary='product detail')
class ProductDetailAPIView(RetrieveAPIView):
    queryset = Product.objects.select_related('category').prefetch_related('photos').all()
    serializer_class = ProductDetailSerializer

@extend_schema(tags=['Products'],parameters=[ProductSearchSerializer] , summary="product search")
class ProductSearchAPIView(ListAPIView):
    serializer_class = ProductListSerializer

    def get_queryset(self):
        serializer = ProductSearchSerializer(data=self.request.query_params)
        serializer.is_valid(raise_exception=True)
        title = serializer.validated_data.get('title', '')
        return Product.objects.select_related('category').prefetch_related('photos').filter(
            title__icontains=title
        )


@extend_schema(tags=['Categories'] , summary="category view")
class CategoryListAPIView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


@extend_schema(tags=['Categories'],summary="product view with category")
class CategoryProductListAPIView(RetrieveAPIView):
    queryset = Category.objects.prefetch_related('product_set__photos').all()
    serializer_class = CategoryProductSerializer


from rest_framework.permissions import IsAuthenticated


@extend_schema(tags=['Profile'] )
class ProfileAPIView(RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ['get', 'patch']
    def get_object(self):
        return self.request.user


@extend_schema(tags=['Profile'])
class ChangePasswordAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    @extend_schema(request=ChangePasswordSerializer, responses={200: None}, summary="Parolni o'zgartirish")
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user

        if not user.check_password(serializer.validated_data['old_password']):
            return Response(
                {'error': 'Eski parol noto\'g\'ri!'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response({'message': 'Parol muvaffaqiyatli o\'zgartirildi!'}, status=status.HTTP_200_OK)


from apps.models import Cart, CartItem
from apps.serializers import CartSerializer, CartItemSerializer, CartItemUpdateSerializer


@extend_schema(tags=['Cart'])
class CartAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get_cart(self, user):
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart

    @extend_schema(responses=CartSerializer, summary="Savatni ko'rish")
    def get(self, request):
        cart = self.get_cart(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @extend_schema(request=CartItemSerializer, responses=CartSerializer, summary="Savatga mahsulot qo'shish")
    def post(self, request):
        cart = self.get_cart(request.user)
        serializer = CartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product = serializer.validated_data['product']
        quantity = serializer.validated_data.get('quantity', 1)

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        if not created:
            item.quantity += quantity
            item.save()

        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)

    @extend_schema(summary="Savatni tozalash")
    def delete(self, request):
        cart = self.get_cart(request.user)
        cart.items.all().delete()
        return Response({'message': 'Savat tozalandi!'}, status=status.HTTP_200_OK)


@extend_schema(tags=['Cart'])
class CartItemAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get_item(self, pk, user):
        return CartItem.objects.filter(
            pk=pk, cart__user=user
        ).select_related('product').first()

    @extend_schema(request=CartItemUpdateSerializer, responses=CartSerializer, summary="Miqdorni o'zgartirish")
    def patch(self, request, pk):
        item = self.get_item(pk, request.user)
        if not item:
            return Response({'error': 'Topilmadi!'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CartItemUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        item.quantity = serializer.validated_data['quantity']
        item.save()

        return Response(CartSerializer(item.cart).data)

    @extend_schema(summary="Savatdan mahsulotni o'chirish")
    def delete(self, request, pk):
        item = self.get_item(pk, request.user)
        if not item:
            return Response({'error': 'Topilmadi!'}, status=status.HTTP_404_NOT_FOUND)

        cart = item.cart
        item.delete()
        return Response(CartSerializer(cart).data)


# apps/views.py ga QO'SHISH kerak (mavjud kodni o'zgartirmang)

from apps.models import Wishlist
from apps.serializers import WishlistSerializer


@extend_schema(tags=['Wishlist'])
class WishlistAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get_wishlist(self, user):
        wishlist, _ = Wishlist.objects.get_or_create(user=user)
        return wishlist

    @extend_schema(responses=WishlistSerializer, summary="Wishlistni ko'rish")
    def get(self, request):
        wishlist = self.get_wishlist(request.user)
        return Response(WishlistSerializer(wishlist).data)

    @extend_schema(summary="Wishlistga mahsulot qo'shish")
    def post(self, request):
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'error': 'product_id talab qilinadi'}, status=status.HTTP_400_BAD_REQUEST)
        wishlist = self.get_wishlist(request.user)
        try:
            product = Product.objects.get(pk=product_id)
            wishlist.products.add(product)
            return Response(WishlistSerializer(wishlist).data)
        except Product.DoesNotExist:
            return Response({'error': 'Mahsulot topilmadi'}, status=status.HTTP_404_NOT_FOUND)

    @extend_schema(summary="Wishlistdan mahsulot o'chirish")
    def delete(self, request):
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'error': 'product_id talab qilinadi'}, status=status.HTTP_400_BAD_REQUEST)
        wishlist = self.get_wishlist(request.user)
        try:
            product = Product.objects.get(pk=product_id)
            wishlist.products.remove(product)
            return Response(WishlistSerializer(wishlist).data)
        except Product.DoesNotExist:
            return Response({'error': 'Mahsulot topilmadi'}, status=status.HTTP_404_NOT_FOUND)