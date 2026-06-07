from django.db import models
from django.conf import settings


class Wishlist(models.Model):
    """Har bir foydalanuvchining istaklar ro'yxati"""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='wishlist'
    )
    products = models.ManyToManyField(
        'products.Product',
        blank=True,
        related_name='wishlisted_by'
    )
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user}'s Wishlist ({self.products.count()} ta mahsulot)"
