from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Siswa, Prodi, Kuliah, Registrasi
from .serializers import SiswaSerializer, ProdiSerializer, KuliahSerializer, RegistrasiSerializer


class ProdiViewSet(viewsets.ModelViewSet):
    queryset = Prodi.objects.all()
    serializer_class = ProdiSerializer
    
    @action(detail=True, methods=['get'])
    def mahasiswa(self, request, pk=None):
        """Mendapatkan semua mahasiswa dalam prodi tertentu"""
        prodi = self.get_object()
        mahasiswa = prodi.mahasiswa.all()
        serializer = SiswaSerializer(mahasiswa, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='nama/(?P<nama_prodi>[^/.]+)')
    def filter_by_nama(self, request, nama_prodi=None):
        """Filter prodi berdasarkan nama"""
        prodi = Prodi.objects.filter(nama_prodi__icontains=nama_prodi)
        serializer = self.get_serializer(prodi, many=True)
        return Response(serializer.data)


class SiswaViewSet(viewsets.ModelViewSet):
    queryset = Siswa.objects.all()
    serializer_class = SiswaSerializer
    
    @action(detail=True, methods=['get'])
    def registrasi(self, request, pk=None):
        """Mendapatkan semua mata kuliah yang diambil mahasiswa"""
        siswa = self.get_object()
        registrasi = siswa.registrasi.all()
        serializer = RegistrasiSerializer(registrasi, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='kuliah/(?P<matkul>[^/.]+)')
    def filter_by_kuliah(self, request, matkul=None):
        """Filter siswa berdasarkan mata kuliah yang diambil
        Contoh: /api/siswa/kuliah/web
        """
        # Cari siswa yang mengambil kuliah dengan nama yang mengandung keyword
        siswa = Siswa.objects.filter(
            registrasi__kuliah__matkul__icontains=matkul
        ).distinct()
        
        serializer = self.get_serializer(siswa, many=True, context={'request': request})
        
        return Response({
            'count': siswa.count(),
            'filter': f'kuliah: {matkul}',
            'results': serializer.data
        })
    
    @action(detail=False, methods=['get'], url_path='prodi/(?P<nama_prodi>[^/.]+)')
    def filter_by_prodi(self, request, nama_prodi=None):
        """Filter siswa berdasarkan program studi
        Contoh: /api/siswa/prodi/informatika atau /api/siswa/prodi/dbt
        """
        # Cari siswa berdasarkan nama prodi yang mengandung keyword
        siswa = Siswa.objects.filter(
            prodi__nama_prodi__icontains=nama_prodi
        ).distinct()
        
        serializer = self.get_serializer(siswa, many=True, context={'request': request})
        
        return Response({
            'count': siswa.count(),
            'filter': f'prodi: {nama_prodi}',
            'results': serializer.data
        })
    
    @action(detail=False, methods=['get'], url_path='nim/(?P<nim>[^/.]+)')
    def filter_by_nim(self, request, nim=None):
        """Filter siswa berdasarkan NIM
        Contoh: /api/siswa/nim/2021001
        """
        siswa = Siswa.objects.filter(nim__icontains=nim)
        serializer = self.get_serializer(siswa, many=True, context={'request': request})
        
        return Response({
            'count': siswa.count(),
            'filter': f'nim: {nim}',
            'results': serializer.data
        })


class KuliahViewSet(viewsets.ModelViewSet):
    queryset = Kuliah.objects.all()
    serializer_class = KuliahSerializer
    
    @action(detail=True, methods=['get'])
    def peserta(self, request, pk=None):
        """Mendapatkan semua mahasiswa yang terdaftar dalam kuliah"""
        kuliah = self.get_object()
        registrasi = kuliah.registrasi.all()
        serializer = RegistrasiSerializer(registrasi, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='prodi/(?P<nama_prodi>[^/.]+)')
    def filter_by_prodi(self, request, nama_prodi=None):
        """Filter kuliah berdasarkan prodi
        Contoh: /api/kuliah/prodi/informatika
        """
        kuliah = Kuliah.objects.filter(
            prodi__nama_prodi__icontains=nama_prodi
        )
        serializer = self.get_serializer(kuliah, many=True)
        
        return Response({
            'count': kuliah.count(),
            'filter': f'prodi: {nama_prodi}',
            'results': serializer.data
        })
    
    @action(detail=False, methods=['get'], url_path='hari/(?P<hari>[^/.]+)')
    def filter_by_hari(self, request, hari=None):
        """Filter kuliah berdasarkan hari
        Contoh: /api/kuliah/hari/senin
        """
        kuliah = Kuliah.objects.filter(hari__icontains=hari)
        serializer = self.get_serializer(kuliah, many=True)
        
        return Response({
            'count': kuliah.count(),
            'filter': f'hari: {hari}',
            'results': serializer.data
        })
    
    @action(detail=False, methods=['get'], url_path='matkul/(?P<matkul>[^/.]+)')
    def filter_by_matkul(self, request, matkul=None):
        """Filter kuliah berdasarkan nama mata kuliah
        Contoh: /api/kuliah/matkul/web
        """
        kuliah = Kuliah.objects.filter(matkul__icontains=matkul)
        serializer = self.get_serializer(kuliah, many=True)
        
        return Response({
            'count': kuliah.count(),
            'filter': f'matkul: {matkul}',
            'results': serializer.data
        })


class RegistrasiViewSet(viewsets.ModelViewSet):
    queryset = Registrasi.objects.all()
    serializer_class = RegistrasiSerializer
    
    @action(detail=False, methods=['get'], url_path='siswa/(?P<nim>[^/.]+)')
    def filter_by_siswa(self, request, nim=None):
        """Filter registrasi berdasarkan NIM siswa
        Contoh: /api/registrasi/siswa/2021001
        """
        registrasi = Registrasi.objects.filter(
            student__nim__icontains=nim
        )
        serializer = self.get_serializer(registrasi, many=True, context={'request': request})
        
        return Response({
            'count': registrasi.count(),
            'filter': f'siswa nim: {nim}',
            'results': serializer.data
        })
    
    @action(detail=False, methods=['get'], url_path='kuliah/(?P<matkul>[^/.]+)')
    def filter_by_kuliah(self, request, matkul=None):
        """Filter registrasi berdasarkan mata kuliah
        Contoh: /api/registrasi/kuliah/web
        """
        registrasi = Registrasi.objects.filter(
            kuliah__matkul__icontains=matkul
        )
        serializer = self.get_serializer(registrasi, many=True, context={'request': request})
        
        return Response({
            'count': registrasi.count(),
            'filter': f'kuliah: {matkul}',
            'results': serializer.data
        })