from django.contrib import admin
from basic_api.models import DRFPost

# Custom admin untuk tampilan yang lebih baik
@admin.register(DRFPost)
class DRFPostAdmin(admin.ModelAdmin):
    list_display = ['name', 'author', 'rating', 'uploaded']
    list_filter = ['rating', 'uploaded']
    search_fields = ['name', 'author']
    readonly_fields = ['uploaded']