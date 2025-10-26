from django import forms
from basic_api.models import DRFPost

class DRFPostForm(forms.ModelForm):
    class Meta:
        model = DRFPost
        fields = ['name', 'author', 'rating', 'image']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter book name'}),
            'author': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter author name'}),
            'rating': forms.Select(attrs={'class': 'form-select'}),
            'image': forms.FileInput(attrs={'class': 'form-control'}),
        }