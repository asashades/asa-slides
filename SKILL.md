---
name: slide-interaktif-animatif
description: Membuat slide deck HTML interaktif-animatif (alur panah, motion graphic explainer 2D/3D, kuis opsional, menu grid, ekspor PDF) dari materi PDF atau Markdown untuk mata kuliah, pelatihan, presentasi project, atau sidang/seminar skripsi. Gunakan saat user mengirim materi dan minta slide interaktif.
---

# Slide Interaktif Animatif

Mengubah materi (PDF atau .md) menjadi satu deck HTML yang dipresentasikan dengan tombol panah. Cocok untuk perkuliahan, pelatihan, presentasi project, dan sidang atau seminar skripsi; kuis hanya dipakai bila user memilihnya. Tiap konsep kunci dijelaskan lewat **motion graphic explainer** bertahap, bukan teks yang muncul satu per satu. Bahasa slide mengikuti materi (default Bahasa Indonesia).

## Isi skill

| File | Kapan dibaca |
|---|---|
| `references/katalog-explainer.md` | Fase 3 dan saat menulis adegan |
| `references/jenis-presentasi.md` | Fase 2 dan 5: struktur bagian dan default kuis/timer per jenis presentasi |
| `references/tema.md` | Fase 2 (pilihan tema/palet) dan saat mengisi token |
| `references/anti-slop.md` | Sebelum menulis slide dan saat membaca hasil audit |
| `references/mesin-slide.md` | Sebelum membangun (Fase 6–7) |
| `references/3d-threejs.md` | Hanya bila ada adegan 3D |
| `assets/engine-template.html` | Titik awal setiap deck. Jangan menulis mesin slide dari nol. |
| `assets/galeri-explainer.html` | Dikirim ke user di Fase 3; sumber pola SVG/CSS saat menulis adegan. |
| `scripts/` | `fa-sprite.js`, `uji-deck.js`, `audit-slop.js`, `kontak-sheet.js`, `render-pdf.js` (butuh Node + Playwright) |
| `scripts/` (opsional) | `rekam-gif.js`, `rekam-deck-gif.js`: rekam GIF untuk README/pratinjau repo (butuh ffmpeg). Hanya bila user minta materi publikasi. |

## Workflow

Jangan menulis kode slide sebelum Fase 5 disetujui. Jangan membangun deck penuh sebelum prototipe Fase 6 disetujui.

**Fase 1. Bedah materi.** Baca seluruh materi. Catat pesan utama (satu kalimat), 5–8 konsep kunci yang layak dianimasikan, angka/rumus yang bisa dihitung, kasus yang bisa jadi benang merah, serta **metafora visual & objek fisik dunia nyata** untuk tiap konsep (benda nyata, wadah, alat/perangkat, atau kendaraan apa yang paling tepat mewakili input, transformasi, dan output konsep itu). Cek ulang hitungan di materi. Jangan memakai angka atau kutipan jurnal yang tidak bisa diverifikasi; contoh buatan diberi label ilustrasi.

**Fase 2. Pertanyaan dasar** (satu putaran, pilihan ganda bila tersedia; jangan tanya ulang yang sudah dijawab):
1. Jenis presentasi: kuliah, pelatihan, presentasi project, sidang atau seminar skripsi, atau lainnya. Jenis ini menentukan struktur bagian (`references/jenis-presentasi.md`).
2. Durasi (menit), termasuk jatah tanya jawab bila ada, dan audiensnya (siapa, kira-kira berapa orang).
3. Tema: clean, minimalist, editorial, neobrutalism, pixel art, atau lainnya.
4. Palet: cool, warm, orange, hijau, monokrom, earth tone, atau warna institusi.
5. **Kuis dan interaktivitas: pakai atau tidak?** Pilihan: tanpa kuis (presentasi murni), kuis kilat, polling, atau latihan dengan hitung mundur. Usul bawaan: pakai untuk kuliah dan pelatihan, tanpa untuk presentasi project dan sidang atau seminar skripsi. Tanyakan juga timer tampil atau disembunyikan (`DECK.timer`).
   Bila jawabannya tanpa kuis, jangan menambahkan slide kuis, polling, atau latihan di bagian mana pun.

**Fase 3. Brainstorming koreografi & pilih explainer.** Ingat bahwa kode `E1–E30` adalah **kosakata gerak dasar**, bukan templat satu kotak datar. Adegan yang imersif menggabungkan 2–3 teknik gerak ke dalam panggung multi-zona (`viewBox="0 0 1040 336"`) dengan benda fisik nyata dan **rantai gerak simultan** (lihat bagian Koreografi Imersif di `references/katalog-explainer.md`).

Untuk tiap konsep kunci, kirim tabel brainstorming berisi:
- **Objek fisik & metafora panggung** (bukan sekadar kotak teks + ikon; mis. 4 objek transaksi nyata bergerak satu per satu ke **1 peti besar terbuka** vs **3 kotak kecil terkunci**, atau **HP memotret struk dengan blitz -> berubah jadi pesawat kertas terbang -> masuk ke printer yang mencetak 3 laporan standar**).
- **2 opsi koreografi kreatif** (kombinasi kode `E1–E30` beserta mekanisme perpindahan, reaksi alat/wadah, dan angka berjalan) serta alasan singkat.

Tanyakan ke user untuk brainstorming bersama:
- Opsi koreografi mana yang dipilih untuk tiap konsep, atau apakah ada adegan imajinatif khusus yang diinginkan user (boleh "terserah rekomendasi").
- 2D, 3D (three.js), atau campuran; 3D hanya untuk adegan yang lebih jelas di ruang.
- Apakah ingin menampilkan karakter pemandu berganti pose/ekspresi per tahap (`data-now` + `.only`).
- Intensitas gerak: halus, sedang, atau ramai.
Sertakan `assets/galeri-explainer.html` (demo hidup E1–E13; E14–E30 dijelaskan dengan kalimat): terbitkan sebagai halaman bila ada alat publikasi, atau kirim filenya.

**Fase 4. Benang merah.** Usulkan satu cerita berjalan (satu kasus/benda yang diikuti dari awal sampai akhir, judul slide berupa pertanyaan tentang benda itu) atau contoh lepas. Default: satu cerita bila materi punya studi kasus.

**Fase 5. Plan.** Kirim lalu tunggu persetujuan:
- Pesan utama dan hook pembuka.
- Rundown per bagian (menit, totalnya = durasi; patokan satu slide per 2–3 menit).
- Daftar slide bernomor: judul + jenis (statis / N tahap, dan kuis / polling / latihan hanya bila dipilih di Fase 2).
- Untuk sidang atau seminar: bagian "Cadangan" berisi slide tanya jawab yang bisa dilompati lewat menu grid.
- Storyboard tiap adegan explainer (template di katalog): **metafora objek fisik (Input -> Transmisi/Alat -> Output)**, kombinasi kode explainer, 2D/3D, dan tabel **tahap -> rantai gerak simultan (3–5 perubahan visual sekaligus: gerak objek `data-move`/`[data-s]`, reaksi alat/wadah, cascade `--i`, gambar garis `.draw`, dan `count()`) -> keterangan**.
- Arah visual: tema, palet, font.
- Keputusan yang diambil sendiri (mis. referensi yang dibuang) agar user bisa membatalkan.

**Fase 6. Prototipe.** Salin `assets/engine-template.html`, isi token tema dan konfigurasi, buat helper komponen/objek SVG reusable di `[C]` (karakter, mesin, perangkat, wadah, atau prop khas materi), lalu bangun cover + 1–2 adegan explainer paling penting dengan koreografi multi-zona penuh. Uji (`uji-deck.js`, `audit-slop.js`), buat lembar kontak untuk dicek mata, kirim, minta persetujuan tampilan dan koreografi gerak.

**Fase 7. Bangun penuh** dengan mesin yang sama (`references/mesin-slide.md`). Tulis slide di bagian `[D]`, gaya adegan di `[B]`, sisipkan sprite ikon dengan `fa-sprite.js`.

**Fase 8. Uji lalu kirim.**
```bash
node scripts/uji-deck.js deck.html        # overflow 3 ukuran layar, HP, panah, kuis, grid, error JS
node scripts/audit-slop.js deck.html      # aturan anti slop, tema terang dan gelap
node scripts/kontak-sheet.js deck.html kontak        # lalu lihat gambarnya; ulangi dengan argumen dark
node scripts/render-pdf.js deck.html deck.pdf        # bila PDF diminta
```
Audit animasi: hitung adegan explainer terhadap syarat minimum di katalog, dan bandingkan tangkapan tahap awal, tengah, akhir tiap adegan. Perbaiki semua temuan sebelum mengirim, atau beri pengecualian yang disengaja. Balasan akhir singkat: apa yang dibuat, jumlah slide, cara pakai (panah, G untuk grid), apa yang sudah dan belum dicek.

## Aturan inti (detail di references)

- Semua gerak lewat panah: → maju tahap/slide, ← mundur, ↑↓ pilihan kuis/polling, G grid, ketik nomor + Enter untuk lompat, T timer, F layar penuh. Tidak ada input, slider, atau kalkulator yang harus diketik; perubahan angka ditampilkan sebagai alur bertahap.
- Muat di 1280×720, 1366×768, 1920×1080 tanpa scroll, di HP tanpa scroll horizontal, mode gelap, reduced motion.
- Kuis, polling, dan latihan bersifat opsional. Tanpa itu, deck tetap utuh: ditutup dengan ringkasan dan langkah lanjut, bukan kuis.
- Anti AI slop wajib: substansi tanpa filler, ikon Font Awesome tanpa emoji, tanpa strip aksen kiri/atas kartu, tanpa gradien ungu/dekoratif, tanpa kartu bersarang, plus seluruh daftar di `references/anti-slop.md`.

## Revisi

Ubah hanya bagian terkait, jalankan ulang `uji-deck.js` dan `audit-slop.js`, kirim ke file/tautan yang sama. Sebutkan bila nomor slide bergeser.
