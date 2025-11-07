from rest_framework import serializers
from .models import Siswa, Prodi, Kuliah, Registrasi


class ProdiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prodi
        fields = ['id', 'nama_prodi', 'kaprodi']


class SiswaSerializer(serializers.ModelSerializer):
    prodi_detail = ProdiSerializer(source='prodi', read_only=True)
    
    class Meta:
        model = Siswa
        fields = ['id', 'nama', 'nim', 'photo', 'prodi', 'prodi_detail']
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Menampilkan URL lengkap untuk photo
        request = self.context.get('request')
        if instance.photo and request:
            representation['photo'] = request.build_absolute_uri(instance.photo.url)
        return representation


class KuliahSerializer(serializers.ModelSerializer):
    prodi_detail = ProdiSerializer(source='prodi', read_only=True)
    
    class Meta:
        model = Kuliah
        fields = ['id', 'matkul', 'prodi', 'prodi_detail', 'hari', 'sks']


class RegistrasiSerializer(serializers.ModelSerializer):
    student_detail = SiswaSerializer(source='student', read_only=True)
    kuliah_detail = KuliahSerializer(source='kuliah', read_only=True)
    
    class Meta:
        model = Registrasi
        fields = ['id', 'student', 'student_detail', 'kuliah', 'kuliah_detail', 'tanggal_registrasi']
        read_only_fields = ['tanggal_registrasi']