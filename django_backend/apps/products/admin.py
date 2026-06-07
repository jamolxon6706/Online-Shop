from django.contrib import admin
from .models import Category, Product, ProductPhoto, ColorVariant, ColorVariantPhoto, StorageOption


class ProductPhotoInline(admin.TabularInline):
    model = ProductPhoto
    extra = 1


class ColorVariantPhotoInline(admin.TabularInline):
    model = ColorVariantPhoto
    extra = 1


class ColorVariantInline(admin.StackedInline):
    model = ColorVariant
    extra = 0
    show_change_link = True


class StorageOptionInline(admin.TabularInline):
    model = StorageOption
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'created_at']
    search_fields = ['title']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'category', 'price', 'discount', 'quantity', 'is_active', 'created_at']
    list_filter = ['category', 'is_active', 'created_at']
    search_fields = ['title', 'description']
    list_editable = ['is_active', 'quantity']
    inlines = [ProductPhotoInline, ColorVariantInline, StorageOptionInline]


@admin.register(ColorVariant)
class ColorVariantAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'name', 'hex_code']
    inlines = [ColorVariantPhotoInline]


@admin.register(StorageOption)
class StorageOptionAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'label', 'storage', 'ram', 'price', 'order']
    list_editable = ['price', 'order']
