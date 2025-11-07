from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, CustomTokenObtainPairView, NilaiViewSet, StudentListView
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'grades', NilaiViewSet, basename='nilai')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('students/', StudentListView.as_view(), name='student_list'),
    path('', include(router.urls)),
]