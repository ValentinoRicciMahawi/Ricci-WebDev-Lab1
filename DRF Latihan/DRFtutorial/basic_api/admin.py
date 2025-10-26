from django.contrib import admin
from basic_api.models import DRFPost, DRFDosen, DRFStudent

# Register your models here.

admin.site.register(DRFPost)
admin.site.register(DRFDosen)
admin.site.register(DRFStudent)