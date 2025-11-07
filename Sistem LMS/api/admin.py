from django.contrib import admin
from .models import Siswa, Prodi, Kuliah, Registrasi


@admin.register(Prodi)
class ProdiAdmin(admin.ModelAdmin):
    list_display = ['id', 'nama_prodi', 'kaprodi']
    search_fields = ['nama_prodi', 'kaprodi']


@admin.register(Siswa)
class SiswaAdmin(admin.ModelAdmin):
    list_display = ['id', 'nim', 'nama', 'prodi']
    search_fields = ['nim', 'nama']
    list_filter = ['prodi']


@admin.register(Kuliah)
class KuliahAdmin(admin.ModelAdmin):
    list_display = ['id', 'matkul', 'prodi', 'hari', 'sks']
    search_fields = ['matkul']
    list_filter = ['prodi', 'hari']


@admin.register(Registrasi)
class RegistrasiAdmin(admin.ModelAdmin):
    list_display = ['id', 'student', 'kuliah', 'tanggal_registrasi']
    search_fields = ['student__nama', 'kuliah__matkul']
    list_filter = ['tanggal_registrasi']