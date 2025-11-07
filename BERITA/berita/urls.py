from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BeritaViewSet, KomentarViewSet

router = DefaultRouter()
router.register('berita', BeritaViewSet)
router.register('komentar', KomentarViewSet)

urlpatterns = [
    path('', include(router.urls)),
]