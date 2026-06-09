from decimal import Decimal

from drf_spectacular.utils import extend_schema
from rest_framework import serializers, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.models import (
    Product, Category, ColorVariant, ColorVariantPhoto, StorageOption,
    Order, User,
)
from apps.serializers import (
    ProductDetailSerializer, ProductListSerializer,
    ColorVariantSerializer, StorageOptionSerializer,
    OrderSerializer,
)


# ─── Stats ────────────────────────────────────────────────

@extend_schema(tags=['Admin'])
class AdminStatsAPIView(APIView):
    permission_classes = (IsAdminUser,)

    @extend_schema(summary="Admin statistika")
    def get(self, request):
        from django.db.models import Sum
        total_products = Product.objects.count()
        total_orders = Order.objects.count()
        revenue = Order.objects.aggregate(
            total=Sum('product__price')
        )['total'] or Decimal('0')
        total_users = User.objects.count()
        recent_orders = OrderSerializer(
            Order.objects.select_related('product', 'user').order_by('-created_at')[:10],
            many=True,
        ).data
        return Response({
            'total_products': total_products,
            'total_orders': total_orders,
            'revenue': str(revenue),
            'total_users': total_users,
            'recent_orders': recent_orders,
        })


# ─── Products ─────────────────────────────────────────────

class AdminProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('title', 'price', 'discount', 'description', 'category',
                  'quantity', 'thumbnail_photo', 'is_active')
        extra_kwargs = {
            'thumbnail_photo': {'required': False},
            'discount': {'required': False},
            'is_active': {'required': False},
        }


class AdminProductUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('title', 'price', 'discount', 'description', 'category',
                  'quantity', 'thumbnail_photo', 'is_active')
        extra_kwargs = {field: {'required': False} for field in (
            'title', 'price', 'discount', 'description', 'category',
            'quantity', 'thumbnail_photo', 'is_active',
        )}


@extend_schema(tags=['Admin'])
class AdminProductListCreateAPIView(APIView):
    permission_classes = (IsAdminUser,)
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @extend_schema(responses=ProductDetailSerializer(many=True), summary="Mahsulotlar ro'yxati (admin)")
    def get(self, request):
        qs = Product.objects.select_related('category').prefetch_related(
            'photos', 'color_variants__photos', 'storage_options'
        ).order_by('-created_at')
        return Response(ProductDetailSerializer(qs, many=True, context={'request': request}).data)

    @extend_schema(request=AdminProductCreateSerializer, responses=ProductDetailSerializer, summary="Mahsulot yaratish")
    def post(self, request):
        ser = AdminProductCreateSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        product = ser.save()
        return Response(
            ProductDetailSerializer(product, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )


@extend_schema(tags=['Admin'])
class AdminProductDetailAPIView(APIView):
    permission_classes = (IsAdminUser,)
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def _get_product(self, pk):
        try:
            return Product.objects.prefetch_related(
                'photos', 'color_variants__photos', 'storage_options'
            ).get(pk=pk)
        except Product.DoesNotExist:
            return None

    @extend_schema(request=AdminProductUpdateSerializer, responses=ProductDetailSerializer, summary="Mahsulot yangilash")
    def patch(self, request, pk):
        product = self._get_product(pk)
        if not product:
            return Response({'error': 'Topilmadi'}, status=status.HTTP_404_NOT_FOUND)
        ser = AdminProductUpdateSerializer(product, data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ProductDetailSerializer(product, context={'request': request}).data)

    @extend_schema(summary="Mahsulot o'chirish")
    def delete(self, request, pk):
        product = self._get_product(pk)
        if not product:
            return Response({'error': 'Topilmadi'}, status=status.HTTP_404_NOT_FOUND)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ─── Color Variants ───────────────────────────────────────

class ColorVariantCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColorVariant
        fields = ('name', 'hex_code', 'order')
        extra_kwargs = {'order': {'required': False}}


@extend_schema(tags=['Admin'])
class AdminColorVariantCreateAPIView(APIView):
    permission_classes = (IsAdminUser,)

    @extend_schema(request=ColorVariantCreateSerializer, responses=ColorVariantSerializer, summary="Rang varianti qo'shish")
    def post(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({'error': 'Mahsulot topilmadi'}, status=status.HTTP_404_NOT_FOUND)
        ser = ColorVariantCreateSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        variant = ser.save(product=product)
        return Response(ColorVariantSerializer(variant).data, status=status.HTTP_201_CREATED)


# ─── Color Variant Photos ─────────────────────────────────

@extend_schema(tags=['Admin'])
class AdminColorPhotoUploadAPIView(APIView):
    permission_classes = (IsAdminUser,)
    parser_classes = (MultiPartParser, FormParser)

    @extend_schema(summary="Rang rasmlari yuklash (bir nechta)")
    def post(self, request, pk):
        try:
            variant = ColorVariant.objects.get(pk=pk)
        except ColorVariant.DoesNotExist:
            return Response({'error': 'Rang varianti topilmadi'}, status=status.HTTP_404_NOT_FOUND)
        files = request.FILES.getlist('photos')
        if not files:
            return Response({'error': 'photos fayllari talab qilinadi'}, status=status.HTTP_400_BAD_REQUEST)
        created = []
        for i, f in enumerate(files):
            photo = ColorVariantPhoto.objects.create(variant=variant, photo=f, order=i)
            created.append({'id': photo.id, 'photo': request.build_absolute_uri(photo.photo.url)})
        return Response(created, status=status.HTTP_201_CREATED)


# ─── Storage Options ──────────────────────────────────────

class StorageOptionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StorageOption
        fields = ('label', 'storage', 'ram', 'price', 'order')
        extra_kwargs = {'ram': {'required': False}, 'order': {'required': False}}


@extend_schema(tags=['Admin'])
class AdminStorageOptionCreateAPIView(APIView):
    permission_classes = (IsAdminUser,)

    @extend_schema(request=StorageOptionCreateSerializer, responses=StorageOptionSerializer, summary="Xotira varianti qo'shish")
    def post(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({'error': 'Mahsulot topilmadi'}, status=status.HTTP_404_NOT_FOUND)
        ser = StorageOptionCreateSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        option = ser.save(product=product)
        return Response(StorageOptionSerializer(option).data, status=status.HTTP_201_CREATED)


# ─── Admin Customers ──────────────────────────────────────

@extend_schema(tags=['Admin'])
class AdminCustomerListAPIView(APIView):
    permission_classes = (IsAdminUser,)

    @extend_schema(summary="Foydalanuvchilar ro'yxati (admin)")
    def get(self, request):
        from django.db.models import Count, Sum, F, ExpressionWrapper
        from django.db.models import DecimalField as DField
        users = (
            User.objects
            .annotate(
                orders_count=Count('orders'),
                total_spent=Sum(
                    ExpressionWrapper(
                        F('orders__product__price') * F('orders__quantity'),
                        output_field=DField(max_digits=14, decimal_places=0),
                    )
                ),
            )
            .order_by('-date_joined')
        )
        data = [
            {
                'id': u.id,
                'name': f"{u.first_name} {u.last_name}".strip() or u.email or '',
                'email': u.email or '',
                'phone': u.phone_number or '',
                'orders_count': u.orders_count,
                'total_spent': str(u.total_spent or 0),
                'date_joined': u.date_joined.date().isoformat() if u.date_joined else '',
                'is_active': u.is_active,
            }
            for u in users
        ]
        return Response(data)


# ─── Admin Orders ─────────────────────────────────────────

@extend_schema(tags=['Admin'])
class AdminOrderListAPIView(APIView):
    permission_classes = (IsAdminUser,)

    @extend_schema(responses=OrderSerializer(many=True), summary="Barcha buyurtmalar (admin)")
    def get(self, request):
        orders = Order.objects.select_related('product', 'user').order_by('-created_at')
        return Response(OrderSerializer(orders, many=True).data)
