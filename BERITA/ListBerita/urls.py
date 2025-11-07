from django.urls import path
from . import views

urlpatterns = [
    path('', views.berita_list, name='berita_list'),
    path('<int:pk>/', views.berita_detail, name='berita_detail'),
]