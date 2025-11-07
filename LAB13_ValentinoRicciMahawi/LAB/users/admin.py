from django.contrib import admin
from .models import CustomUser
from django.contrib.auth.admin import UserAdmin
from .models import Nilai

# Register your models here.

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'full_name', 'major', 'role')

    list_filter = ('role', 'major')

    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal Info', {'fields': ('full_name', 'major', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'full_name', 'major', 'role', 'password1', 'password2'),
        }),
    )

    ordering = ('email',)

admin.site.register(CustomUser, CustomUserAdmin)

# Tambahan

class NilaiAdmin(admin.ModelAdmin):
    list_display = ('student', 'course_name', 'grade', 'instructor', 'semester', 'created_at')
    list_filter = ('semester', 'instructor')
    search_fields = ('student__full_name', 'course_name')

admin.site.register(Nilai, NilaiAdmin)