# Loyiha tuzilmasi

```
root/
├── apps/                    ← Django apps
│   ├── products/            ← Mahsulotlar (models, views, urls)
│   ├── wishlist/            ← Istaklar ro'yxati
│   ├── cart/                ← Savat
│   ├── orders/              ← Buyurtmalar
│   └── accounts/            ← Foydalanuvchilar
├── OnlineShop/              ← Django settings (sizning mavjud)
├── Media/                   ← Yuklangan rasmlar (sizning mavjud)
├── templates/               ← Next.js frontend
│   ├── app/                 ← Sahifalar (Next.js App Router)
│   ├── components/          ← UI komponentlar
│   ├── lib/                 ← API, store-context, types
│   ├── hooks/               ← React hooks
│   ├── public/              ← Statik fayllar
│   └── styles/              ← CSS
├── manage.py
├── requirements.txt
├── .env
└── db.sqlite3
```

## Backend ishga tushirish

```bash
# Virtual env
python -m venv .venv
.venv\Scripts\activate        # Windows
source .venv/bin/activate     # Mac/Linux

# Paketlar
pip install -r requirements.txt

# Migrate
python manage.py makemigrations
python manage.py migrate

# Server
python manage.py runserver
```

## Frontend ishga tushirish

```bash
cd templates
npm install       # yoki: pnpm install
npm run dev       # http://localhost:3000
```

## .env fayl (root da)
```
SECRET_KEY=...
DEBUG=True
```

## templates/.env.local fayl
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## apps/wishlist ni settings.py ga qo'shish

```python
INSTALLED_APPS = [
    ...
    'apps.products',
    'apps.wishlist',
    'apps.cart',
    'apps.orders',
    'apps.accounts',
]
```

## urls.py (OnlineShop/urls.py) ga qo'shish

```python
from django.urls import path, include

urlpatterns = [
    path('api/', include('apps.products.urls')),
    path('api/', include('apps.wishlist.urls')),
]
```
