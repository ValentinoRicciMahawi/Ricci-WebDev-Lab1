"""
URL configuration for bankingapp project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from tabungan.views import BukuViewSet, TransaksiViewSet, CatatanViewSet

api_router = DefaultRouter()
api_router.register(r'buku', BukuViewSet, basename='api-buku')
api_router.register(r'transaksi', TransaksiViewSet, basename='api-transaksi')
api_router.register(r'catatan', CatatanViewSet, basename='api-catatan')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('tabungan/', include('tabungan.urls')),
    path('api/', include(api_router.urls)),
]
