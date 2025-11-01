from rest_framework import serializers
from .models import Prodi, Siswa, Kuliah, Registrasi


class ProdiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prodi
        fields = ['id', 'nama', 'kaprodi']
        read_only_fields = ['id']


class SiswaSerializer(serializers.ModelSerializer):
    prodi_nama = serializers.CharField(source='prodi.nama', read_only=True)
    
    class Meta:
        model = Siswa
        fields = ['id', 'nama', 'nim', 'photo', 'prodi', 'prodi_nama']
        read_only_fields = ['id']
    
    def validate_nim(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("NIM harus minimal 5 karakter")
        return value


class SiswaDetailSerializer(serializers.ModelSerializer):
    prodi = ProdiSerializer(read_only=True)
    registrasi_list = serializers.SerializerMethodField()
    
    class Meta:
        model = Siswa
        fields = ['id', 'nama', 'nim', 'photo', 'prodi', 'registrasi_list']
        read_only_fields = ['id']
    
    def get_registrasi_list(self, obj):
        registrasi = obj.registrasi_set.all()
        return RegistrasiSerializer(registrasi, many=True).data


class KuliahSerializer(serializers.ModelSerializer):
    prodi_nama = serializers.CharField(source='prodi.nama', read_only=True)
    
    class Meta:
        model = Kuliah
        fields = ['id', 'mata_kuliah', 'prodi', 'prodi_nama', 'hari', 'sks']
        read_only_fields = ['id']
    
    def validate_sks(self, value):
        if value < 1 or value > 6:
            raise serializers.ValidationError("SKS harus antara 1-6")
        return value


class KuliahDetailSerializer(serializers.ModelSerializer):
    prodi = ProdiSerializer(read_only=True)
    jumlah_mahasiswa = serializers.SerializerMethodField()
    
    class Meta:
        model = Kuliah
        fields = ['id', 'mata_kuliah', 'prodi', 'hari', 'sks', 'jumlah_mahasiswa']
        read_only_fields = ['id']
    
    def get_jumlah_mahasiswa(self, obj):
        return obj.registrasi_set.count()


class RegistrasiSerializer(serializers.ModelSerializer):
    student_nama = serializers.CharField(source='student.nama', read_only=True)
    student_nim = serializers.CharField(source='student.nim', read_only=True)
    kuliah_nama = serializers.CharField(source='kuliah.mata_kuliah', read_only=True)
    kuliah_hari = serializers.CharField(source='kuliah.hari', read_only=True)
    kuliah_sks = serializers.IntegerField(source='kuliah.sks', read_only=True)
    
    class Meta:
        model = Registrasi
        fields = [
            'id', 
            'student', 
            'student_nama', 
            'student_nim',
            'kuliah', 
            'kuliah_nama', 
            'kuliah_hari',
            'kuliah_sks',
            'tanggal_registrasi'
        ]
        read_only_fields = ['id', 'tanggal_registrasi']
    
    def validate(self, data):
        # Cek apakah sudah pernah registrasi
        student = data.get('student')
        kuliah = data.get('kuliah')
        
        if Registrasi.objects.filter(student=student, kuliah=kuliah).exists():
            raise serializers.ValidationError(
                "Mahasiswa sudah terdaftar di mata kuliah ini"
            )
        
        return data


class RegistrasiDetailSerializer(serializers.ModelSerializer):
    student = SiswaSerializer(read_only=True)
    kuliah = KuliahSerializer(read_only=True)
    
    class Meta:
        model = Registrasi
        fields = ['id', 'student', 'kuliah', 'tanggal_registrasi']
        read_only_fields = ['id', 'tanggal_registrasi']