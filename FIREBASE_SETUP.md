# Panduan Setup Login Google + Cloud Sync (Firebase)

Fitur ini OPSIONAL. Kalau tidak di-setup, app tetap jalan normal pakai localStorage
(data tersimpan di HP masing-masing, tidak sinkron antar perangkat).

## Kenapa Firebase config aman ditaruh di frontend?

Beda dengan API key YouTube kemarin, Firebase config (apiKey, projectId, dll) MEMANG
didesain untuk terlihat publik di kode frontend. Keamanan sebenarnya diatur lewat
**Firestore Security Rules** (file `firestore.rules` di folder ini) — itu yang menentukan
siapa boleh baca/tulis data apa, bukan menyembunyikan config ini.

## Langkah setup

### 1. Buat project Firebase
1. Buka https://console.firebase.google.com
2. Klik **Add project** → beri nama (misal "nova-music") → ikuti wizard sampai selesai
   (boleh matikan Google Analytics kalau tidak perlu)

### 2. Aktifkan Authentication
1. Di sidebar kiri, klik **Build → Authentication**
2. Klik **Get started**
3. Pilih provider **Google** → toggle **Enable** → pilih email support kamu → **Save**

### 3. Aktifkan Firestore Database
1. Di sidebar kiri, klik **Build → Firestore Database**
2. Klik **Create database**
3. Pilih **Start in production mode** → pilih lokasi server (pilih yang terdekat, misal
   `asia-southeast2` untuk Indonesia) → **Enable**

### 4. Pasang Security Rules
1. Di Firestore Database, klik tab **Rules**
2. Hapus isi default, ganti dengan isi file `firestore.rules` yang saya sediakan di folder ini
3. Klik **Publish**

### 5. Daftarkan domain Vercel kamu (supaya popup login tidak diblokir)
1. Masih di Firebase Console, buka **Authentication → Settings → Authorized domains**
2. Klik **Add domain**, masukkan domain Vercel kamu, contoh: `music-web-sable.vercel.app`
   (dan juga domain custom kalau ada)

### 6. Ambil konfigurasi Firebase
1. Klik ikon gear ⚙️ di sidebar kiri atas → **Project settings**
2. Scroll ke bagian **Your apps** → klik ikon **</>** (Web) untuk daftarkan app baru
3. Beri nickname (bebas) → **Register app**
4. Akan muncul kode `firebaseConfig = {...}` — copy semua isinya

### 7. Tempel config ke index.html
Buka file `index.html`, cari bagian ini (dekat akhir file, sebelum tag `<script src="...firebasejs...">`):

```js
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
```

Ganti string kosong `""` dengan nilai yang kamu copy dari Firebase Console tadi.

### 8. Deploy ulang
Commit & push perubahan `index.html` ke GitHub (kalau pakai integrasi GitHub, Vercel akan
otomatis redeploy), atau jalankan `vercel --prod` kalau pakai CLI.

## Selesai
Setelah itu, tombol ikon akun di pojok kanan atas Home akan bisa dipakai untuk "Masuk dengan
Google". Setelah login, semua data (lagu disukai, playlist, riwayat) otomatis tersimpan ke
Firestore dan akan muncul kembali walau ganti perangkat/browser (asal login dengan akun Google
yang sama).

## Kalau ada error
- **Popup login tidak muncul / langsung tertutup** → cek langkah 5, domain belum didaftarkan
  di Authorized domains
- **"Missing or insufficient permissions"** → Security Rules belum di-publish dengan benar,
  ulangi langkah 4
- **Data tidak sinkron ke perangkat lain** → pastikan login dengan akun Google yang SAMA,
  data terikat ke uid akun tersebut
