
from rest_framework import serializers
from .models import Category, Product, ProductPhoto, ColorVariant, ColorVariantPhoto, StorageOption


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'title', 'photo']


class ColorVariantPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColorVariantPhoto
        fields = ['id', 'photo', 'order']


class ColorVariantSerializer(serializers.ModelSerializer):
    photos = ColorVariantPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = ColorVariant
        fields = ['id', 'name', 'hex_code', 'photos', 'order']


class StorageOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StorageOption
        fields = ['id', 'label', 'storage', 'ram', 'price', 'order']


class ProductPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductPhoto
        fields = ['id', 'photo', 'order']


class ProductListSerializer(serializers.ModelSerializer):
    """Kategori va ro'yxat uchun yengil serializer"""
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'price', 'discount', 'quantity',
            'thumbnail_photo', 'category', 'created_at',
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    """Mahsulot detail sahifasi uchun — barcha ma'lumotlar"""
    category = CategorySerializer(read_only=True)
    photos = ProductPhotoSerializer(many=True, read_only=True)
    color_variants = ColorVariantSerializer(many=True, read_only=True)
    storage_options = StorageOptionSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'description', 'price', 'discount', 'quantity',
            'thumbnail_photo', 'category', 'is_active',
            'photos', 'color_variants', 'storage_options',
            'created_at', 'updated_at',
        ]


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Admin panel orqali mahsulot yaratish/tahrirlash"""
    class Meta:
        model = Product
        fields = [
            'id', 'title', 'description', 'price', 'discount', 'quantity',
            'thumbnail_photo', 'category', 'is_active',
        ]
