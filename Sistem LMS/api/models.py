from django.db import models

class Prodi(models.Model):
    nama_prodi = models.CharField(max_length=100)
    kaprodi = models.CharField(max_length=100)
    
    class Meta:
        verbose_name_plural = "Program Studi"
    
    def __str__(self):
        return self.nama_prodi


class Siswa(models.Model):
    nama = models.CharField(max_length=100)
    nim = models.CharField(max_length=20, unique=True)
    photo = models.ImageField(upload_to='students/', blank=True, null=True)
    prodi = models.ForeignKey(Prodi, on_delete=models.CASCADE, related_name='mahasiswa')
    
    class Meta:
        verbose_name_plural = "Siswa"
    
    def __str__(self):
        return f"{self.nim} - {self.nama}"


class Kuliah(models.Model):
    HARI_CHOICES = [
        ('Senin', 'Senin'),
        ('Selasa', 'Selasa'),
        ('Rabu', 'Rabu'),
        ('Kamis', 'Kamis'),
        ('Jumat', 'Jumat'),
        ('Sabtu', 'Sabtu'),
    ]
    
    matkul = models.CharField(max_length=100)
    prodi = models.ForeignKey(Prodi, on_delete=models.CASCADE, related_name='mata_kuliah')
    hari = models.CharField(max_length=10, choices=HARI_CHOICES)
    sks = models.IntegerField()
    
    class Meta:
        verbose_name_plural = "Kuliah"
    
    def __str__(self):
        return f"{self.matkul} - {self.prodi.nama_prodi}"


class Registrasi(models.Model):
    student = models.ForeignKey(Siswa, on_delete=models.CASCADE, related_name='registrasi')
    kuliah = models.ForeignKey(Kuliah, on_delete=models.CASCADE, related_name='registrasi')
    tanggal_registrasi = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Registrasi"
        unique_together = ['student', 'kuliah']  # Mencegah duplikasi registrasi
    
    def __str__(self):
        return f"{self.student.nama} - {self.kuliah.matkul}"