# Plan: Redesign/Revamp Undangan Nikah — nikah-yuk

## Context

Website undangan nikah Nurul & Fahri saat ini ada di Canva (fahrydesignworks.my.canva.site). User ingin membangun ulang total sebagai website mandiri dengan:

- **Warna baru**: Primary #FFF9D2 (krem hangat) + Secondary #00392C (forest green)
- **Arah desain**: A — "Surat Krem Elegan" (seperti undangan cetak premium di kertas krem)
- **Tema**: Dual mode light + dark
- **Deployment**: Netlify, single-page
- **Referensi section**: https://astridaniqbal.pazvanka.site/ (digunakan sebagai acuan section modern)
- **Dihapus**: Section Ucapan Pimpinan dan Pesan 4 Divisi (tidak relevan untuk format ini)

Proyek `d:\Projects\nikah-yuk` saat ini masih **kosong**. Dibangun dari awal dengan vanilla HTML/CSS/JS, tanpa build tools, seperti pola `perahu-kertas` dan `nurul-fahri`.

---

## Design System

### Color Tokens (OKLCH)

**Light Mode (default — "Surat Krem"):**
```css
--cream-bg:     oklch(0.98 0.046 95)           /* #FFF9D2 — main background */
--green-ink:    oklch(0.28 0.07 158)           /* #00392C — primary text + structural */
--green-mid:    oklch(0.38 0.07 158)           /* #1a5c44 — secondary text */
--green-light:  oklch(0.52 0.075 158)          /* #2e7d5a — muted labels */
--gold-accent:  oklch(0.54 0.10 80)            /* #8B6914 — ornamental touches */
--gold-warm:    oklch(0.65 0.11 82)            /* #B8860B — highlight */
--cream-card:   oklch(0.99 0.025 95)           /* #FFFEF5 — card surfaces */
--border:       oklch(0.28 0.07 158 / 0.18)   /* green ink at 18% */
```

**Dark Mode (toggled via `[data-theme="dark"]`):**
```css
--cream-bg:     oklch(0.24 0.065 158)          /* #002d22 — deep forest base */
--green-ink:    oklch(0.98 0.046 95)           /* #FFF9D2 — cream as primary text */
--green-mid:    oklch(0.87 0.04 90)            /* #e8dbb0 — secondary text */
--green-light:  oklch(0.75 0.045 150)          /* #a6c2ac — muted labels */
--gold-accent:  oklch(0.78 0.13 85)            /* #d4af37 — gold (dari nurul-fahri) */
--cream-card:   oklch(0.30 0.06 158)           /* card surfaces — sedikit lebih terang */
--border:       oklch(0.98 0.046 95 / 0.15)   /* cream at 15% */
```

### Typography (reuse dari nurul-fahri — sudah teruji)
- **Amiri** — semua teks Arab (Bismillah, doa, ayat, hadits)
- **Marcellus** — nama pengantin, heading section
- **EB Garamond** — body text, terjemahan, narasi
- **Mulish** — nav, form, button, label UI

### Ornamen SVG (adapt dari `nurul-fahri/assets/ornaments/`)
- Khatam (bintang 8 titik) — divider dan motif background
- Mihrab arch — hero decoration
- Circular geometric — section markers
- Background pattern: khatam repeat @ opacity 0.04 (light) / 0.06 (dark)

---

## Sections — 9 Section

Berdasarkan referensi astridaniqbal.pazvanka.site + content nurul-fahri:

| # | ID | Nama Section | Konten Utama |
|---|-----|------|------|
| 1 | `#hero` | Pembuka | Bismillah Arab, doa nikah, foto/ilustrasi pasangan, nama Nurul & Fahri, "Ahad 5 Juli 2026" |
| 2 | `#profil` | Profil Pengantin | Foto + nama + info singkat masing-masing + nama orang tua + Instagram link |
| 3 | `#acara` | Informasi Acara | Countdown timer real-time + detail Akad + detail Resepsi + tombol Google Maps |
| 4 | `#kisah` | Kisah Kami | Narasi perjalanan pasangan dalam 4–5 segmen (timeline / cerita per momen) |
| 5 | `#galeri` | Galeri | Grid foto (12 foto) dengan lightbox klik untuk perbesar |
| 6 | `#rsvp` | Konfirmasi Kehadiran | Form RSVP: nama, jumlah tamu, hadir/tidak, kirim ke Firebase |
| 7 | `#hadiah` | Hadiah | Info rekening bank (2 bank) + alamat fisik + tombol copy-to-clipboard tiap item |
| 8 | `#ayat` | Doa & Ayat | QS Ar-Rum:21 (Arab + terjemahan) + Hadits Al-Baihaqi + penutup sakinah mawaddah warahmah |
| 9 | `#tamu` | Buku Tamu | Form ucapan: nama, pesan, kirim ke Firebase Realtime DB. Daftar ucapan real-time |

**Navigasi Persisten:**
- Brand: "Nurul & Fahri"
- Link ke semua 9 section
- Toggle musik (audio)
- Toggle tema dark/light
- Hamburger menu di mobile (≤768px)

---

## File Structure

```
d:\Projects\nikah-yuk\
├── index.html
├── assets\
│   ├── css\
│   │   └── style.css
│   ├── js\
│   │   ├── main.js
│   │   └── firebase-config.js
│   ├── img\
│   │   ├── nurul.jpg          (foto mempelai wanita — diisi user)
│   │   ├── fahri.jpg          (foto mempelai pria — diisi user)
│   │   └── gallery\           (12 foto galeri — diisi user)
│   ├── audio\
│   │   └── lagu-pernikahan.mp3
│   └── ornaments\
│       ├── khatam.svg
│       ├── mihrab.svg
│       └── geometric.svg
├── netlify.toml
├── robots.txt
├── CLAUDE.md
├── DESIGN.md
└── README.md
```

---

## Implementation Steps

---

### FASE A — Prototyping dengan huashu-design (SEBELUM implementasi penuh)

> **Mengapa fase ini wajib:** huashu-design mengharuskan 3 HTML prototype dibuat dulu dan ditunjukkan ke user sebelum commit ke full build. "Pilihan dari teks saja tidak efektif — user harus lihat visual nyata dulu." Fase ini mencegah arah desain yang salah setelah sudah 500+ baris CSS ditulis.

**Langkah A1 — Buat folder `design-demos/` di `nikah-yuk/`**

Buat 3 file HTML prototype (`hero + 1 section`), masing-masing menggunakan logika berbeda:

**Demo 1 — Logika Acak (🎲 Roulette dari 40 style huashu-design)**
- Ambil detik saat ini, hitung `detik % 20 + 1` → pilih style nomor itu dari library huashu-design
- Implementasikan visual DNA style tersebut pada hero + section profil
- File: `design-demos/demo-roulette.html`

**Demo 2 — Logika Referensi Nyata (🏆 Benchmark Terbaik)**
- Benchmark: **Jasmine & Kaito** oleh [Charlee Li / Studio Frisch](https://studiofrisch.com) atau undangan Indonesia terbaik di Awwwards
- Pelajari: layout sistem, tipografi pairing, micro-detail, cara Islamic ornamen diintegrasikan ke desain modern
- Terapkan pada konten Nurul & Fahri dengan palet #FFF9D2 + #00392C
- File: `design-demos/demo-benchmark.html`

**Demo 3 — Logika Desainer Terbaik (🧠 Deep Breath — Pentagram / Collins approach)**
- Tanya: "Jika ada budget unlimited, desainer mana yang paling tepat untuk undangan nikah Islam Indonesia premium?"
- Jawaban: **Budi Pradono Architects / Erik Spiekermann approach** — tipografi sangat kuat, ornamen minimal tapi presisi, white space besar, konten sebagai hero
- Implementasikan filosofi desain tersebut
- File: `design-demos/demo-terbaik.html`

**Langkah A2 — Screenshot tiap demo**
```
npx playwright screenshot file:///d:/Projects/nikah-yuk/design-demos/demo-roulette.html demo-roulette.png --viewport-size=1440,900
npx playwright screenshot file:///d:/Projects/nikah-yuk/design-demos/demo-benchmark.html demo-benchmark.png --viewport-size=1440,900
npx playwright screenshot file:///d:/Projects/nikah-yuk/design-demos/demo-terbaik.html demo-terbaik.png --viewport-size=1440,900
```

**Langkah A3 — Tunjukkan 3 screenshot ke user**
- User memilih salah satu (atau kombinasi: "ambil layout Demo 2, warna Demo 3")
- Setelah user confirm → lanjut ke Fase B (implementasi penuh)
- **Jangan mulai Step 1 sebelum ada konfirmasi dari user**

---

### FASE B — Implementasi Penuh

### Step 1 — Fondasi & Konfigurasi
- Init struktur direktori
- Buat `CLAUDE.md` (PRD dengan design constraints Direction A)
- Buat `DESIGN.md` (token warna OKLCH, tipografi, komponen)
- Buat `netlify.toml` (security headers, `Content-Security-Policy`, redirect `/` → `index.html`)
- Buat `robots.txt` (noindex/nofollow)
- Copy ornamen SVG dari `d:\Projects\nurul-fahri\assets\ornaments\`
- Copy audio dari `d:\Projects\nurul-fahri\assets\audio\` (jika dipakai ulang)

### Step 2 — style.css
- CSS Custom Properties (semua token light + dark)
- Base reset + box-sizing + scroll-behavior
- Google Fonts import (Amiri, Marcellus, EB Garamond, Mulish)
- Layout: container max-width 1200px, section padding
- **Komponen per-section:**
  - `nav` — sticky, blur backdrop, link active state, hamburger mobile
  - `#hero` — full-height, mihrab ornamen, centered text
  - `#profil` — 2-column card (Nurul | Fahri), nama orang tua, Instagram link
  - `#acara` — countdown display (digit besar), 2 event card + Maps button
  - `#kisah` — vertical timeline, segmen cerita, connector line
  - `#galeri` — CSS grid masonry-like, hover overlay, lightbox modal
  - `#rsvp` — form card, radio hadir/tidak, jumlah tamu selector
  - `#hadiah` — rekening card dengan copy button, status toast
  - `#ayat` — ayat block (Arab + terjemahan), ornamen geometri
  - `#tamu` — form card, entry list dengan avatar inisial
- Dark mode via `[data-theme="dark"]` selector
- Scroll-reveal utility (`.reveal`, `.reveal-stagger`)
- Responsive: mobile-first 390px → 768px → 1200px+
- `prefers-reduced-motion` fallback untuk semua animasi

### Step 3 — index.html
- Markup semantik, `<section id="...">` tiap section
- Meta tags: Open Graph (title, description, image untuk WhatsApp share), viewport, charset
- Firebase SDK via CDN
- Placeholder foto (gunakan `assets/img/placeholder-*.svg` sampai user upload foto asli)
- Semua Arabic text dari nurul-fahri (Bismillah, QS Ar-Rum:21, Hadits)
- Konten section yang butuh input user ditandai dengan komentar `<!-- TODO: isi ... -->`

### Step 4 — main.js
- **Nav**: scroll-active highlighting, hamburger toggle, smooth scroll
- **Theme**: `localStorage` persist, swap `data-theme` attribute pada `<html>`
- **Music**: play/pause dengan autoplay policy handling (butuh interaksi user dulu)
- **Countdown**: `setInterval` tiap detik menuju `2026-07-05T00:00:00+07:00`, update DOM
- **Lightbox galeri**: klik foto buka modal full-screen, keyboard ESC tutup
- **Copy-to-clipboard**: navigator.clipboard.writeText(), toast "Disalin!"
- **RSVP form**: submit ke Firebase Realtime DB (path `/rsvp`), validasi, success state
- **Guestbook**: submit ke Firebase Realtime DB (path `/guestbook`), render entries real-time, karakter counter, avatar inisial
- **Scroll reveal**: IntersectionObserver dengan stagger delay untuk elemen anak

### Step 5 — Design Audit dengan skill /impeccable

> **Tujuan:** Bukan QA fungsional — ini *design review* untuk memastikan tampilan layak kirim sebagai undangan premium. Jalankan `/impeccable` pada hasil build sebelum deploy.

**Visual Hierarchy**
- Apakah mata terpandu dengan benar: Hero nama besar → profil → acara → kisah?
- Apakah heading Marcellus vs body EB Garamond kontrasnya cukup jelas di semua section?
- Apakah ornamen khatam membantu hierarki atau justru menjadi noise?

**Typography**
- `text-wrap: pretty` pada semua paragraf panjang (EB Garamond terjemahan)
- Line-height teks Arab Amiri (harus lebih besar ~1.8–2.0 karena harakat)
- Letter-spacing Marcellus untuk nama pengantin (slight tracking untuk kesan elegan)
- Ukuran font Arabic pada mobile — tidak boleh terlalu kecil (<18px)

**Spacing & Rhythm**
- Vertical rhythm antar section: konsisten (tidak ada yang terlalu rapat atau longgar)
- Card padding: apakah profil card dan event card punya breathing room cukup?
- Countdown digit: apakah gap antar satuan (Hari/Jam/Menit/Detik) proporsional?

**Color & Ornamen**
- Gold-accent (#8B6914 light / #d4af37 dark) dipakai secukupnya — bukan di setiap elemen
- Background khatam pattern: opacity 0.04 di light mode (tidak boleh ganggu readability)
- Border cards: konsistensi ketebalan (semua 1px atau semua 1.5px, tidak campur)
- Dark mode: pastikan TIDAK ada warna hardcoded yang "bocor" saat toggle

**Micro-interactions**
- Hover card profil: subtle lift atau border brighten (bukan scale besar)
- Tombol copy rekening: feedback visual jelas (warna berubah + "Disalin!")
- Nav link active state: garis bawah atau warna berbeda saat scroll ke section
- Submit button: loading state saat proses kirim Firebase

**Mobile UX (390px)**
- Nav hamburger: tap target ≥44px
- Countdown digit: cukup besar terbaca tanpa zoom
- Gallery grid: 2-kolom di mobile, bukan 3
- Form RSVP: input tidak kepotong keyboard virtual

**UX Copy (Bahasa Indonesia)**
- Placeholder form: natural, bukan "Masukkan nama Anda"
- Success message guestbook: hangat, bukan robotik
- Tombol Maps: jelas ("Buka di Google Maps" bukan "Maps")
- Error state form: helpful, bukan generic

**Aksesibilitas**
- WCAG AA contrast: #00392C on #FFF9D2 (~9.8:1 ✓), #FFF9D2 on #002d22 (~9.2:1 ✓)
- `aria-label` pada tombol icon (music toggle, theme toggle, hamburger)
- `prefers-reduced-motion`: semua animasi punya fallback

### Step 6 — QA Fungsional
- Test countdown angka turun benar ke 5 Juli 2026
- Test copy-to-clipboard (toast muncul, clipboard berisi teks benar)
- Test lightbox galeri (buka/tutup/keyboard ESC)
- Test RSVP form submit → data masuk Firebase `/rsvp`
- Test guestbook submit + render real-time → Firebase `/guestbook`
- Test theme toggle + persistensi `localStorage` setelah refresh
- Test hamburger menu mobile, smooth scroll ke section
- Test Amiri font loading (Arabic render benar dengan harakat)
- Check OG preview via ogp.me (untuk share WhatsApp)

---

## Konten yang Butuh Diisi User (Sebelum Launch)

```
[ ] Foto Nurul (portrait, rasio 1:1 atau 3:4)
[ ] Foto Fahri (portrait, rasio 1:1 atau 3:4)
[ ] 12 foto galeri (format landscape atau potrait)
[ ] Nama orang tua Nurul (ayah & ibu)
[ ] Nama orang tua Fahri (ayah & ibu)
[ ] Instagram Nurul & Fahri (jika mau ditampilkan)
[ ] Narasi "Kisah Kami" (5 segmen cerita)
[ ] Waktu & tempat Akad Nikah (jam, nama venue, alamat)
[ ] Waktu & tempat Resepsi (jam, nama venue, alamat)
[ ] Link Google Maps venue
[ ] Rekening Bank 1 (nama bank, no rekening, a.n.)
[ ] Rekening Bank 2 (nama bank, no rekening, a.n.)
[ ] Alamat fisik untuk hadiah
[ ] Firebase config (apiKey, authDomain, databaseURL)
[ ] File audio musik latar
```

---

## Referensi Kode yang Dipakai Ulang

| File Sumber | Dipakai Untuk |
|---|---|
| `nurul-fahri/assets/css/style.css` | Pola komponen quote-card, ornamen, CSS Islamic |
| `nurul-fahri/assets/js/main.js` | Scroll-reveal, theme toggle, guestbook Firebase |
| `nurul-fahri/index.html` | Markup Arabic text, QS Ar-Rum:21, Hadits |
| `perahu-kertas/js/main.js` | Pola countdown timer |
| `nurul-fahri/assets/ornaments/` | SVG ornament khatam dan geometri Islam |

---

## Verifikasi End-to-End

**Fase A (huashu-design — sebelum full build):**
1. `design-demos/` berisi 3 file HTML prototype yang bisa dibuka di browser
2. Screenshot 3 demo tersedia, ditunjukkan ke user untuk dipilih
3. User konfirmasi arah desain sebelum lanjut ke Fase B

**Fase B (implementasi + impeccable + QA):**
4. Buka `index.html` → semua 9 section tampil, nav bisa scroll ke tiap section
5. `/impeccable` dijalankan → minimal 3 item "Fix" diselesaikan sebelum deploy
6. Countdown berjalan mundur menuju 5 Juli 2026
7. Dark/light toggle berfungsi dan persist setelah refresh
8. Klik foto galeri → lightbox terbuka, ESC menutup
9. Tombol copy rekening → toast "Disalin!" + clipboard berisi nomor rekening
10. Submit RSVP + guestbook → data masuk Firebase, entry muncul real-time
11. Mobile 390px: nav hamburger, layout responsive, Arabic terbaca
12. `netlify deploy --prod` → URL live, OG preview benar di WhatsApp
