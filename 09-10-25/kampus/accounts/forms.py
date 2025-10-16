from django import forms

class Loginform(forms.Form):
    username = forms.CharField(label='username', max_length=150)
    password = forms.CharField(label='password', widget=forms.PasswordInput())