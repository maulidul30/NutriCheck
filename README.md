# NutriCheck

Aplikasi web untuk menghitung Indeks Massa Tubuh (BMI) dan mengetahui status gizi, lengkap dengan rekomendasi kesehatan dan estimasi berat badan ideal. Kategori BMI mengacu pada standar Kementerian Kesehatan RI.

## Halaman

| Halaman | File | Fungsi |
|---|---|---|
| Beranda | `index.html` | Pengenalan aplikasi dan akses cepat ke kalkulator & panduan |
| Kalkulator BMI | `kalkulator.html` | Form jenis kelamin, berat badan, tinggi badan, dan usia |
| Hasil BMI | `hasil.html` | Skor BMI, kategori status gizi, indikator posisi, rekomendasi, dan rentang berat ideal |
| Panduan BMI | `panduan.html` | Rumus BMI, tabel kategori, dan tips hidup sehat |

## Struktur Folder

```
nutricheck/
├── index.html
├── kalkulator.html
├── hasil.html
├── panduan.html
├── css/
│   └── style.css            ← gradient, glass-card, animasi, gaya cetak
└── js/
    ├── tailwind-config.js   ← konfigurasi warna & font Tailwind
    ├── common.js            ← menu mobile
    ├── kalkulator.js        ← validasi form & penyimpanan data
    └── hasil.js             ← perhitungan & tampilan hasil
```

## Teknologi

- HTML, CSS, JavaScript (tanpa framework & tanpa proses build)
- [Tailwind CSS](https://tailwindcss.com) via CDN
- [Font Awesome 6](https://fontawesome.com) untuk ikon
- Font [Inter](https://fonts.google.com/specimen/Inter) dari Google Fonts

Membutuhkan koneksi internet agar CDN Tailwind, Font Awesome, dan Google Fonts termuat.

## Cara Menjalankan

Buka `index.html` langsung di browser. Tidak perlu instalasi apa pun atau bisa gunakan ekstensi live-server.

## Cara Kerja

1. Pengguna mengisi jenis kelamin, berat (kg), tinggi (cm), dan usia di halaman Kalkulator.
2. Data divalidasi lalu disimpan di `localStorage` dengan kunci `nutricheck_data`, kemudian pengguna diarahkan ke halaman Hasil.
3. Halaman Hasil membaca data tersebut, menghitung BMI, dan menampilkan status gizi, indikator posisi, rekomendasi, serta rentang berat badan ideal.
4. Hasil dapat dicetak lewat tombol **Cetak Laporan**.

Format data yang disimpan:

```json
{ "weight": 65, "heightCm": 170, "age": 25, "gender": "pria" }
```

## Rumus & Kategori BMI

```
BMI = berat badan (kg) / (tinggi badan (m))²
```

| Kategori | Rentang BMI |
|---|---|
| Kurus | < 18.5 |
| Normal | 18.5 – 24.9 |
| Kelebihan berat badan | 25.0 – 27.0 |
| Obesitas | > 27.0 |

Rentang berat badan ideal dihitung dari BMI 18.5 – 24.9 sesuai tinggi badan pengguna.

## Catatan

Hasil perhitungan bersifat penilaian awal gizi mandiri dan bukan pengganti saran dokter atau tenaga kesehatan profesional.
