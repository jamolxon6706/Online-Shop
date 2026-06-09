from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractUser, UserManager
from django.db.models import Model, ForeignKey, PROTECT, ImageField, TextChoices, CASCADE, SET_NULL, Index, \
    OneToOneField, ManyToManyField, SlugField
from django.db.models.fields import BigAutoField, CharField, TextField, DecimalField, \
    SmallIntegerField, BooleanField, PositiveIntegerField, PositiveSmallIntegerField, DateTimeField
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify


class CustomUserManager(UserManager):
    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("Email must be set")
        user = self.model(email=email, **extra_fields)
        user.password = make_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = CharField(max_length=150, unique=True, null=True, blank=True)
    email = CharField(max_length=255, unique=True, null=True, blank=True)
    first_name = CharField(max_length=150, blank=True)
    last_name = CharField(max_length=150, blank=True)
    phone_number = CharField("Telefon raqami", max_length=20, unique=True, null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = "Foydalanuvchi"
        verbose_name_plural = "Foydalanuvchilar"


class Category(Model):
    title = CharField(max_length=255)
    photo = ImageField(upload_to="categories/")

    class Meta:
        verbose_name = "Kategoriya"
        verbose_name_plural = "Kategoriyalar"

    def __str__(self):
        return self.title


class Product(Model):
    title = CharField(max_length=255)
    slug = SlugField(max_length=300, unique=True, blank=True)
    price = DecimalField("Asosiy narx", max_digits=14, decimal_places=0)
    discount = PositiveSmallIntegerField(
        "Chegirma (%)",
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    description = TextField()
    category = ForeignKey('apps.Category', on_delete=PROTECT)
    quantity = SmallIntegerField()
    thumbnail_photo = ImageField("Asosiy rasm", upload_to="products/thumbnails/", null=True, blank=True)
    is_active = BooleanField("Faol", default=True)
    created_at = DateTimeField(auto_now_add=True, null=True, blank=True, db_index=True)

    class Meta:
        verbose_name = "Mahsulot"
        verbose_name_plural = "Mahsulotlar"
        indexes = [
            Index(fields=["category", "price"], name="product_cat_price_idx"),
            Index(fields=["price"], name="product_price_idx"),
            Index(fields=["quantity"], name="product_qty_idx"),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)
            slug = base
            n = 2
            while Product.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{n}"
                n += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ProductPhoto(Model):
    id = BigAutoField(primary_key=True)
    photo = ImageField("Rasm", upload_to="products/")
    product = ForeignKey(
        Product,
        verbose_name="Mahsulot",
        on_delete=CASCADE,
        related_name="photos",
        db_column="product_id",
    )

    class Meta:
        db_table = "product_photos"
        verbose_name = "Mahsulot rasmi"
        verbose_name_plural = "Mahsulot rasmlari"


class ColorVariant(Model):
    product = ForeignKey(Product, on_delete=CASCADE, related_name="color_variants")
    name = CharField("Nomi", max_length=100)
    hex_code = CharField("Hex kod", max_length=20)
    order = PositiveSmallIntegerField("Tartib", default=0)

    class Meta:
        verbose_name = "Rang varianti"
        verbose_name_plural = "Rang variantlari"
        ordering = ["order"]

    def __str__(self):
        return f"{self.product.title} — {self.name}"


class ColorVariantPhoto(Model):
    variant = ForeignKey(ColorVariant, on_delete=CASCADE, related_name="photos")
    photo = ImageField("Rasm", upload_to="products/colors/")
    order = PositiveSmallIntegerField("Tartib", default=0)

    class Meta:
        verbose_name = "Rang rasmi"
        verbose_name_plural = "Rang rasmlari"
        ordering = ["order"]


class StorageOption(Model):
    product = ForeignKey(Product, on_delete=CASCADE, related_name="storage_options")
    label = CharField("Yorliq", max_length=50)
    storage = CharField("Xotira", max_length=50)
    ram = CharField("RAM", max_length=50, blank=True, default="")
    price = DecimalField("Narx", max_digits=14, decimal_places=0)
    order = PositiveSmallIntegerField("Tartib", default=0)

    class Meta:
        verbose_name = "Xotira varianti"
        verbose_name_plural = "Xotira variantlari"
        ordering = ["order"]

    def __str__(self):
        return f"{self.product.title} — {self.label}"


class Order(Model):
    class Status(TextChoices):
        PENDING = "pending", "Buyurtma qabul qilinmoqda"
        PREPARING = "preparing", "Buyurtma qadoqlanmoqda"
        SHIPPING = "shipping", "Yetkazilmoqda"
        DELIVERED = "delivered", "Buyurtma egasiga yetkazildi"

    product = ForeignKey("apps.Product", verbose_name="Mahsulot", on_delete=CASCADE, related_name="orders")
    user = ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=SET_NULL,
        related_name="orders",
        null=True,
        blank=True,
        verbose_name="Foydalanuvchi",
    )
    first_name = CharField("Ism", max_length=200)
    phone_number = CharField("Telefon raqami", max_length=20)
    quantity = PositiveIntegerField("Miqdor", default=1)
    has_discount = BooleanField("Chegirma bilan sotib olinganmi", default=False)
    status = CharField("Holat", max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = DateTimeField("Yaratilgan", auto_now_add=True)
    updated_at = DateTimeField("Yangilangan", auto_now=True)

    class Meta:
        verbose_name = "Buyurtma"
        verbose_name_plural = "Buyurtmalar"

    def __str__(self):
        return f"Buyurtma #{self.pk}"


class OrderHistory(Order):
    class Meta:
        proxy = True
        verbose_name = "Buyurtma tarixi"
        verbose_name_plural = "Buyurtmalar tarixi"


class Payment(Model):
    class PayStatus(TextChoices):
        REVIEW = "review", "Ko'rib chiqish"
        COMPLETED = "complete", "Yakunlandi"
        CANCELED = "canceled", "Rad etildi"

    class PayType(TextChoices):
        COIN = "coin", "Tanga"
        MONEY = "money", "Pul"

    card_number = CharField("Karta raqami", max_length=16)
    amount = DecimalField("Miqdor", max_digits=12, decimal_places=0)
    status = CharField("Holat", max_length=20, choices=PayStatus.choices, default=PayStatus.REVIEW)
    check_photo = ImageField("Chek rasmi", upload_to="pays/", null=True, blank=True)
    type = CharField("To'lov turi", max_length=10, choices=PayType.choices, default=PayType.MONEY)
    created_at = DateTimeField("Yaratilgan", auto_now_add=True)
    updated_at = DateTimeField("Yangilangan", auto_now=True)
    user = ForeignKey(
        'apps.User',
        verbose_name="Foydalanuvchi",
        on_delete=SET_NULL,
        related_name="payments",
        null=True,
        blank=True,
    )

    class Meta:
        verbose_name = "To'lov"
        verbose_name_plural = "To'lovlar"


class Cart(Model):
    user = OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=CASCADE,
        related_name="cart",
        verbose_name="Foydalanuvchi"
    )
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Savat"
        verbose_name_plural = "Savatlar"

    def __str__(self):
        return f"{self.user.email} savati"


class CartItem(Model):
    cart = ForeignKey(Cart, on_delete=CASCADE, related_name="items", verbose_name="Savat")
    product = ForeignKey("apps.Product", on_delete=CASCADE, related_name="cart_items", verbose_name="Mahsulot")
    quantity = PositiveSmallIntegerField("Miqdor", default=1)
    added_at = DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Savat mahsuloti"
        verbose_name_plural = "Savat mahsulotlari"
        unique_together = ("cart", "product")
        ordering = ["added_at"]   # ← tartibni saqlash uchun

    def __str__(self):
        return f"{self.product.title} x {self.quantity}"


class Wishlist(Model):
    user = OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=CASCADE,
        related_name="wishlist",
        verbose_name="Foydalanuvchi"
    )
    products = ManyToManyField(
        "apps.Product",
        related_name="wishlisted_by",
        blank=True,
        verbose_name="Mahsulotlar"
    )

    class Meta:
        verbose_name = "Sevimlilar"
        verbose_name_plural = "Sevimlilar"

    def __str__(self):
        return f"{self.user.email} sevimlilar"