from decimal import Decimal

from rest_framework import serializers
from rest_framework.fields import CharField
from rest_framework.serializers import ModelSerializer, Serializer
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
import os
from redis import Redis
from rest_framework.exceptions import ValidationError
from apps.models import User, Category, Product, ProductPhoto


def _get_redis():
    return Redis(
        host=os.getenv('REDIS_HOST', 'localhost'),
        port=int(os.getenv('REDIS_PORT', 6379)),
        password=os.getenv('REDIS_PASSWORD') or None,
        decode_responses=True,
    )


redis_client = _get_redis()


class VerifyOtpCodeSerializer(Serializer):
    email = CharField(max_length=255)
    code = CharField(max_length=6)

    def validate(self, attrs):
        email = attrs.get('email')
        code = attrs.get('code')

        redis_conn = _get_redis()

        otp_code = redis_conn.get(f"{email}_code")

        if not otp_code:
            raise ValidationError({'error': 'Kodning muddati tugagan'})

        if str(otp_code) != str(code):
            raise ValidationError({'error': 'Kod xato'})

        redis_conn.set(f"{email}_verify", "1", ex=120)
        return attrs


class EmailVerifySerializer(Serializer):
    email = CharField(max_length=255)


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, email):
        if not User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Bu email bilan foydalanuvchi topilmadi!")
        return email


class ForgotPasswordVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)

    def validate(self, data):
        email = data.get('email')
        code = data.get('code')
        saved_code = redis_client.get(f"{email}_reset_code")
        if not saved_code:
            raise serializers.ValidationError("Kod muddati tugagan!")
        if saved_code != code:
            raise serializers.ValidationError("Kod noto'g'ri!")
        return data


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    new_password = serializers.CharField(min_length=8)
    confirm_password = serializers.CharField(min_length=8)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Parollar mos kelmadi!")
        if not redis_client.get(f"{data['email']}_verified"):
            raise serializers.ValidationError("Email tasdiqlanmagan!")
        return data


class UserModelSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'username', 'email', 'phone_number', 'password')

    def validate_password(self, value):  # noqa
        if len(value) < 8:
            raise ValidationError('Parol uzunligi kamida 8 belgidan iborat bo\'lishi kerak')
        return make_password(value)

    def validate_email(self, email):
        redis = _get_redis()
        verify = redis.get(email + '_verify')
        if verify != '1':
            raise ValidationError('Tasdiqlanmagan email kiritildi')
        return email


class ProductPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductPhoto
        fields = ('id', 'photo')


class ProductListSerializer(serializers.ModelSerializer):
    thumbnail_photo = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ('id', 'title', 'price', 'discount', 'thumbnail_photo', 'quantity')

    def get_thumbnail_photo(self, obj):
        if not obj.thumbnail_photo:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.thumbnail_photo.url)
        return obj.thumbnail_photo.url


class ProductDetailSerializer(serializers.ModelSerializer):
    photos = ProductPhotoSerializer(many=True, read_only=True)
    category = serializers.StringRelatedField()

    class Meta:
        model = Product
        fields = ('id', 'title', 'price', 'discount', 'description', 'category', 'quantity', 'thumbnail_photo', 'photos', 'created_at')


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'title', 'photo')


class CategoryProductSerializer(serializers.ModelSerializer):
    products = ProductListSerializer(many=True, read_only=True, source='product_set')

    class Meta:
        model = Category
        fields = ('id', 'title', 'photo', 'products')


class ProductSearchSerializer(serializers.Serializer):
    title = serializers.CharField(required=False, allow_blank=True)


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'phone_number', 'username')
        extra_kwargs = {
            'phone_number': {'read_only': True},
        }


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Parollar mos kelmadi!")
        return data


from apps.models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), write_only=True, source='product'
    )
    total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ('id', 'product', 'product_id', 'quantity', 'total', 'added_at')

    def get_total(self, obj):                                                          # FIX 1: indentatsiya tuzatildi
        discounted = obj.product.price * (1 - Decimal(str(obj.product.discount)) / 100)
        return discounted * obj.quantity


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    items_count = serializers.SerializerMethodField()
    class Meta:
        model = Cart
        fields = ('id', 'items', 'total_price', 'items_count', 'updated_at', )

    def get_total_price(self, obj):                                                    # FIX 2: indentatsiya tuzatildi
        return sum(                                                                    # FIX 3: ortiqcha ')' o'chirildi
            item.product.price * (1 - Decimal(str(item.product.discount)) / 100) * item.quantity
            for item in obj.items.all()
        )

    def get_items_count(self, obj):
        return obj.items.count()


class CartItemUpdateSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1, max_value=100)


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(                                                           # FIX 4: authenticate import qilindi
            request=self.context.get('request'),
            username=email,
            password=password
        )

        if not user:
            try:
                from apps.models import User
                user_obj = User.objects.get(email=email)
                if user_obj.check_password(password):
                    user = user_obj
            except User.DoesNotExist:
                pass

        if not user:
            raise serializers.ValidationError('Email yoki parol xato!')

        refresh = self.get_token(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer



from apps.models import Wishlist

class WishlistSerializer(serializers.ModelSerializer):
    products = ProductListSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ('id', 'products')