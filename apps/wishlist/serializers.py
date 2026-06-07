from rest_framework import serializers
from apps.products.serializers import ProductListSerializer
from .models import Wishlist


class WishlistSerializer(serializers.ModelSerializer):
    products = ProductListSerializer(many=True, read_only=True)
    products_count = serializers.SerializerMethodField()

    class Meta:
        model = Wishlist
        fields = ['id', 'products', 'products_count', 'updated_at']

    def get_products_count(self, obj):
        return obj.products.count()
