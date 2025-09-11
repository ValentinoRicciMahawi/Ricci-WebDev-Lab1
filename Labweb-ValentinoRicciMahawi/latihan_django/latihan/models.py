from django.db import models

# Create your models here.

class Mahasiswa(models.Model):
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    nim = models.CharField(max_length=20)
    jurusan = models.CharField(max_length=100)

    def __str__(self):
        return self.nim