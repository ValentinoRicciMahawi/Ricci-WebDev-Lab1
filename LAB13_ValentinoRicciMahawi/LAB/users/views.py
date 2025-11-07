from rest_framework import generics, permissions
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


    # Tambahan

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Nilai
from .serializers import NilaiSerializer, StudentListSerializer

class IsInstructor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'instructor'

class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'

class NilaiViewSet(viewsets.ModelViewSet):
    serializer_class = NilaiSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'instructor':
            return Nilai.objects.filter(instructor=user)
        elif user.role == 'student':
            return Nilai.objects.filter(student=user)
        return Nilai.objects.none()

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

    def create(self, request, *args, **kwargs):
        if request.user.role != 'instructor':
            return Response(
                {"error": "Only instructors can add grades"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)

class StudentListView(generics.ListAPIView):
    serializer_class = StudentListSerializer
    permission_classes = [IsInstructor]

    def get_queryset(self):
        return User.objects.filter(role='student')