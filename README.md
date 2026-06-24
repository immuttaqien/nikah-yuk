# Website Undangan Pernikahan

Undangan pernikahan digital satu halaman (single-page). Vanilla HTML/CSS/JS, tanpa build step. Deploy ke Netlify.

- **Tanggal:** Ahad, 5 Juli 2026
- **Palet:** `#FFF9D2` (krem) · `#00392C` (forest green)
- **Tema:** Light (default) + Dark (toggle)
- **Tipografi:** Playfair Display · DM Sans · Amiri

## Section

| # | ID | Nama |
|---|-----|------|
| 1 | `#hero` | Pembuka — Bismillah, nama, doa nikah |
| 2 | `#profil` | Mempelai — profil, orang tua, Instagram |
| 3 | `#acara` | Acara — countdown + Akad & Resepsi + Google Maps |
| 4 | `#kisah` | Kisah Kami — timeline perjalanan |
| 5 | `#galeri` | Galeri — 5 foto + lightbox |
| 6 | `#tamu` | Buku Tamu — RSVP + ucapan (gabung) |
| 7 | `#hadiah` | Hadiah — rekening bank + copy-to-clipboard |
| 8 | `#ayat` | Doa & Ayat — QS Ar-Rum 21 & Hadits Al-Baihaqi |

## Menjalankan Lokal

Buka `index.html` langsung di browser. Tidak perlu server atau build step.

Untuk fitur clipboard dan autoplay audio, jalankan via server lokal:

```bash
npx serve .
```

## Firebase (RSVP & Buku Tamu)

Data RSVP dan ucapan disimpan di Firebase Realtime Database.
Konfigurasi ada di `assets/js/firebase-config.js`.

### Rules yang harus di-set di Firebase Console

```json
{
  "rules": {
    "rsvp": {
      ".read": "auth != null",
      ".write": true
    },
    "guestbook": {
      ".read": true,
      ".write": true,
      "$entry": {
        ".validate": "newData.hasChildren(['nama', 'pesan']) &&
                      newData.child('nama').val().length <= 50 &&
                      newData.child('pesan').val().length <= 300"
      }
    }
  }
}
```

- `rsvp` — hanya bisa dibaca saat login (via Firebase Console), tamu tetap bisa kirim
- `guestbook` — read/write terbuka (ditampilkan publik), dengan validasi panjang field

## Deploy ke Netlify

```bash
# via CLI
npm i -g netlify-cli
netlify deploy --prod
```

Atau drag-and-drop folder ini ke https://app.netlify.com/drop.

`netlify.toml` sudah dikonfigurasi dengan:
- Security headers (CSP, X-Frame-Options, X-Content-Type-Options, dll.)
- Cache: `index.html` no-cache, aset statis 1 tahun, CSS/JS 1 hari
- Redirect fallback SPA `/* → /index.html`

## Struktur File

```
nikah-yuk/
├── index.html
├── netlify.toml
├── robots.txt
├── assets/
│   ├── css/style.css
│   ├── js/
│   │   ├── main.js
│   │   └── firebase-config.js
│   ├── img/
│   │   ├── nurul.png
│   │   ├── fahri.png
│   │   ├── favicon.png
│   │   ├── og-cover.jpg
│   │   └── gallery/        (5 foto: q, r, w, t, e)
│   ├── audio/
│   │   └── lagu-pernikahan.mp3
│   └── ornaments/
│       └── mihrab.svg
└── __master/
    └── design-demos/       (3 prototype desain awal)
```
