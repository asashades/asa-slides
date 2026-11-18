# Tema dan palet

Tema mengatur bentuk (font, radius, garis, bayangan); palet mengatur warna. Keduanya diganti di `[A] TOKEN TEMA` pada deck. Warna semantik selalu ada: `--bad` (rugi, salah, gejala), `--warn` (peringatan, masalah), `--good` (benar, solusi, akar). Setelah mengganti token, jalankan `audit-slop.js` untuk cek kontras di tema terang dan gelap.

## Tema

| Tema | Font (Google Fonts) | Bentuk | Catatan |
|---|---|---|---|
| **Clean** (default template) | Bricolage Grotesque (judul), Plus Jakarta Sans (isi), JetBrains Mono (label/angka) | Radius 12px, border 1px, tanpa bayangan | Satu warna aksen. |
| **Minimalist** | Instrument Sans (judul, 600), Instrument Sans (isi), IBM Plex Mono | Radius 6px, hampir tanpa border, ruang kosong lebar | Hampir monokrom; aksen hanya untuk sorotan tahap. Naikkan `--gap` ke 28px. |
| **Editorial** | Fraunces (judul, tegak, bukan italic), Source Sans 3 (isi), IBM Plex Mono | Radius 4px, garis horizontal tipis sebagai pemisah | Angka besar, kolom rapi, tabel bergaris. |
| **Neobrutalism** | Archivo Black (judul), Archivo (isi), Space Mono | Radius 0–6px, border 2,5px warna `--ink`, bayangan keras `4px 4px 0 var(--ink)` | Wajib `<html data-slop-allow="hard-shadow">`. Warna blok kontras. |
| **Pixel art (bright)** | Pixelify Sans (judul), Plus Jakarta Sans (isi), Silkscreen (label pendek) | Sudut bertangga `clip-path:polygon(...)`, border 3px, bayangan keras 4px tanpa blur | `data-slop-allow="hard-shadow"`. Ilustrasi sprite dari `<rect>` dengan `shape-rendering:crispEdges`; 3D bergaya voxel (kubus warna rata). Font piksel hanya untuk judul dan label pendek. |

Hindari Inter dan Geist (terdeteksi `[overused-font]`) kecuali font brand institusi.

## Palet

Nilai untuk tema terang; versi gelap mengikuti pola template (latar gelap kebiruan, aksen dinaikkan kecerahannya tapi saturasi diturunkan supaya tidak neon).

| Palet | `--bg` | `--surface` | `--ink` | `--accent` | `--accent-soft` | Gelap: `--bg` / `--accent` |
|---|---|---|---|---|---|---|
| Cool (biru/teal) | #F3F6F8 | #FFFFFF | #13202A | #0B6E8A | #DCEEF3 | #0F161C / #5BBBD3 |
| Warm (terakota) | #F7F3EF | #FFFFFF | #2A1D16 | #A4472A | #F5E1D8 | #1A1310 / #E0896B |
| Earth tone (perkamen & kayu) | #F4EFE6 | #FFFDF9 | #261A12 | #8F3F1E | #F5E2D6 | #18130F / #E6946B |
| Orange | #F7F4F0 | #FFFFFF | #1F1A14 | #C2560C | #FBE5D4 | #17120D / #F0995A |
| Hijau | #F2F6F3 | #FFFFFF | #142019 | #1F7A4D | #DCEFE3 | #0F1712 / #6CC79A |
| Monokrom | #F5F5F4 | #FFFFFF | #1A1A19 | #2E2E2C | #E7E7E5 | #121212 / #D8D8D5 |
| Pixel bright cool | #E8F4FF | #FFFFFF | #0B2545 | #1B6CFF | #D6E6FF | #0A1628 / #6FA3FF |

Aturan warna:
- Jangan pakai ungu (hue 250–320) sebagai aksen utama atau gradien.
- `--muted` harus tetap ≥ 4,5:1 terhadap `--bg` dan `--surface`.
- Warna semantik di palet warm/orange/earth tone: pastikan `--bad` tetap terbedakan dari `--accent` (geser `--accent` ke cokelat/terakota/oranye tua, `--bad` merah bata tegas).
- Pada Pixel Art: gunakan `border: 2px solid var(--ink); border-radius: 0; box-shadow: 4px 4px 0 var(--ink);` (dengan `<html data-slop-allow="hard-shadow">`) agar bayangan keras tampil tajam tanpa memicu `[thick-colored-border]` dari `audit-slop.js`.
- Latar rata. Tidak ada halo radial atau gradien latar.
