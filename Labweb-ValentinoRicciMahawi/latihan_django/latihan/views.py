from django.shortcuts import render
from .models import Mahasiswa
from django.template import loader
from django.http import HttpResponse
# Create your views here.

def mahasiswa(request):
    mymahasiswa = Mahasiswa.objects.all().values()
    template = loader.get_template('mahasiswa.html')
    context = {
        'mymahasiswa': mymahasiswa,
    }
    return HttpResponse(template.render(context, request))