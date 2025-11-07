from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOISES = (
        ('student', 'Student'),
        ('instructor', 'Instructor'),
    )

    MAJOR_CHOICES = (
        ('artificial_intelligence_and_robotics', 'AIR'),
        ('bussines_mathematics', 'BM'),
        ('digital_bussiness_technology', 'DBT'),
        ('product_design_engineering', 'PDE'),
        ('energy_bussiness_technology', 'EBT'),
        ('food_bussiness_technology', 'FBT'),
    )

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    major = models.CharField(max_length=50, choices=MAJOR_CHOICES, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOISES, default='student')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'full_name']

    def __str__(self):
        return self.email
    
    # Tambahkan di models.py
class Nilai(models.Model):
    student = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE, 
        related_name='grades',
        limit_choices_to={'role': 'student'}
    )
    instructor = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='grades_given',
        limit_choices_to={'role': 'instructor'}
    )
    course_name = models.CharField(max_length=200)
    grade = models.DecimalField(max_digits=5, decimal_places=2)
    semester = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Nilai'

    def __str__(self):
        return f"{self.student.full_name} - {self.course_name}: {self.grade}"