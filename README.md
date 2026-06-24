# Undangan Pernikahan — Nurul & Fahri

Undangan pernikahan digital satu halaman (single-page). Vanilla HTML/CSS/JS, tanpa build step. Siap deploy ke Netlify.

- **Tanggal:** Ahad, 5 Juli 2026
- **Palet:** `#FFF9D2` (krem) · `#00392C` (forest green)
- **Tema:** Light (default) + Dark (toggle)
- **Arah desain:** Editorial Minimalis + tipografi Playfair Display · DM Sans · Amiri

## Section

1. **Hero** — Bismillah, nama, doa nikah
2. **Mempelai** — profil + orang tua + Instagram
3. **Acara** — countdown + Akad & Resepsi + Google Maps
4. **Kisah Kami** — timeline perjalanan
5. **Galeri** — grid foto + lightbox
6. **RSVP** — konfirmasi kehadiran
7. **Hadiah** — rekening bank + copy-to-clipboard
8. **Doa & Ayat** — QS Ar-Rum 21 & Hadits
9. **Buku Tamu** — ucapan & doa

## Menjalankan Lokal

Cukup buka `index.html` di browser. Tidak perlu server.
(Untuk menguji clipboard & autoplay, jalankan via `npx serve` atau Live Server.)

## Yang Perlu Diisi Sebelum Launch

Cari komentar `<!-- TODO: ... -->` di `index.html`:

- [ ] Foto Nurul & Fahri → `assets/img/nurul.jpg`, `assets/img/fahri.jpg`
- [ ] 10 foto galeri → `assets/img/gallery/1.jpg` … `10.jpg`
- [ ] Gambar OG share → `assets/img/og-cover.jpg` (1200×630)
- [ ] Nama orang tua kedua mempelai
- [ ] Link Instagram
- [ ] Narasi "Kisah Kami"
- [ ] Waktu, nama venue & alamat Akad / Resepsi
- [ ] Link Google Maps (ganti `https://maps.google.com/`)
- [ ] Nomor rekening & nama pemilik (BRI / BCA)
- [ ] Alamat pengiriman hadiah
- [ ] (Opsional) Musik latar → `assets/audio/lagu-pernikahan.mp3`

## Mengaktifkan Firebase (Opsional)

Secara default RSVP & Buku Tamu disimpan di **localStorage** (per-perangkat).
Untuk penyimpanan terpusat real-time, edit `assets/js/firebase-config.js`:
isi `config`, set `enabled: true`. SDK Firebase akan dimuat otomatis.

## Deploy ke Netlify

```bash
# via CLI
npm i -g netlify-cli
netlify deploy --prod
```

Atau drag-and-drop folder ini ke https://app.netlify.com/drop.
