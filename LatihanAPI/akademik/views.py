from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Sum
from .models import Prodi, Siswa, Kuliah, Registrasi
from .serializers import (
    ProdiSerializer, 
    SiswaSerializer, 
    SiswaDetailSerializer,
    KuliahSerializer, 
    KuliahDetailSerializer,
    RegistrasiSerializer,
    RegistrasiDetailSerializer
)


class ProdiViewSet(viewsets.ModelViewSet):
    """API endpoint untuk Prodi"""
    queryset = Prodi.objects.all()
    serializer_class = ProdiSerializer
    
    @action(detail=True, methods=['get'])
    def mahasiswa(self, request, pk=None):
        """Mendapatkan semua mahasiswa dalam prodi"""
        prodi = self.get_object()
        mahasiswa = Siswa.objects.filter(prodi=prodi)
        serializer = SiswaSerializer(mahasiswa, many=True)
        return Response({
            'prodi': prodi.nama,
            'jumlah_mahasiswa': mahasiswa.count(),
            'mahasiswa': serializer.data
        })
    
    @action(detail=True, methods=['get'])
    def kuliah(self, request, pk=None):
        """Mendapatkan semua mata kuliah dalam prodi"""
        prodi = self.get_object()
        kuliah = Kuliah.objects.filter(prodi=prodi)
        serializer = KuliahSerializer(kuliah, many=True)
        return Response({
            'prodi': prodi.nama,
            'jumlah_mata_kuliah': kuliah.count(),
            'mata_kuliah': serializer.data
        })


class SiswaViewSet(viewsets.ModelViewSet):
    """API endpoint untuk Siswa"""
    queryset = Siswa.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SiswaDetailSerializer
        return SiswaSerializer
    
    def get_queryset(self):
        queryset = Siswa.objects.select_related('prodi').all()
        
        # Filter berdasarkan prodi
        prodi_id = self.request.query_params.get('prodi_id', None)
        if prodi_id is not None:
            queryset = queryset.filter(prodi_id=prodi_id)
        
        # Filter berdasarkan nim (search)
        nim = self.request.query_params.get('nim', None)
        if nim is not None:
            queryset = queryset.filter(nim__icontains=nim)
        
        # Filter berdasarkan nama (search)
        nama = self.request.query_params.get('nama', None)
        if nama is not None:
            queryset = queryset.filter(nama__icontains=nama)
        
        return queryset
    
    @action(detail=True, methods=['get'])
    def registrasi(self, request, pk=None):
        """Mendapatkan semua registrasi mahasiswa"""
        siswa = self.get_object()
        registrasi = Registrasi.objects.filter(student=siswa).select_related('kuliah')
        serializer = RegistrasiSerializer(registrasi, many=True)
        
        total_sks = sum([r.kuliah.sks for r in registrasi])
        
        return Response({
            'mahasiswa': siswa.nama,
            'nim': siswa.nim,
            'total_mata_kuliah': registrasi.count(),
            'total_sks': total_sks,
            'registrasi': serializer.data
        })


class KuliahViewSet(viewsets.ModelViewSet):
    """API endpoint untuk Kuliah"""
    queryset = Kuliah.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return KuliahDetailSerializer
        return KuliahSerializer
    
    def get_queryset(self):
        queryset = Kuliah.objects.select_related('prodi').all()
        
        # Filter berdasarkan prodi
        prodi_id = self.request.query_params.get('prodi_id', None)
        if prodi_id is not None:
            queryset = queryset.filter(prodi_id=prodi_id)
        
        # Filter berdasarkan hari
        hari = self.request.query_params.get('hari', None)
        if hari is not None:
            queryset = queryset.filter(hari__iexact=hari)
        
        # Filter berdasarkan mata kuliah (search)
        mata_kuliah = self.request.query_params.get('mata_kuliah', None)
        if mata_kuliah is not None:
            queryset = queryset.filter(mata_kuliah__icontains=mata_kuliah)
        
        return queryset
    
    @action(detail=True, methods=['get'])
    def mahasiswa(self, request, pk=None):
        """Mendapatkan semua mahasiswa yang terdaftar di kuliah ini"""
        kuliah = self.get_object()
        registrasi = Registrasi.objects.filter(kuliah=kuliah).select_related('student')
        
        mahasiswa_data = []
        for reg in registrasi:
            mahasiswa_data.append({
                'id': reg.student.id,
                'nama': reg.student.nama,
                'nim': reg.student.nim,
                'tanggal_registrasi': reg.tanggal_registrasi
            })
        
        return Response({
            'mata_kuliah': kuliah.mata_kuliah,
            'hari': kuliah.hari,
            'sks': kuliah.sks,
            'jumlah_mahasiswa': len(mahasiswa_data),
            'mahasiswa': mahasiswa_data
        })


class RegistrasiViewSet(viewsets.ModelViewSet):
    """API endpoint untuk Registrasi"""
    queryset = Registrasi.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return RegistrasiDetailSerializer
        return RegistrasiSerializer
    
    def get_queryset(self):
        queryset = Registrasi.objects.select_related('student', 'kuliah').all()
        
        # Filter berdasarkan student
        student_id = self.request.query_params.get('student_id', None)
        if student_id is not None:
            queryset = queryset.filter(student_id=student_id)
        
        # Filter berdasarkan kuliah
        kuliah_id = self.request.query_params.get('kuliah_id', None)
        if kuliah_id is not None:
            queryset = queryset.filter(kuliah_id=kuliah_id)
        
        # Filter berdasarkan hari
        hari = self.request.query_params.get('hari', None)
        if hari is not None:
            queryset = queryset.filter(kuliah__hari__iexact=hari)
        
        return queryset.order_by('-tanggal_registrasi')
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Ringkasan semua registrasi"""
        total_registrasi = Registrasi.objects.count()
        total_mahasiswa = Siswa.objects.count()
        total_kuliah = Kuliah.objects.count()
        
        # Kuliah paling populer
        kuliah_populer = Kuliah.objects.annotate(
            jumlah_mahasiswa=Count('registrasi')
        ).order_by('-jumlah_mahasiswa').first()
        
        return Response({
            'total_registrasi': total_registrasi,
            'total_mahasiswa': total_mahasiswa,
            'total_kuliah': total_kuliah,
            'kuliah_terpopuler': {
                'mata_kuliah': kuliah_populer.mata_kuliah if kuliah_populer else None,
                'jumlah_mahasiswa': kuliah_populer.registrasi_set.count() if kuliah_populer else 0
            } if kuliah_populer else None
        })
    
    @action(detail=False, methods=['post'])
    def bulk_register(self, request):
        """Registrasi massal - daftarkan satu mahasiswa ke beberapa kuliah"""
        student_id = request.data.get('student_id')
        kuliah_ids = request.data.get('kuliah_ids', [])
        
        if not student_id or not kuliah_ids:
            return Response(
                {'error': 'student_id dan kuliah_ids wajib diisi'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            student = Siswa.objects.get(id=student_id)
        except Siswa.DoesNotExist:
            return Response(
                {'error': 'Mahasiswa tidak ditemukan'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        registered = []
        failed = []
        
        for kuliah_id in kuliah_ids:
            try:
                kuliah = Kuliah.objects.get(id=kuliah_id)
                
                # Cek apakah sudah terdaftar
                if Registrasi.objects.filter(student=student, kuliah=kuliah).exists():
                    failed.append({
                        'kuliah_id': kuliah_id,
                        'mata_kuliah': kuliah.mata_kuliah,
                        'reason': 'Sudah terdaftar'
                    })
                    continue
                
                # Buat registrasi
                registrasi = Registrasi.objects.create(
                    student=student,
                    kuliah=kuliah
                )
                registered.append({
                    'id': registrasi.id,
                    'mata_kuliah': kuliah.mata_kuliah,
                    'hari': kuliah.hari,
                    'sks': kuliah.sks
                })
                
            except Kuliah.DoesNotExist:
                failed.append({
                    'kuliah_id': kuliah_id,
                    'reason': 'Mata kuliah tidak ditemukan'
                })
        
        return Response({
            'student': student.nama,
            'berhasil': len(registered),
            'gagal': len(failed),
            'registered': registered,
            'failed': failed
        })