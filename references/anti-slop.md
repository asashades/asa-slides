# Aturan anti AI slop

Gabungan aturan pemilik skill dan daftar anti-pattern [impeccable.style](https://impeccable.style/anti-patterns), disesuaikan untuk slide. Kolom **Cek** menunjukkan cara memeriksanya:

- **otomatis**: dideteksi `node scripts/audit-slop.js deck.html` (kode aturan di kurung siku).
- **review**: dinilai mata saat melihat lembar kontak (`scripts/kontak-sheet.js`).

Setiap temuan adalah alasan untuk melihat lebih dekat, bukan larangan mutlak. Bila sebuah pilihan memang disengaja (mis. bayangan keras di tema neobrutalism atau pixel art), tandai pengecualiannya:

- satu deck: `<html data-slop-allow="hard-shadow">`
- satu elemen: `data-slop-ok="nested-card"`

## Aturan pemilik skill (wajib, tidak boleh dikecualikan kecuali diminta)

| Aturan | Cek |
|---|---|
| Teks fokus pada substansi. Buang subjudul yang mengulang judul, petunjuk yang sudah jelas ("klik untuk…"), keterangan seperti "Hari 1 dari 7", kalimat penutup basa-basi. | review |
| Ikon pakai Font Awesome (sprite inline). Tanpa emoji. | otomatis `[emoji]` |
| Tanpa strip/garis aksen berwarna di kiri atau atas kartu. Bedakan kartu dengan ikon, nomor/label berwarna, latar tint tipis, atau border penuh tipis. | otomatis `[side-tab]` |
| Hindari gradien ungu dan gradien dekoratif. Pakai warna rata. | otomatis `[purple-gradient]` `[decorative-gradient]` |
| Hindari kartu bersarang: maksimal satu tingkat kotak. | otomatis `[nested-card]` |
| Jangan pasang angka/kutipan jurnal dari materi yang tidak bisa diverifikasi. Angka ilustrasi diberi label "ilustrasi". | review |

## Tipografi

| Aturan | Cek |
|---|---|
| Hindari font pasaran Inter dan Geist. Pakai pasangan di `tema.md`. | otomatis `[overused-font]` |
| Minimal dua peran font (judul dan isi); satu font untuk semuanya terasa datar. | otomatis `[single-font]` |
| Hierarki tipe jelas: judul, lede, isi, label punya ukuran berbeda nyata. | review |
| Hindari headline serif italic raksasa dan hero yang terlalu besar. | review |
| Teks isi dan antarmuka minimal 14px (isi slide idealnya ≥16px). | otomatis `[tiny-text]` |
| Teks panjang tidak huruf kapital semua; label pendek boleh. | otomatis `[all-caps-body]` |
| Tidak ada teks justified. | otomatis `[justified-text]` |
| Line height paragraf minimal 1,3. | otomatis `[tight-line-height]` |
| Letter spacing: judul tidak lebih rapat dari −0,03em; teks panjang tidak direnggangkan. | otomatis `[tight-tracking]` `[wide-tracking-body]` |
| Panjang baris paragraf maksimal sekitar 75 karakter. | otomatis `[long-line]` |
| Tidak ada satu kata sendirian di baris terakhir paragraf; judul tidak menyisakan baris pendek (pakai `text-wrap:balance/pretty`). | otomatis `[orphan-word]` + review |
| Level heading tidak dilompati (h1 cover, h2 judul slide, h3 isi). | otomatis `[skipped-heading]` |

## Warna dan latar

| Aturan | Cek |
|---|---|
| Hindari palet "AI": ungu + cyan terang di latar gelap. | review |
| Tanpa teks gradien. | otomatis `[gradient-text]` |
| Tanpa halo radial-gradient atau sorotan lembut di belakang konten. | otomatis `[radial-halo]` |
| Hindari palet krem/beige sebagai latar utama kecuali diminta. | review |
| Mode gelap tanpa aksen neon yang menyala; turunkan saturasi. | review |
| Kontras teks minimal WCAG AA (4,5:1; teks besar 3:1), di tema terang dan gelap. | otomatis `[low-contrast]` |
| Hindari teks abu-abu di atas latar berwarna. | otomatis `[gray-on-color]` |
| Tanpa glassmorphism (backdrop blur) di mana-mana. | otomatis `[glassmorphism]` |

## Tata letak dan kartu

| Aturan | Cek |
|---|---|
| Hindari grid kartu identik berulang sebagai pola utama slide. Variasikan bentuk: tabel, daftar, adegan, angka besar. | review |
| Tanpa ikon dalam kotak rounded di atas heading. Taruh ikon sejajar teks. | otomatis `[icon-tile-above-heading]` |
| Tanpa border berwarna tebal pada elemen rounded. | otomatis `[thick-colored-border]` |
| Radius kartu wajar (≤ 20px). | otomatis `[extreme-radius]` |
| Hindari border tipis + shadow lebar. | otomatis `[thin-border-wide-shadow]` |
| Shadow offset keras hanya bila tema neobrutalism/pixel art dipilih. | otomatis `[hard-shadow]` |
| Tanpa latar grid dekoratif dan stripe repeating-gradient (kecuali bermakna, mis. tanda "hilang" di grafik). | otomatis `[gradient-stripes]` + review |
| Jarak tidak monoton: jarak antargrup lebih besar dari jarak di dalam grup; heading lebih dekat ke isinya daripada ke bagian sebelumnya. | review |
| Padding cukup, teks tidak menempel ke tepi layar. | review |
| Konten tidak meluap dari container atau layar. | otomatis `[overflow]` + `uji-deck.js` |

## Motion

| Aturan | Cek |
|---|---|
| Tanpa titik status berkedip, kursor kedip dekoratif, atau marquee. Animasi berulang hanya bila menjelaskan sesuatu (mis. tetes bocor). | otomatis `[infinite-animation]` |
| Tanpa easing bounce/elastic. Pakai `var(--ease)`. | otomatis `[bounce-easing]` |
| Konten tidak boleh tetap tersembunyi karena animasi masuk gagal. Tahap terakhir harus memperlihatkan semuanya; mesin menampilkan semua bila JS mati. | otomatis `[hidden-content]` |

## Copywriting

| Aturan | Cek |
|---|---|
| Tanpa em-dash (—). Pakai titik, koma, atau titik dua. | otomatis `[em-dash]` |
| Tanpa kontras paksa seperti "Bukan fitur. Tapi platform." | otomatis `[forced-contrast]` |
| Tanpa kata "theater"/"teater" sebagai metafora. | otomatis `[theater-word]` |
| Teks yang sama tidak diulang dalam satu slide. | otomatis `[repeated-text]` |

## Gambar dan ilustrasi

| Aturan | Cek |
|---|---|
| Ilustrasi SVG rapi dan bermakna, bukan coretan kasar. | review |
| Tanpa ilustrasi placeholder yang hanya lingkaran dan kotak tanpa label. | otomatis `[placeholder-illustration]` |
| Tanpa mask gambar bergerigi, overlay hampir opak di atas gambar, gambar rusak, atau teks tertutup elemen lain. | review |

## Konsistensi design system

Semua warna, font, radius, dan ukuran berasal dari token di `[A] TOKEN TEMA`. Jangan menulis warna heksadesimal langsung di slide kecuali di `[B] CSS ADEGAN` untuk ilustrasi, dan itu pun sebaiknya merujuk token.
