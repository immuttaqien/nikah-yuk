/* ============================================================
   Undangan Pernikahan — Nurul & Fahri
   Interaksi: nav · tema · musik · countdown · reveal ·
              galeri lightbox · copy · RSVP · buku tamu
   Penyimpanan: Firebase Realtime DB (jika diaktifkan) /
                localStorage (default)
   ============================================================ */
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ─────────────────────────────────────────────
     1. NAV — scrolled state, active link, mobile menu
     ───────────────────────────────────────────── */
  const nav = $("#nav");
  const navMobile = $("#navMobile");
  const burger = $("#navBurger");

  const onScroll = () => {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 20);
    const tt = $("#toTop");
    if (tt) tt.classList.toggle("show", window.scrollY > 600);
    updateActiveLink();
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  if (burger && navMobile) {
    const closeMenu = () => {
      navMobile.classList.remove("open");
      burger.setAttribute("aria-label", "Buka menu");
    };
    burger.addEventListener("click", () => {
      const open = navMobile.classList.toggle("open");
      burger.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    });
    $$("a", navMobile).forEach((a) => a.addEventListener("click", closeMenu));
  }

  // active link berdasarkan section yang terlihat
  const sections = $$("section[id], header[id]");
  const linkFor = {};
  $$(".nav-links > a").forEach((a) => {
    const id = a.getAttribute("href").slice(1);
    linkFor[id] = a;
  });
  function updateActiveLink() {
    let current = "";
    const mid = window.scrollY + window.innerHeight * 0.35;
    sections.forEach((s) => {
      if (s.offsetTop <= mid) current = s.id;
    });
    Object.values(linkFor).forEach((a) => a.classList.remove("active"));
    if (linkFor[current]) linkFor[current].classList.add("active");
  }

  /* ─────────────────────────────────────────────
     2. TEMA — toggle + persist
     ───────────────────────────────────────────── */
  const themeToggle = $("#themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const dark = document.documentElement.classList.toggle("dark");
      try {
        localStorage.setItem("ny_theme", dark ? "dark" : "light");
      } catch (e) {}
      const meta = $('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", dark ? "#002016" : "#FFF9D2");
    });
  }

  /* ─────────────────────────────────────────────
     3. MUSIK — play/pause + autoplay handling
     ───────────────────────────────────────────── */
  const audio = $("#bgMusic");
  const audioToggle = $("#audioToggle");
  let audioReady = false;

  if (audio && audioToggle) {
    audioToggle.classList.add("audio-muted"); // mulai dalam keadaan diam

    const playAudio = () => {
      audio.play().then(
        () => audioToggle.classList.remove("audio-muted"),
        () => audioToggle.classList.add("audio-muted")
      );
    };

    audioToggle.addEventListener("click", () => {
      if (audio.paused) playAudio();
      else {
        audio.pause();
        audioToggle.classList.add("audio-muted");
      }
    });

    // coba mulai musik saat interaksi pertama (kebijakan autoplay browser)
    const tryFirstPlay = () => {
      if (audioReady) return;
      audioReady = true;
      playAudio();
      window.removeEventListener("pointerdown", tryFirstPlay);
      window.removeEventListener("keydown", tryFirstPlay);
    };
    window.addEventListener("pointerdown", tryFirstPlay, { once: false });
    window.addEventListener("keydown", tryFirstPlay, { once: false });
  }

  /* ─────────────────────────────────────────────
     4. COUNTDOWN
     ───────────────────────────────────────────── */
  const TARGET = new Date("2026-07-05T10:00:00+07:00").getTime();
  const cd = {
    hari: $("#cd-hari"),
    jam: $("#cd-jam"),
    menit: $("#cd-menit"),
    detik: $("#cd-detik"),
  };
  function tick() {
    const diff = TARGET - Date.now();
    if (diff <= 0) {
      Object.values(cd).forEach((el) => el && (el.textContent = "00"));
      return;
    }
    const hari = Math.floor(diff / 86400000);
    const jam = Math.floor((diff % 86400000) / 3600000);
    const menit = Math.floor((diff % 3600000) / 60000);
    const detik = Math.floor((diff % 60000) / 1000);
    if (cd.hari) cd.hari.textContent = String(hari).padStart(2, "0");
    if (cd.jam) cd.jam.textContent = String(jam).padStart(2, "0");
    if (cd.menit) cd.menit.textContent = String(menit).padStart(2, "0");
    if (cd.detik) cd.detik.textContent = String(detik).padStart(2, "0");
  }
  if (cd.hari) {
    tick();
    setInterval(tick, 1000);
  }

  /* ─────────────────────────────────────────────
     5. REVEAL on scroll
     ───────────────────────────────────────────── */
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const revealEls = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
    // Fallback keamanan: pastikan konten tidak pernah "terjebak" tersembunyi
    window.addEventListener("load", () => {
      setTimeout(() => {
        revealEls.forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.top < window.innerHeight) el.classList.add("in");
        });
      }, 400);
    });
  }

  /* ─────────────────────────────────────────────
     6. GALERI lightbox
     ───────────────────────────────────────────── */
  const galGrid = $("#galeri-grid");
  if (galGrid) {
    const items = $$(".gal-item", galGrid);
    // bangun lightbox
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML = `
      <button class="lb-close" aria-label="Tutup"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      <button class="lb-nav prev" aria-label="Sebelumnya"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>
      <img alt="Foto galeri" />
      <button class="lb-nav next" aria-label="Berikutnya"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>`;
    document.body.appendChild(lb);
    const lbImg = $("img", lb);
    let idx = 0;

    const srcOf = (item) => {
      const img = $("img", item);
      return img ? img.src : null;
    };
    const open = (i) => {
      const src = srcOf(items[i]);
      if (!src) return; // placeholder belum ada foto
      idx = i;
      lbImg.src = src;
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      lb.classList.remove("open");
      document.body.style.overflow = "";
    };
    const step = (d) => {
      let n = idx;
      for (let k = 0; k < items.length; k++) {
        n = (n + d + items.length) % items.length;
        if (srcOf(items[n])) {
          open(n);
          return;
        }
      }
    };

    items.forEach((it, i) => it.addEventListener("click", () => open(i)));
    $(".lb-close", lb).addEventListener("click", close);
    $(".lb-nav.prev", lb).addEventListener("click", () => step(-1));
    $(".lb-nav.next", lb).addEventListener("click", () => step(1));
    lb.addEventListener("click", (e) => {
      if (e.target === lb) close();
    });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
  }

  /* ─────────────────────────────────────────────
     7. COPY to clipboard + toast
     ───────────────────────────────────────────── */
  const toast = $("#toast");
  let toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        resolve();
      } catch (e) {
        reject(e);
      }
      document.body.removeChild(ta);
    });
  }
  $$(".btn-copy").forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = btn.getAttribute("data-copy") || "";
      copyText(text).then(
        () => {
          showToast("Disalin ke clipboard ✓");
          const label = btn.innerHTML;
          btn.classList.add("copied");
          const span = btn.childNodes[btn.childNodes.length - 1];
          if (span && span.nodeType === 3) span.textContent = " Tersalin";
          setTimeout(() => {
            btn.classList.remove("copied");
            btn.innerHTML = label;
          }, 1800);
        },
        () => showToast("Gagal menyalin")
      );
    });
  });

  /* ─────────────────────────────────────────────
     8. STORE — Firebase / localStorage
     ───────────────────────────────────────────── */
  const Store = (function () {
    const cfg = window.NY_FIREBASE;
    let db = null;
    let useFb = false;

    function localGet(key) {
      try {
        return JSON.parse(localStorage.getItem(key) || "[]");
      } catch (e) {
        return [];
      }
    }
    function localPush(key, val) {
      const list = localGet(key);
      list.push(val);
      try {
        localStorage.setItem(key, JSON.stringify(list));
      } catch (e) {}
      return Promise.resolve();
    }

    // inisialisasi Firebase jika diaktifkan
    function init(cb) {
      if (cfg && cfg.enabled && cfg.config && cfg.config.databaseURL) {
        loadFirebase()
          .then(() => {
            firebase.initializeApp(cfg.config);
            db = firebase.database();
            useFb = true;
            cb && cb();
          })
          .catch(() => {
            useFb = false;
            cb && cb();
          });
      } else {
        cb && cb();
      }
    }

    function loadFirebase() {
      return new Promise((resolve, reject) => {
        if (window.firebase && window.firebase.database) return resolve();
        const a = document.createElement("script");
        a.src =
          "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js";
        a.onload = () => {
          const b = document.createElement("script");
          b.src =
            "https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js";
          b.onload = resolve;
          b.onerror = reject;
          document.head.appendChild(b);
        };
        a.onerror = reject;
        document.head.appendChild(a);
      });
    }

    function push(path, data) {
      data.ts = Date.now();
      if (useFb && db) return db.ref(path).push(data);
      return localPush("ny_" + path, data);
    }

    function listen(path, cb) {
      if (useFb && db) {
        db.ref(path)
          .orderByChild("ts")
          .on("value", (snap) => {
            const arr = [];
            snap.forEach((c) => arr.push(c.val()));
            cb(arr);
          });
      } else {
        cb(localGet("ny_" + path));
      }
    }

    return { init, push, listen };
  })();

  /* ─────────────────────────────────────────────
     9. FORM helpers
     ───────────────────────────────────────────── */
  function markInvalid(field, bad) {
    const wrap = field.closest(".field");
    if (wrap) wrap.classList.toggle("invalid", bad);
  }

  /* ── RSVP ── */
  const rsvpForm = $("#rsvpForm");
  if (rsvpForm) {
    const nama = $("#rsvp-nama");
    const fieldJumlah = $("#field-jumlah");
    const radios = $$('input[name="kehadiran"]', rsvpForm);

    // sembunyikan jumlah tamu jika tidak hadir
    radios.forEach((r) =>
      r.addEventListener("change", () => {
        const hadir = $("#hadir-ya").checked;
        if (fieldJumlah) fieldJumlah.style.display = hadir ? "" : "none";
      })
    );

    rsvpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      if (!nama.value.trim()) {
        markInvalid(nama, true);
        ok = false;
      } else markInvalid(nama, false);

      const chosen = radios.find((r) => r.checked);
      const choiceWrap = radios[0].closest(".field");
      if (!chosen) {
        choiceWrap.classList.add("invalid");
        ok = false;
      } else choiceWrap.classList.remove("invalid");

      if (!ok) return;

      const data = {
        nama: nama.value.trim(),
        kehadiran: chosen.value,
        jumlah: $("#hadir-ya").checked ? $("#rsvp-jumlah").value : "0",
      };
      Store.push("rsvp", data);
      rsvpForm
        .querySelectorAll(".field, button[type=submit]")
        .forEach((el) => (el.style.display = "none"));
      $("#rsvpSuccess").classList.add("show");
    });
  }

  /* ── Buku Tamu ── */
  const tamuForm = $("#tamuForm");
  if (tamuForm) {
    const nama = $("#tamu-nama");
    const asal = $("#tamu-asal");
    const pesan = $("#tamu-pesan");
    const counter = $("#tamuCount");

    if (pesan && counter) {
      pesan.addEventListener("input", () => {
        counter.textContent = pesan.value.length;
      });
    }

    tamuForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      if (!nama.value.trim()) {
        markInvalid(nama, true);
        ok = false;
      } else markInvalid(nama, false);
      if (!pesan.value.trim()) {
        markInvalid(pesan, true);
        ok = false;
      } else markInvalid(pesan, false);
      if (!ok) return;

      Store.push("guestbook", {
        nama: nama.value.trim(),
        asal: asal.value.trim(),
        pesan: pesan.value.trim(),
      });

      tamuForm
        .querySelectorAll(".field, button[type=submit]")
        .forEach((el) => (el.style.display = "none"));
      $("#tamuSuccess").classList.add("show");
    });
  }

  /* ── Render daftar buku tamu ── */
  const tamuList = $("#tamuList");
  const tamuTotal = $("#tamuTotal");
  function initial(name) {
    return (name || "?").trim().charAt(0).toUpperCase() || "?";
  }
  function esc(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }
  function renderTamu(list) {
    if (!tamuList) return;
    const arr = (list || []).slice().sort((a, b) => (b.ts || 0) - (a.ts || 0));
    if (tamuTotal) tamuTotal.textContent = arr.length;
    if (!arr.length) {
      tamuList.innerHTML =
        '<p class="tamu-empty">Belum ada ucapan. Jadilah yang pertama memberi doa. 🤍</p>';
      return;
    }
    tamuList.innerHTML = arr
      .map(
        (e) => `
      <div class="tamu-entry">
        <div class="tamu-avatar">${initial(e.nama)}</div>
        <div class="body">
          <div class="nm">${esc(e.nama || "Tamu")}${
          e.asal ? `<span class="from">· ${esc(e.asal)}</span>` : ""
        }</div>
          <p class="msg">"${esc(e.pesan || "")}"</p>
        </div>
      </div>`
      )
      .join("");
  }

  /* ─────────────────────────────────────────────
     10. INIT
     ───────────────────────────────────────────── */
  Store.init(() => {
    Store.listen("guestbook", renderTamu);
  });
  onScroll();
})();
