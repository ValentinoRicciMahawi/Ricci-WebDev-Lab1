from django.db import models

class Berita(models.Model):
    judul = models.CharField(max_length=200)
    tanggal = models.DateField() 
    isi_berita = models.TextField()
    gambar = models.ImageField(upload_to='berita/', blank=True, null=True)
    
    def __str__(self):
        return self.judul

class Komentar(models.Model):
    nama = models.CharField(max_length=100)
    tanggal = models.DateTimeField(auto_now_add=True)
    isi_komentar = models.TextField()
    berita = models.ForeignKey(Berita, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.nama} - {self.berita.judul}"