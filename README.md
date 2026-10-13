# NutriCheck — Kerangka & Halaman 1 (Beranda)

Aplikasi cek status gizi (BMI), dikerjakan 4 orang, satu file HTML per halaman.

## Struktur

```
nutricheck/
├── index.html              ← Halaman 1: Beranda  (SUDAH JADI)
├── kalkulator.html         ← Halaman 2: Kalkulator BMI  (belum)
├── hasil.html              ← Halaman 3: Hasil BMI       (belum)
├── panduan.html            ← Halaman 4: Panduan BMI     (belum)
├── css/style.css           ← CSS bersama
└── js/
    ├── tailwind-config.js  ← konfigurasi warna/font Tailwind (bersama)
    └── common.js           ← menu mobile (bersama)
```

## Aturan bersama (agar tampilan seragam)

1. **Nama file harus persis** seperti di atas. Navbar & tombol di Beranda
   sudah menautkan ke `kalkulator.html`, `hasil.html`, `panduan.html`.
2. Mulai dengan menyalin `index.html` dan ganti namanya (mis.
   `kalkulator.html`). `<head>`, navbar, dan footer sudah ada. Ganti
   `<title>`, lalu **hapus seluruh isi `<section id="page-beranda"> ... </section>`**
   dan tulis isi halamanmu di sana (ganti id-nya, mis. `page-kalkulator`).
   Pertahankan `class="tab-page active ..."` pada `<section>` agar halaman tampil.
3. Pakai Tailwind CSS (CDN) dengan palet **emerald/teal** + font **Inter**,
   seperti di `index.html`.
4. Satu halaman = satu file JS sendiri di folder `js/`
   (mis. `js/kalkulator.js`, `js/hasil.js`), dipanggil di akhir `<body>`
   setelah `js/common.js`.
5. Jangan mengubah file bersama (`style.css`, `tailwind-config.js`,
   `common.js`, navbar, footer) tanpa kabari tim. Kalau navbar/footer
   berubah, ubah di keempat halaman.
6. Tandai menu aktif di navbar pada halaman masing-masing:
   - **Desktop:** pada link `<a ... id="nav-beranda">` ganti class
     `text-emerald-600 bg-emerald-50 border border-emerald-200` menjadi
     `text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50`, lalu
     pasang class aktif (yang lama) di link halamanmu.
   - **Mobile:** pada link `index.html` di menu mobile ganti
     `text-emerald-600 bg-emerald-50` menjadi `text-slate-700`, lalu pasang
     class aktif itu di link halamanmu.

## Pembagian

| Halaman | File | Penanggung jawab |
|---|---|---|
| 1. Beranda + kerangka bersama | `index.html`, `css/`, `js/common.js` | ... |
| 2. Kalkulator BMI | `kalkulator.html`, `js/kalkulator.js` | ... |
| 3. Hasil BMI | `hasil.html`, `js/hasil.js` | ... |
| 4. Panduan BMI | `panduan.html` | ... |

## Catatan alur data (Halaman 2 → 3)

Karena tiap halaman adalah file terpisah, data hasil perhitungan dikirim
lewat `localStorage` dengan kunci `nutricheck_data`:

```js
// Halaman 2 (setelah validasi) – simpan lalu pindah halaman
localStorage.setItem('nutricheck_data', JSON.stringify({ weight, heightCm, age, gender }));
window.location.href = 'hasil.html';

// Halaman 3 – baca saat halaman dibuka
const data = JSON.parse(localStorage.getItem('nutricheck_data'));
```

Isi `gender` adalah `"pria"` atau `"wanita"`; `weight` dalam kg, `heightCm` dalam cm.

## Cara menjalankan

Buka `index.html` langsung di browser (butuh internet untuk CDN Tailwind,
Font Awesome, dan Google Fonts).

Rumus BMI: `berat (kg) / (tinggi (m))²`.
Kategori: Kurus < 18.5 · Normal 18.5–24.9 · Kelebihan 25.0–27.0 · Obesitas > 27.0
