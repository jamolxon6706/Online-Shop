from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
from .models import Category, Product, ColorVariant, ColorVariantPhoto, StorageOption, ProductPhoto
from .serializers import (
    CategorySerializer, ProductListSerializer, ProductDetailSerializer,
    ProductCreateUpdateSerializer, ColorVariantSerializer,
    ColorVariantPhotoSerializer, StorageOptionSerializer,
)


# ─── Category Views ───────────────────────────────────────

class CategoryListView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]


class CategoryDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

        products = Product.objects.filter(category=category, is_active=True)
        cat_data = CategorySerializer(category).data
        prod_data = ProductListSerializer(products, many=True, context={'request': request}).data
        return Response({'category': cat_data, 'products': prod_data})


# ─── Product Views ────────────────────────────────────────

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True).select_related('category')
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True).prefetch_related(
        'photos', 'color_variants__photos', 'storage_options'
    ).select_related('category')
    serializer_class = ProductDetailSerializer
    permission_classes = [AllowAny]


class ProductSearchView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        query = self.request.query_params.get('title', '').strip()
        if not query:
            return Product.objects.none()
        return Product.objects.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query) |
            Q(category__title__icontains=query),
            is_active=True
        ).select_related('category')[:20]


# ─── Admin Product Views ──────────────────────────────────

class AdminProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all().select_related('category').prefetch_related(
        'color_variants__photos', 'storage_options', 'photos'
    )
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ProductDetailSerializer
        return ProductCreateUpdateSerializer


class AdminProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all().prefetch_related('color_variants__photos', 'storage_options', 'photos')
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ProductDetailSerializer
        return ProductCreateUpdateSerializer


# ─── Color Variant Admin Views ────────────────────────────

class ColorVariantListCreateView(generics.ListCreateAPIView):
    serializer_class = ColorVariantSerializer
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        product_id = self.kwargs['product_id']
        return ColorVariant.objects.filter(product_id=product_id).prefetch_related('photos')

    def perform_create(self, serializer):
        serializer.save(product_id=self.kwargs['product_id'])


class ColorVariantPhotoUploadView(APIView):
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, variant_id):
        try:
            variant = ColorVariant.objects.get(pk=variant_id)
        except ColorVariant.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

        photos = request.FILES.getlist('photos')
        created = []
        for i, photo in enumerate(photos):
            obj = ColorVariantPhoto.objects.create(color_variant=variant, photo=photo, order=i)
            created.append({'id': obj.id, 'photo': request.build_absolute_uri(obj.photo.url)})

        return Response({'created': created}, status=201)


# ─── Storage Option Admin Views ───────────────────────────

class StorageOptionListCreateView(generics.ListCreateAPIView):
    serializer_class = StorageOptionSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return StorageOption.objects.filter(product_id=self.kwargs['product_id'])

    def perform_create(self, serializer):
        serializer.save(product_id=self.kwargs['product_id'])


class StorageOptionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = StorageOption.objects.all()
    serializer_class = StorageOptionSerializer
    permission_classes = [IsAdminUser]


# ─── Admin Stats ──────────────────────────────────────────

class AdminStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        from apps.orders.models import Order
        from apps.accounts.models import User

        total_products = Product.objects.count()
        active_products = Product.objects.filter(is_active=True).count()
        total_categories = Category.objects.count()
        total_orders = Order.objects.count() if hasattr(Order, 'objects') else 0
        total_users = User.objects.count() if hasattr(User, 'objects') else 0
        low_stock = Product.objects.filter(quantity__lt=5, is_active=True).count()

        return Response({
            'total_products': total_products,
            'active_products': active_products,
            'total_categories': total_categories,
            'total_orders': total_orders,
            'total_users': total_users,
            'low_stock': low_stock,
        })
