from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SiswaViewSet, ProdiViewSet, KuliahViewSet, RegistrasiViewSet

router = DefaultRouter()
router.register(r'siswa', SiswaViewSet)
router.register(r'prodi', ProdiViewSet)
router.register(r'kuliah', KuliahViewSet)
router.register(r'registrasi', RegistrasiViewSet)

urlpatterns = [
    path('', include(router.urls)),
]