from django.shortcuts import render

def berita_list(request):
    return render(request, 'ListBerita/berita_list.html')

def berita_detail(request, pk):
    return render(request, 'ListBerita/berita_detail.html')