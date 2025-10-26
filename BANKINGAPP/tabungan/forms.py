from django import forms
from .models import Buku, Transaksi

class BukuTabunganForm(forms.ModelForm):
    class Meta:
        model = Buku
        fields = '__all__'

class TransaksiForm(forms.ModelForm):
    class Meta:
        model = Transaksi
        fields = ['nominal', 'jenis']
        widgets = {
            'nominal': forms.NumberInput(attrs={
                'class': 'form-control', 
                'placeholder': 'Masukkan nominal',
                'step': '0.01',  # Untuk decimal
                'min': '0'
            }),
            'jenis': forms.Select(attrs={'class': 'form-control'}),
        }
        labels = {
            'nominal': 'Nominal (Rp)',
            'jenis': 'Jenis Transaksi'
        }