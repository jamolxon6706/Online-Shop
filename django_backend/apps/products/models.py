from django.db import models


class Category(models.Model):
    title = models.CharField(max_length=100)
    photo = models.ImageField(upload_to='categories/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['title']

    def __str__(self):
        return self.title


class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.PositiveIntegerField(default=0, help_text="Discount percent (0-100)")
    quantity = models.PositiveIntegerField(default=0)
    thumbnail_photo = models.ImageField(upload_to='products/thumbnails/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def discounted_price(self):
        if self.discount > 0:
            return float(self.price) * (1 - self.discount / 100)
        return float(self.price)


class ProductPhoto(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='photos')
    photo = models.ImageField(upload_to='products/photos/')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.product.title} - Photo {self.id}"


class ColorVariant(models.Model):
    """Mahsulotning rang varianti — har bir rang uchun alohida rasmlar"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='color_variants')
    name = models.CharField(max_length=100, help_text="Masalan: Space Black, Natural Titanium")
    hex_code = models.CharField(max_length=7, default='#000000', help_text="Rang kodi: #1D1D1F")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.product.title} — {self.name}"


class ColorVariantPhoto(models.Model):
    """Har bir rang variantiga tegishli rasmlar"""
    color_variant = models.ForeignKey(ColorVariant, on_delete=models.CASCADE, related_name='photos')
    photo = models.ImageField(upload_to='products/colors/')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.color_variant} - Photo {self.id}"


class StorageOption(models.Model):
    """
    Xotira/RAM variantlari bilan narx.
    label: "512/8"  (xotira/RAM — faqat MacBook uchun)
    storage: "512GB"
    ram: "8GB" (faqat MacBook uchun, boshqalarda bo'sh)
    price: bu variant narxi
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='storage_options')
    label = models.CharField(max_length=30, help_text="Masalan: 512/8, 1T/16, 256")
    storage = models.CharField(max_length=20, help_text="Masalan: 512GB, 1TB")
    ram = models.CharField(max_length=20, blank=True, help_text="Masalan: 8GB, 16GB (MacBook uchun)")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'price']

    def __str__(self):
        if self.ram:
            return f"{self.product.title} — {self.storage}/{self.ram} (${self.price})"
        return f"{self.product.title} — {self.storage} (${self.price})"
