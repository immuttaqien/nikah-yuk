/* ============================================================
   Template data pribadi — salin file ini ke site-data.js
   dan isi dengan data asli. site-data.js TIDAK di-commit
   ke git (lihat .gitignore) supaya alamat & rekening asli
   tidak pernah masuk ke history repo publik.
   ============================================================ */

window.NY_SITE_DATA = {
  acara: {
    akad: {
      alamat: "Nama jalan, kelurahan, kecamatan, kabupaten/kota, kode pos",
      mapsUrl: "https://maps.app.goo.gl/xxxxxxxx",
    },
    resepsi: {
      alamat: "Nama jalan, kelurahan, kecamatan, kabupaten/kota, kode pos",
      mapsUrl: "https://maps.app.goo.gl/xxxxxxxx",
    },
  },

  rekening: {
    jago: {
      nomor: "0000 0000 0000", // format tampilan
      nomorCopy: "000000000000", // format polos untuk tombol salin
      atasNama: "Nama Pemilik Rekening",
    },
    mandiri: {
      nomor: "0000 0000 0000",
      nomorCopy: "000000000000",
      atasNama: "Nama Pemilik Rekening",
    },
  },

  hadiahAlamat: {
    text: "Nama Penerima, Alamat lengkap satu baris",
    copy: "Nama Penerima, Alamat lengkap satu baris",
  },
};
