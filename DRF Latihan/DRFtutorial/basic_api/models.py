from django.db import models


# Create your models here.

grade = [
    ('excellent', 1),
    ('average', 0),
    ('bad', -1),
]

class DRFPost(models.Model):
    name = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    uploaded = models.DateTimeField(auto_now_add=True)
    rating = models.CharField(max_length=10, choices=grade, default='average')
    image = models.ImageField(upload_to='image/', blank=True, null=True,default=None)

    class Meta:
        ordering = ['uploaded']

    def __str__(self):
        return self.name
    
class DRFDosen(models.Model):
    name = models.CharField(max_length=100)
    prodi = models.CharField(max_length=100)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name    
    
class DRFStudent(models.Model):
    name = models.CharField(max_length=100)
    nim = models.CharField(max_length=20)
    mentor = models.ForeignKey(DRFDosen, on_delete=models.CASCADE, null=True, related_name='students')

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name
