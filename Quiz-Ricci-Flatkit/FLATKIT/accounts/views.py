from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from .forms import SignupForm

def signup_view(request):
    if request.method == "POST":
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('dashboard')
    else:
        form = SignupForm()
    return render(request, 'accounts/signup.html', {"form": form})


def login_view(request):
    # We will add form logic here later
    return render(request, 'accounts/login.html')

@login_required # This decorator fulfills the access restriction [cite: 90]
def dashboard_view(request):
    return render(request, 'dashboard.html')
