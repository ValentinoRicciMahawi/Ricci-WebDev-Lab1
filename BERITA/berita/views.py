from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Berita, Komentar
from .serializers import BeritaSerializer, KomentarSerializer

class BeritaViewSet(viewsets.ModelViewSet):
    queryset = Berita.objects.all()
    serializer_class = BeritaSerializer
    
    @action(detail=False, methods=['get'], url_path='search/(?P<judul>[^/.]+)')
    def search(self, request, judul=None):
        berita = Berita.objects.filter(judul__icontains=judul)
        serializer = self.get_serializer(berita, many=True)
        return Response(serializer.data)

class KomentarViewSet(viewsets.ModelViewSet):
    queryset = Komentar.objects.all()
    serializer_class = KomentarSerializer