from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProdiViewSet, SiswaViewSet, KuliahViewSet, RegistrasiViewSet

# Setup router
router = DefaultRouter()
router.register(r'prodi', ProdiViewSet, basename='prodi')
router.register(r'siswa', SiswaViewSet, basename='siswa')
router.register(r'kuliah', KuliahViewSet, basename='kuliah')
router.register(r'registrasi', RegistrasiViewSet, basename='registrasi')

app_name = 'akademik'

urlpatterns = [
    path('api/', include(router.urls)),
]