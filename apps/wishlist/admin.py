from django.contrib import admin
from .models import Wishlist


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'products_count', 'updated_at']
    search_fields = ['user__email', 'user__username']

    def products_count(self, obj):
        return obj.products.count()
    products_count.short_description = "Mahsulotlar soni"
