from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import BukuViewSet, TransaksiViewSet, CatatanViewSet

# Router untuk API


app_name = 'tabungan'
urlpatterns = [
    # URL untuk views yang sudah ada (HTML templates)
    path('', views.list_buku, name='list_buku'),
    path('buku/create', views.create_buku, name='create_buku'),
    path('buku/update/<int:buku_id>/', views.update_buku, name='update_buku'),
    path('buku/delete/<int:buku_id>/', views.delete_buku, name='delete_buku'),
    path('buku/detail/<int:buku_id>/', views.detail_buku, name='detail_buku'),
    path('buku/<int:buku_id>/transaksi/create/', views.create_transaksi, name='create_transaksi'),
    
    # URL untuk REST API
    
]