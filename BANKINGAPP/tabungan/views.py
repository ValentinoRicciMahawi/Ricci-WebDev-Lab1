from django.shortcuts import render, redirect, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Q
from .models import Buku, Transaksi, Catatan
from .serializers import BukuSerializer, BukuDetailSerializer, TransaksiSerializer, CatatanSerializer


# ==========================================
# FUNCTION-BASED VIEWS (Views yang sudah ada)
# ==========================================

def list_buku(request):
    """View untuk menampilkan daftar buku"""
    list_buku = Buku.objects.all()
    print(f"DEBUG: Total buku = {list_buku.count()}")  # Tambahkan ini untuk debug
    for buku in list_buku:
        print(f"DEBUG: {buku.nama_nasabah}")  # Debug setiap data
    return render(request, 'tabungan/list_buku.html', {'list_buku': list_buku})


def create_buku(request):
    """View untuk membuat buku baru"""
    if request.method == 'POST':
        kantor_bank = request.POST.get('kantor_bank')
        nomor_rekening = request.POST.get('nomor_rekening')
        nama_nasabah = request.POST.get('nama_nasabah')
        alamat = request.POST.get('alamat')
        
        Buku.objects.create(
            kantor_bank=kantor_bank,
            nomor_rekening=nomor_rekening,
            nama_nasabah=nama_nasabah,
            alamat=alamat
        )
        return redirect('tabungan:list_buku')
    
    return render(request, 'tabungan/create_buku.html')


def update_buku(request, buku_id):
    """View untuk update buku"""
    buku = get_object_or_404(Buku, id=buku_id)
    
    if request.method == 'POST':
        buku.kantor_bank = request.POST.get('kantor_bank')
        buku.nomor_rekening = request.POST.get('nomor_rekening')
        buku.nama_nasabah = request.POST.get('nama_nasabah')
        buku.alamat = request.POST.get('alamat')
        buku.save()
        return redirect('tabungan:list_buku')
    
    return render(request, 'tabungan/update_buku.html', {'buku': buku})


def delete_buku(request, buku_id):
    """View untuk hapus buku"""
    buku = get_object_or_404(Buku, id=buku_id)
    
    if request.method == 'POST':
        buku.delete()
        return redirect('tabungan:list_buku')
    
    return render(request, 'tabungan/delete_buku.html', {'buku': buku})


def detail_buku(request, buku_id):
    """View untuk detail buku dengan transaksi"""
    buku = get_object_or_404(Buku, id=buku_id)
    transaksi_list = buku.transaksi_set.all().order_by('-tanggal')
    
    # Hitung saldo
    total_debit = buku.transaksi_set.filter(jenis='DEBIT').aggregate(
        total=Sum('nominal')
    )['total'] or 0
    
    total_kredit = buku.transaksi_set.filter(jenis='KREDIT').aggregate(
        total=Sum('nominal')
    )['total'] or 0
    
    saldo = total_kredit - total_debit 
    
    context = {
        'buku': buku,
        'transaksi_list': transaksi_list,
        'saldo': saldo,
        'total_debit': total_debit,
        'total_kredit': total_kredit,
    }
    
    return render(request, 'tabungan/detail_buku.html', context)


def create_transaksi(request, buku_id):
    """View untuk membuat transaksi baru"""
    buku = get_object_or_404(Buku, id=buku_id)
    
    if request.method == 'POST':
        nominal = request.POST.get('nominal')
        jenis = request.POST.get('jenis')
        
        Transaksi.objects.create(
            buku=buku,
            nominal=nominal,
            jenis=jenis
        )
        return redirect('tabungan:detail_buku', buku_id=buku.id)
    
    return render(request, 'tabungan/create_transaksi.html', {'buku': buku})


# ==========================================
# REST API VIEWSETS (Views baru untuk API)
# ==========================================

class BukuViewSet(viewsets.ModelViewSet):
    """ViewSet untuk API Buku Tabungan"""
    queryset = Buku.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BukuDetailSerializer
        return BukuSerializer
    
    def get_queryset(self):
        queryset = Buku.objects.all()
        
        # Hitung saldo untuk setiap buku
        for buku in queryset:
            debit = buku.transaksi_set.filter(jenis='DEBIT').aggregate(
                total=Sum('nominal')
            )['total'] or 0
            
            kredit = buku.transaksi_set.filter(jenis='KREDIT').aggregate(
                total=Sum('nominal')
            )['total'] or 0
            
            buku.saldo = kredit - debit
        
        return queryset
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Hitung saldo
        debit = instance.transaksi_set.filter(jenis='DEBIT').aggregate(
            total=Sum('nominal')
        )['total'] or 0
        
        kredit = instance.transaksi_set.filter(jenis='KREDIT').aggregate(
            total=Sum('nominal')
        )['total'] or 0
        
        instance.saldo = kredit - debit
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def saldo(self, request, pk=None):
        """Endpoint khusus untuk mendapatkan saldo buku"""
        buku = self.get_object()
        
        debit = buku.transaksi_set.filter(jenis='DEBIT').aggregate(
            total=Sum('nominal')
        )['total'] or 0
        
        kredit = buku.transaksi_set.filter(jenis='KREDIT').aggregate(
            total=Sum('nominal')
        )['total'] or 0
        
        saldo = debit - kredit
        
        return Response({
            'buku_id': buku.id,
            'nama_nasabah': buku.nama_nasabah,
            'nomor_rekening': buku.nomor_rekening,
            'total_debit': debit,
            'total_kredit': kredit,
            'saldo': saldo
        })


class TransaksiViewSet(viewsets.ModelViewSet):
    """ViewSet untuk API Transaksi"""
    queryset = Transaksi.objects.all()
    serializer_class = TransaksiSerializer
    
    def get_queryset(self):
        queryset = Transaksi.objects.all()
        
        # Filter berdasarkan buku_id jika ada
        buku_id = self.request.query_params.get('buku_id', None)
        if buku_id is not None:
            queryset = queryset.filter(buku_id=buku_id)
        
        # Filter berdasarkan jenis transaksi
        jenis = self.request.query_params.get('jenis', None)
        if jenis is not None:
            queryset = queryset.filter(jenis=jenis.upper())
        
        # Urutkan berdasarkan tanggal terbaru
        queryset = queryset.order_by('-tanggal')
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save()
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Ringkasan semua transaksi"""
        buku_id = request.query_params.get('buku_id', None)
        
        queryset = Transaksi.objects.all()
        if buku_id:
            queryset = queryset.filter(buku_id=buku_id)
        
        total_debit = queryset.filter(jenis='DEBIT').aggregate(
            total=Sum('nominal')
        )['total'] or 0
        
        total_kredit = queryset.filter(jenis='KREDIT').aggregate(
            total=Sum('nominal')
        )['total'] or 0
        
        return Response({
            'total_transaksi': queryset.count(),
            'total_debit': total_debit,
            'total_kredit': total_kredit,
            'saldo': total_debit - total_kredit
        })
    
class CatatanViewSet(viewsets.ModelViewSet):
    queryset = Catatan.objects.all()
    serializer_class = CatatanSerializer