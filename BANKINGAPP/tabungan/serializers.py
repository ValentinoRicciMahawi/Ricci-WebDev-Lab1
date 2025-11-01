from rest_framework import serializers
from .models import Buku, Transaksi, Catatan


class CatatanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Catatan
        fields = ['id', 'judul', 'isi', 'tanggal']
        read_only_fields = ['id', 'tanggal']


class TransaksiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaksi
        fields = ['id', 'tanggal', 'nominal', 'jenis', 'buku']
        read_only_fields = ['id']

    def validate_jenis(self, value):
        if value not in ['DEBIT', 'KREDIT']:
            raise serializers.ValidationError("Jenis harus 'DEBIT' atau 'KREDIT'")
        return value

    def validate_nominal(self, value):
        if value <= 0:
            raise serializers.ValidationError("Nominal harus lebih besar dari 0")
        return value


class BukuSerializer(serializers.ModelSerializer):
    saldo = serializers.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        read_only=True
    )
    
    class Meta:
        model = Buku
        fields = ['id', 'kantor_bank', 'nomor_rekening', 'nama_nasabah', 'alamat', 'saldo']
        read_only_fields = ['id']


class BukuDetailSerializer(serializers.ModelSerializer):
    transaksi = TransaksiSerializer(many=True, read_only=True, source='transaksi_set')
    saldo = serializers.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        read_only=True
    )
    
    class Meta:
        model = Buku
        fields = ['id', 'kantor_bank', 'nomor_rekening', 'nama_nasabah', 'alamat', 'saldo', 'transaksi']
        read_only_fields = ['id']