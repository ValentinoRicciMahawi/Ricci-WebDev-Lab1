from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from tabungan.forms import BukuTabunganForm, TransaksiForm

from tabungan.models import Buku, Transaksi


# Create your views here.

def list_buku(request):
    # Query data ke DB
    list_buku = Buku.objects.all() #Mengambil semua data dari model Buku
    print(list_buku)
    data = {
        "list_buku": list_buku
    }
    return render(request, "buku/list.html", context=data)

def create_buku(request):
    form = BukuTabunganForm(request.POST or None)
    if form.is_valid():
        form.save()
        return HttpResponseRedirect(reverse("tabungan:list_buku"))
    data = {}
    data = {
        "form": form
    }
    return render(request, "buku/create.html", data)

def update_buku(request, buku_id):
    print(buku_id)
    obj = get_object_or_404(Buku, id=buku_id)
    print(obj)
    form = BukuTabunganForm(request.POST or None, instance=obj)
    if form.is_valid():
        form.save()
        return HttpResponseRedirect(reverse("tabungan:list_buku"))
    context = {}
    context['form'] = form
    return render(request, "buku/update.html", context)

def delete_buku(request, buku_id):
    print(buku_id)
    obj = get_object_or_404(Buku, id=buku_id)
    print(obj)
    if request.method == "POST":
        obj.delete()
        return HttpResponseRedirect(reverse("tabungan:list_buku"))
    context = {'obj': obj}
    return render(request, "buku/delete.html", context)

# Views untuk Transaksi
def detail_buku(request, buku_id):
    """Menampilkan detail buku dan daftar transaksi"""
    buku = get_object_or_404(Buku, id=buku_id)
    transaksi_list = buku.transaksi_set.all()
    saldo = buku.get_saldo()
    
    context = {
        'buku': buku,
        'transaksi_list': transaksi_list,
        'saldo': saldo,
    }
    return render(request, "buku/detail.html", context)


def create_transaksi(request, buku_id):
    """Menambah transaksi baru"""
    buku = get_object_or_404(Buku, id=buku_id)
    
    if request.method == 'POST':
        form = TransaksiForm(request.POST)
        if form.is_valid():
            transaksi = form.save(commit=False)
            transaksi.buku = buku
            transaksi.save()
            return HttpResponseRedirect(reverse("tabungan:detail_buku", args=[buku_id]))
    else:
        form = TransaksiForm()
    
    context = {
        'form': form,
        'buku': buku,
    }
    return render(request, "transaksi/create.html", context)