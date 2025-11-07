from rest_framework import serializers
from .models import Berita, Komentar

class KomentarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Komentar
        fields = '__all__'

class BeritaSerializer(serializers.ModelSerializer):
    komentar = KomentarSerializer(many=True, read_only=True, source='komentar_set')
    
    class Meta:
        model = Berita
        fields = '__all__'