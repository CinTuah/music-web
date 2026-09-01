# Nova Music Premium — Panduan Deploy ke Vercel

## Isi folder ini
```
nova-music-vercel/
├── api/
│   └── search.js     <- backend (serverless function), baca API key dari environment variable
├── index.html         <- aplikasi (frontend)
└── package.json
```

**PENTING:** Tidak ada API key di dalam file manapun di folder ini. Aman untuk di-push ke GitHub publik.

## Langkah deploy

### 1. Pastikan API key YouTube kamu sudah aman
- Kalau key lama sempat kamu kirim di tempat yang tidak aman, sebaiknya di-regenerate dulu di
  https://console.cloud.google.com/apis/credentials
- Pastikan **YouTube Data API v3** sudah di-enable di project Google Cloud kamu:
  https://console.cloud.google.com/apis/library

### 2. Deploy ke Vercel
Pilih salah satu cara:

**Cara A — via Vercel CLI (paling cepat, tanpa GitHub)**
```bash
npm i -g vercel
cd nova-music-vercel
vercel
```
Ikuti instruksi di terminal (login, pilih scope, dst). Setelah selesai, project akan online.

**Cara B — via GitHub**
1. Push folder ini ke repo GitHub baru
2. Buka https://vercel.com/new, pilih repo tersebut, klik **Deploy**

### 3. Set API key di Vercel (LANGKAH PALING PENTING)
1. Buka project kamu di https://vercel.com/dashboard
2. Masuk ke **Settings → Environment Variables**
3. Tambahkan:
   - **Name**: `YOUTUBE_API_KEY`
   - **Value**: (tempel API key YouTube kamu di sini)
   - **Environment**: pilih semua (Production, Preview, Development)
4. Klik **Save**
5. Buka tab **Deployments** → klik **...** pada deployment terakhir → **Redeploy**
   (env var baru hanya terbaca setelah redeploy)

### 4. Selesai
- Buka URL project kamu (contoh: `https://nova-music-xxxx.vercel.app`)
- Coba ketik sesuatu di halaman "Cari" — bagian "Hasil dari YouTube" akan muncul kalau backend
  dan API key sudah terhubung dengan benar.

## Kalau muncul error saat search
- **"YOUTUBE_API_KEY belum diatur di server"** → env var belum di-set atau belum redeploy
- **"Tidak bisa menghubungi server pencarian"** → kemungkinan kamu buka `index.html` langsung
  dari file lokal (bukan lewat domain Vercel). Fitur `/api/search` hanya jalan setelah di-deploy.
- Error kuota dari YouTube → YouTube Data API v3 punya kuota harian gratis terbatas (default
  10.000 unit/hari, 1 pencarian = 100 unit, jadi ±100 pencarian/hari)
