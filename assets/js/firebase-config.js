/* ============================================================
   Konfigurasi Firebase (OPSIONAL)
   ------------------------------------------------------------
   Secara default website memakai localStorage agar langsung
   berfungsi tanpa setup apa pun.

   Untuk menyimpan RSVP & Buku Tamu secara terpusat (real-time
   lintas perangkat), aktifkan Firebase Realtime Database:

   1. Buat project di https://console.firebase.google.com
   2. Aktifkan "Realtime Database" (mode test untuk awal)
   3. Salin konfigurasi web app ke bawah ini
   4. Ubah NY_FIREBASE.enabled menjadi true
   5. main.js akan otomatis memuat SDK Firebase & memakai DB
   ============================================================ */

window.NY_FIREBASE = {
  enabled: false, // ← ubah ke true setelah mengisi config di bawah

  config: {
    apiKey: "",
    authDomain: "",
    databaseURL: "", // wajib untuk Realtime Database
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
  },
};
