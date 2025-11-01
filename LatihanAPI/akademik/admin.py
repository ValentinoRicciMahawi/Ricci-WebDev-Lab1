from django.contrib import admin
from .models import Prodi, Siswa, Kuliah, Registrasi


@admin.register(Prodi)
class ProdiAdmin(admin.ModelAdmin):
    list_display = ['id', 'nama', 'kaprodi']
    search_fields = ['nama', 'kaprodi']


@admin.register(Siswa)
class SiswaAdmin(admin.ModelAdmin):
    list_display = ['id', 'nama', 'nim', 'prodi']
    list_filter = ['prodi']
    search_fields = ['nama', 'nim']
    list_select_related = ['prodi']


@admin.register(Kuliah)
class KuliahAdmin(admin.ModelAdmin):
    list_display = ['id', 'mata_kuliah', 'prodi', 'hari', 'sks']
    list_filter = ['prodi', 'hari']
    search_fields = ['mata_kuliah']
    list_select_related = ['prodi']


@admin.register(Registrasi)
class RegistrasiAdmin(admin.ModelAdmin):
    list_display = ['id', 'student', 'kuliah', 'tanggal_registrasi']
    list_filter = ['tanggal_registrasi', 'kuliah__hari']
    search_fields = ['student__nama', 'student__nim', 'kuliah__mata_kuliah']
    list_select_related = ['student', 'kuliah']
    date_hierarchy = 'tanggal_registrasi'