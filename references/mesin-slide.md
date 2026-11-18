# Mesin slide (assets/engine-template.html)

Salin `assets/engine-template.html` menjadi file deck baru, lalu ubah hanya empat bagian bertanda:

| Bagian | Isi |
|---|---|
| `[A] TOKEN TEMA` | Variabel warna, font, radius di `:root` (terang) dan dua blok gelap. Lihat `tema.md`. |
| `[B] CSS ADEGAN` | Gaya khusus adegan explainer deck ini. Beri id unik per adegan (`#cx`, `#ember`) agar selektor tidak bentrok. |
| `[C] KONFIGURASI` | `DECK.course`, `meeting`, `presenter`, dan `sections` (nama + menit, totalnya = durasi). |
| `[D] SLIDE` | Satu `add(...)` per slide. Hapus slide contoh. |

Bagian bertanda MESIN tidak perlu diubah: navigasi panah, tahap, kuis, grid, lompat nomor, timer per bagian, progres, tema, layar penuh, swipe, hash `#slide-n`, reduced motion, mode cetak, dan API uji.

## Menulis slide

```js
add(1, {                                  // 1 = indeks bagian di DECK.sections
  title: 'Tas ini dibuat dari apa?',      // dipakai heading dan menu grid
  steps: 4,                               // jumlah tahap (default 1)
  caps: ['...', '...', '...', '...'],     // satu kalimat keterangan per tahap
  html: () => head() + '<div class="scene"><svg id="tas" viewBox="0 0 760 330">...</svg></div>',
  step: (s, c) => { count(c.q('#tot'), s >= 3 ? 150000 : 0, rp, c.anim); },
  bind: root => {},                       // dipanggil setiap slide dirender (mis. buat renderer 3D)
  leave: () => {},                        // dipanggil saat meninggalkan slide (hentikan loop, dispose)
  vert: (d, shift) => false               // tombol ↑↓; kembalikan true bila dipakai (mis. polling)
});

add(1, { title: 'Kuis', quiz: { q: 'Pertanyaan?', o: ['A', 'B', 'C'], a: 1, e: 'Penjelasan singkat.' } });
```

Slide kuis opsional: bila user memilih tanpa kuis, jangan tulis `add(..., {quiz})` sama sekali. Engine, grid, dan `uji-deck.js` berjalan normal tanpanya. `DECK.timer:false` menyembunyikan timer (tombol T ikut nonaktif). Pemetaan `DECK` per jenis presentasi ada di `jenis-presentasi.md`.

Engine otomatis menambahkan keterangan, titik tahap, "Tahap n dari N", dan tombol ulang animasi untuk slide dengan `steps > 1`. Jangan menulis kontrol itu sendiri.

## Sistem tahap (tanpa JS)

| Atribut / kelas | Efek |
|---|---|
| `data-from="2"` | Tampil mulai tahap 2 (fade + geser kecil; di SVG hanya fade). |
| `data-to="3"` | Hilang lagi setelah tahap 3 (dipakai bersama `data-from`). |
| `data-now="2 3"` | Disorot pada tahap 2 dan 3; elemen `data-now` lain diredupkan saat itu. |
| `data-move="2"` | Mulai tahap 2 mendapat kelas `.mv`: tulis posisi/keadaan keduanya di `[B]`, mis. `#tas .flap.mv{transform:translate(48px,-44px)}`. Elemen tetap terlihat sejak awal. |
| `.only` + `data-now="0 1 3"` | Hanya tampil di tahap yang disebut (mis. mulut cemberut di tahap 0, 1, 3 dan senyum di tahap 2). |
| `.stage[data-s]` | Tidak ada di engine; pakai `step(s,c)` untuk menyetel `c.root.dataset.s = s` bila butuh keadaan per tahap di CSS (level air, sudut timbangan). |
| `.draw` + `pathLength="1"` | Garis/kurva/panah menggambar sendiri saat `.on`. |
| `.grow-y` / `.grow-x` | Batang tumbuh dari bawah / dari kiri saat `.on`. |

Pola tiap kode explainer (E1–E13) ada di `assets/galeri-explainer.html`; salin SVG dan CSS-nya ke slide lalu ganti isinya. Gerak lain ditulis di `[B]` sebagai transisi CSS yang dipicu `.on`, `.mv`, atau `.now`. Contoh berpindah:

```css
#tas .nota.mv{transform:translate(220px,40px)}   /* <g class="nota" data-move="2"> */
```

Easing pakai `var(--ease)`. Jangan pakai easing bounce/elastic.

## Teknik Koreografi Imersif & Multi-Gerak

Untuk membuat adegan panggung lebar (`viewBox="0 0 1040 336"`) yang kaya tanpa menabrak aturan `anti-slop.md`:

1. **Koreografi Multi-Titik lewat `dataset.s` (`#sc[data-s="n"]`):**
   Setel `const e = c.q('#sc'); if (e) e.dataset.s = s;` di fungsi `step(s, c)` slide tersebut. Dengan selektor `#sc[data-s="1"] .obj`, satu objek dapat meluncur ke beberapa posisi berbeda di tahap 1, 2, dan 3 (mis. struk di HP -> berubah/terbang sebagai pesawat kertas di tengah -> mendarat masuk ke celah printer) atau memutar roda gigi bertahap (`rotate(120deg)` -> `rotate(240deg)` -> `rotate(360deg)`).
2. **Gerak Beruntun / Cascade (`style="--i:0"`, `--i:1`, `--i:2`):**
   Tulis di `[B]`:
   ```css
   #sc .itm { opacity: 0; transform: translateY(-18px); transition: opacity .35s var(--ease), transform .5s var(--ease); transition-delay: calc(var(--i) * 90ms); }
   #sc .on .itm { opacity: 1; transform: none; }
   ```
   Pakai ini agar 4 jenis transaksi meluncur satu per satu ke wadahnya, balok biaya jatuh bertumpuk, atau 3 lembar laporan tercetak keluar dari printer secara berurutan hanya dengan satu kali menekan panah `→`.
3. **Masking Urutan DOM (*Paint Order*):**
   Di SVG, elemen yang digambar lebih awal berada di belakang elemen berikutnya. Gambarlah objek bergerak (peti di konveyor, pesawat kertas masuk slot, lembar laporan yang keluar) **sebelum** bodi depan mesin/printer/wadah sehingga objek tampak benar-benar masuk ke dalam mesin atau keluar dari celah printer.
4. **Fungsi Pembangun Prop & Karakter Reusable di `[C]`:**
   Tulis fungsi JS pembuat objek SVG di `[C]` (mis. `phone()`, `plane()`, `printer()`, `chest()`, `lockbox()`, `gearSvg()`, `crate()`, atau karakter pemandu `asa(x, yb, scale, pose, extra)`) dengan `rect { shape-rendering: crispEdges }` untuk tema Pixel Art atau path rapi untuk tema lain. Pakai `.only` + `data-now="0"`, `"1 2"`, `"3"` agar ekspresi/pose karakter berganti mengikuti alur cerita.
5. **Tata Letak Aman di Layar HP (390px) & Proyektor 720p:**
   - Tambahkan `#app { grid-template-columns: minmax(0, 1fr); }` di `[B]` agar `DECK.course` yang panjang tidak melebarkan grid pada viewport `390px`.
   - Atur `@media (max-height: 820px) { .scene svg { max-height: 41vh; } }` bila caption 2 baris agar `uji-deck.js` tetap 0 overflow di `1280×720`.
   - Jika membuat SVG ilustrasi mini di cover, sertakan elemen `<text>` atau `<path>` bermakna agar tidak terdeteksi `[placeholder-illustration]` oleh `audit-slop.js`.

## Helper

| Helper | Fungsi |
|---|---|
| `head(judul?, lede?)` | Eyebrow bagian + h2 judul (default `title` slide) + lede opsional. |
| `ico('nama-ikon')` | Ikon Font Awesome inline. Ikon harus ada di sprite (lihat di bawah). |
| `count(el, tujuan, format, anim)` | Angka berjalan ke nilai tujuan. |
| `rp(v)`, `pct(v, desimal)` | Format Rupiah dan persen Indonesia. |
| Kelas isi | `.card`, `.g2`, `.g3`, `.list`, `.formula`, `.scene`, `.tag`, `.lede`, `.cover`, `.meta`, `.scroll-x` |

## Ikon

Ikon disimpan sebagai sprite inline di antara `<!--FA-SPRITE-->` dan `<!--/FA-SPRITE-->`. Setelah menambah ikon di slide, sisipkan ulang sprite dengan daftar lengkap ikon yang dipakai:

```bash
npm i @fortawesome/free-solid-svg-icons@6
node scripts/fa-sprite.js --inject deck.html rotate-left border-all circle-half-stroke expand chevron-left chevron-right play pause xmark circle-check lightbulb <ikon-baru ...>
```

Ikon bawaan mesin (jangan dihapus): rotate-left, border-all, circle-half-stroke, expand, chevron-left, chevron-right, play, pause, xmark, circle-check, lightbulb.

## API uji (window.deck)

`deck.count()`, `deck.go(i, 'last')` (tahap terakhir, kuis terbuka), `deck.state()`, `deck.titles()`, `deck.print(true)`. Semua skrip di `scripts/` memakai API ini.

## Menyerahkan file

- Agen dengan alat publikasi halaman (mis. Artifact di claude.ai): ikuti kontrak alat itu. Untuk Artifact, halaman diterbitkan tanpa `<!doctype>`, `<html>`, `<head>`, `<body>`: pindahkan `<title>`, `<link>` font, dan `<style>` ke awal isi, lalu sisanya apa adanya.
- Agen lain: serahkan file `.html` utuh.
