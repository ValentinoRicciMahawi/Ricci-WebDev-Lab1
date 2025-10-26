from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from rest_framework import generics
from basic_api.models import DRFPost, DRFDosen, DRFStudent  
from basic_api.serializers import DRFDosenSerializer
from basic_api.serializers import DRFPostSerializer
from basic_api.serializers import DRFStudentSerializer
from basic_api.forms import DRFPostForm

# Existing views...
class API_objects(generics.ListCreateAPIView):
    queryset = DRFPost.objects.all()
    serializer_class = DRFPostSerializer

class API_object_detail(generics.RetrieveUpdateDestroyAPIView):
    queryset = DRFPost.objects.all()
    serializer_class = DRFPostSerializer

class Dosen(generics.ListCreateAPIView):
    queryset = DRFDosen.objects.all()
    serializer_class = DRFDosenSerializer

class Student(generics.ListCreateAPIView):
    queryset = DRFStudent.objects.all()
    serializer_class = DRFStudentSerializer

class Dosen_object_detail(generics.RetrieveUpdateDestroyAPIView):
    queryset = DRFDosen.objects.all()
    serializer_class = DRFDosenSerializer

class Student_object_detail(generics.RetrieveUpdateDestroyAPIView):
    queryset = DRFStudent.objects.all()
    serializer_class = DRFStudentSerializer

# New views for book collection
def book_collection(request):
    posts = DRFPost.objects.all()
    return render(request, 'basic_api/book_collection.html', {'posts': posts})

def add_book(request):
    if request.method == 'POST':
        form = DRFPostForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Book added successfully!')
            return redirect('book_collection')
    else:
        form = DRFPostForm()
    return render(request, 'basic_api/book_form.html', {'form': form})

def edit_book(request, pk):
    book = get_object_or_404(DRFPost, pk=pk)
    if request.method == 'POST':
        form = DRFPostForm(request.POST, request.FILES, instance=book)
        if form.is_valid():
            form.save()
            messages.success(request, 'Book updated successfully!')
            return redirect('book_collection')
    else:
        form = DRFPostForm(instance=book)
    return render(request, 'basic_api/book_form.html', {'form': form, 'book': book})


def delete_book(request, pk):
    book = get_object_or_404(DRFPost, pk=pk)
    if request.method == 'POST':
        book.delete()
        messages.success(request, 'Book deleted successfully!')
    return redirect('book_collection')

def book_form(request, pk=None):
    # If a book ID (pk) is provided → Edit mode
    if pk:
        book = get_object_or_404(DRFPost, pk=pk)
        form = DRFPostForm(request.POST or None, request.FILES or None, instance=book)
        title = "Edit Book"
    else:
        # If no pk → Add mode
        form = DRFPostForm(request.POST or None, request.FILES or None)
        title = "Add Book"

    if request.method == 'POST':
        if form.is_valid():
            form.save()
            messages.success(request, f'Book {"updated" if pk else "added"} successfully!')
            return redirect('book_collection')

    # ✅ Always return an HttpResponse here
    return render(request, 'basic_api/book_form.html', {'form': form, 'title': title})