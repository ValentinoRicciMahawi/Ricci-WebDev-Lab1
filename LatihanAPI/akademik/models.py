from django.db import models

class Prodi(models.Model):
    nama = models.CharField(max_length=100)
    kaprodi = models.CharField(max_length=100)
    
    class Meta:
        db_table = 'akademik_prodi'
        verbose_name_plural = 'Prodi'
    
    def __str__(self):
        return self.nama


class Siswa(models.Model):
    nama = models.CharField(max_length=100)
    nim = models.CharField(max_length=20, unique=True)
    photo = models.ImageField(upload_to='photos/siswa/', null=True, blank=True)
    prodi = models.ForeignKey(Prodi, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'akademik_siswa'
        verbose_name_plural = 'Siswa'
    
    def __str__(self):
        return f"{self.nama} - {self.nim}"


class Kuliah(models.Model):
    HARI_CHOICES = [
        ('SENIN', 'Senin'),
        ('SELASA', 'Selasa'),
        ('RABU', 'Rabu'),
        ('KAMIS', 'Kamis'),
        ('JUMAT', 'Jumat'),
        ('SABTU', 'Sabtu'),
    ]
    
    mata_kuliah = models.CharField(max_length=100)
    prodi = models.ForeignKey(Prodi, on_delete=models.CASCADE)
    hari = models.CharField(max_length=10, choices=HARI_CHOICES)
    sks = models.IntegerField()
    
    class Meta:
        db_table = 'akademik_kuliah'
        verbose_name_plural = 'Kuliah'
    
    def __str__(self):
        return f"{self.mata_kuliah} - {self.hari}"


class Registrasi(models.Model):
    student = models.ForeignKey(Siswa, on_delete=models.CASCADE)
    kuliah = models.ForeignKey(Kuliah, on_delete=models.CASCADE)
    tanggal_registrasi = models.DateField(auto_now_add=True)
    
    class Meta:
        db_table = 'akademik_registrasi'
        verbose_name_plural = 'Registrasi'
        unique_together = ['student', 'kuliah']  # Prevent duplicate registration
    
    def __str__(self):
        return f"{self.student.nama} - {self.kuliah.mata_kuliah}"