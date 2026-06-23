# HSSE AI Assistant — Pertamina Patra Niaga

Prototipe antarmuka chatbot **HSSE (Health, Safety, Security & Environment)** berbasis
React + Vite + Tailwind CSS. Berisi 3 modul utama: **Tanya AI** (chat), **Berita &
Pengumuman**, dan **Kelola Knowledge Base** (khusus Contributor).

**🌐 Demo online:** https://securitypis.github.io/HSSEchatbot/

> Setiap `git push` ke branch `main` otomatis mem-build & men-deploy ulang ke GitHub
> Pages lewat workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

## Menjalankan secara lokal

Butuh **Node.js 18+** (teruji di Node 24).

```bash
# 1. Install dependency (sekali saja)
npm install

# 2. Jalankan dev server (hot-reload)
npm run dev
```

Buka **http://localhost:5173** di browser. Server akan otomatis terbuka.

### Perintah lain

```bash
npm run build     # build produksi ke folder dist/
npm run preview   # menjalankan hasil build secara lokal
```

## Cara mencoba

Di layar login pilih salah satu peran:

- **Masuk sebagai Pekerja** — akses chat + berita.
- **Masuk sebagai Contributor** — akses penuh, termasuk membuat berita & mengelola
  dokumen knowledge base.

Tips: coba kirim pertanyaan atau klik salah satu **quick-reply**; bot akan menampilkan
indikator mengetik lalu membalas beserta sumber dokumen rujukannya.

> Tampilan dirancang mobile-first. Di layar lebar (≥ 640px) UI tampil dalam bingkai
> ponsel; di layar sempit UI mengisi penuh layar seperti aplikasi mobile.

## Struktur

```
index.html            # entry HTML + font Plus Jakarta Sans
src/
  main.jsx            # bootstrap React
  App.jsx             # seluruh aplikasi (login, chat, berita, admin)
  index.css           # Tailwind + utilitas kustom (animasi, scrollbar)
tailwind.config.js    # tema, keyframes & animasi
vite.config.js        # konfigurasi Vite
```

## Catatan

- Gambar berita memakai URL Unsplash (butuh internet). Bila gambar gagal dimuat,
  ditampilkan placeholder bermerek otomatis (lihat komponen `NewsImage`).
- Data masih dummy/in-memory (belum terhubung backend). Cocok untuk demo UI/UX.
- `index.txt` adalah salinan komponen versi awal (referensi sebelum dirapikan).
