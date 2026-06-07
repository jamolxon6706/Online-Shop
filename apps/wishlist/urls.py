from django.urls import path
from . import views

urlpatterns = [
    path('wishlist/',                       views.WishlistView.as_view(),      name='wishlist'),
    path('wishlist/clear/',                 views.WishlistClearView.as_view(),  name='wishlist-clear'),
    path('wishlist/check/<int:product_id>/',views.WishlistCheckView.as_view(),  name='wishlist-check'),
]
