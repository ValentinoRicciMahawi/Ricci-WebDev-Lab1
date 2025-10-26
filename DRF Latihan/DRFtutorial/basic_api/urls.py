from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from basic_api import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('basic/', views.API_objects.as_view()),
    path('basic/<int:pk>/', views.API_object_detail.as_view()),
    path('dosen/', views.Dosen.as_view()),
    path('student/', views.Student.as_view()),
    path('dosen/<int:pk>/', views.Dosen_object_detail.as_view()),
    path('student/<int:pk>/', views.Student_object_detail.as_view()),
    path('books/', views.book_collection, name='book_collection'),

    path('books/', views.book_collection, name='book_collection'),
    path('books/add/', views.add_book, name='add_book'),
    path('books/edit/<int:pk>/', views.edit_book, name='edit_book'),
    path('books/delete/<int:pk>/', views.delete_book, name='delete_book'),
    path('books/form/', views.book_form, name='book_form'),          # Add new book
    path('books/form/<int:pk>/', views.book_form, name='book_form'), # Edit book

]

urlpatterns = format_suffix_patterns(urlpatterns)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)