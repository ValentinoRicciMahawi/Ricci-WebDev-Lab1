from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.decorators import login_required, user_passes_test
from .forms import Loginform
from django.urls import reverse

def login_view(request):
    if request.user.is_authenticated:
        return redirect('accounts:dashboard')

    form = Loginform(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        user = authenticate(
            request, 
            username=form.cleaned_data['username'], 
            password=form.cleaned_data['password']
            
        )

        if user:
          login(request,user)
          messages.success(request, 'Login Success')
          return redirect('accounts:dashboard')
        messages.error(request, 'Login Failed, Please check your username and password')
    return render(request, 'accounts/login.html', {'form': form})

@login_required
def dashboard(request):
    role = getattr(getattr(request.user, 'profile', None), "role", 'MAHASISWA')
    return render(request, 'accounts/dashboard.html', {'role': role})
    
@login_required
def logout(request):
    next_url = request.POST.get("next") or request.GET.get("next") or reverse('accounts:login')
    if request.method == "POST":
        logout(request)
        messages.info(request, "Kamu sudah logout.")
        return redirect(next_url)
    return render(request, "accounts/logout.html", {"next": next_url})
