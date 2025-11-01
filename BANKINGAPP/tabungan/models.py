from django.db import models

# Create your models here.

class Buku(models.Model):
    kantor_bank = models.CharField(max_length=200)
    nomor_rekening = models.CharField(max_length=20)
    nama_nasabah = models.CharField(max_length=100)
    alamat = models.CharField(max_length=200)

    class Meta:
        db_table = 'tabungan_buku'

    def __str__(self) -> str:
        return self.nama_nasabah
    
    def get_saldo(self):
        """Menghitung saldo dari semua transaksi"""
        transaksi_list = self.transaksi_set.all()
        saldo = 0
        for transaksi in transaksi_list:
            if transaksi.jenis == 'KREDIT':
                saldo += transaksi.nominal
            else:  # DEBIT
                saldo -= transaksi.nominal
        return saldo


class Transaksi(models.Model):
    JENIS_CHOICES = [
        ('KREDIT', 'Kredit'),
        ('DEBIT', 'Debit'),
    ]
    
    buku = models.ForeignKey(Buku, on_delete=models.CASCADE)
    tanggal = models.DateTimeField(auto_now_add=True)
    nominal = models.DecimalField(max_digits=12, decimal_places=2)
    jenis = models.CharField(max_length=10, choices=JENIS_CHOICES)
    
    class Meta:
        db_table = 'tabungan_transaksi'
        ordering = ['-tanggal']  # Urutkan dari yang terbaru
    
    def __str__(self):
        return f"{self.jenis} - {self.nominal} ({self.tanggal.strftime('%d %B %Y')})"
    
class Catatan(models.Model):
    judul = models.CharField(max_length=100)
    isi = models.TextField()
    tanggal = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'tabungan_catatan'
        ordering = ['-tanggal']
    
    def __str__(self):
        return self.judul